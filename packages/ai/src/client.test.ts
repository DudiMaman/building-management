import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Anthropic SDK so completeWithTools can be driven deterministically.
const createMock = vi.fn();
vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    messages = { create: createMock };
  },
}));

import { completeWithTools } from './client';

describe('completeWithTools (multi-turn tool loop)', () => {
  beforeEach(() => {
    process.env.ANTHROPIC_API_KEY = 'test-key';
    createMock.mockReset();
  });

  it('executes a requested tool, feeds the result back, and returns the final text', async () => {
    // Turn 1: model asks to use a tool. Turn 2: model answers in plain text.
    createMock
      .mockResolvedValueOnce({
        content: [{ type: 'tool_use', id: 'tu_1', name: 'lookup_balance', input: { person_id: 'p1' } }],
      })
      .mockResolvedValueOnce({
        content: [{ type: 'text', text: 'יתרתך היא 250 ש"ח.' }],
      });

    const executed: Array<{ name: string; input: Record<string, unknown> }> = [];
    const res = await completeWithTools({
      systemPrompt: 'sys',
      messages: [{ role: 'user', content: 'מה היתרה שלי?' }],
      tools: [],
      executeTool: async (name, input) => {
        executed.push({ name, input });
        return { balance: 250 };
      },
    });

    expect(executed).toEqual([{ name: 'lookup_balance', input: { person_id: 'p1' } }]);
    expect(res.toolsUsed).toEqual(['lookup_balance']);
    expect(res.escalated).toBe(false);
    expect(res.reply).toBe('יתרתך היא 250 ש"ח.');
    // One round-trip with the tool + one for the final answer.
    expect(createMock).toHaveBeenCalledTimes(2);
    // The tool result must be fed back as a user message before the 2nd call.
    const secondCallMessages = createMock.mock.calls[1]![0].messages;
    expect(JSON.stringify(secondCallMessages)).toContain('tool_result');
  });

  it('flags escalation when escalate_to_human is used', async () => {
    createMock
      .mockResolvedValueOnce({
        content: [{ type: 'tool_use', id: 'tu_2', name: 'escalate_to_human', input: { reason: 'angry' } }],
      })
      .mockResolvedValueOnce({ content: [{ type: 'text', text: 'מעביר לנציג.' }] });

    const res = await completeWithTools({
      systemPrompt: 'sys',
      messages: [{ role: 'user', content: 'תן לי בן אדם' }],
      tools: [],
      executeTool: async () => ({ ok: true }),
    });

    expect(res.escalated).toBe(true);
    expect(res.toolsUsed).toContain('escalate_to_human');
  });

  it('stops at the iteration cap instead of looping forever', async () => {
    // Always asks for a tool → must be bounded by maxIterations.
    createMock.mockResolvedValue({
      content: [{ type: 'tool_use', id: 'tu_x', name: 'search_kb', input: { query: 'x' } }],
    });

    const res = await completeWithTools({
      systemPrompt: 'sys',
      messages: [{ role: 'user', content: 'loop' }],
      tools: [],
      executeTool: async () => ({ hits: [] }),
      maxIterations: 3,
    });

    expect(createMock).toHaveBeenCalledTimes(3);
    expect(res.toolsUsed).toHaveLength(3);
  });
});
