import Anthropic from '@anthropic-ai/sdk';

export const DEFAULT_MODEL = 'claude-sonnet-4-6';

let client: Anthropic | undefined;

export function getAnthropic(): Anthropic {
  if (client) return client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not set');
  }
  client = new Anthropic({ apiKey });
  return client;
}

export interface CompletionOptions {
  model?: string;
  systemPrompt: string;
  messages: Anthropic.Messages.MessageParam[];
  tools?: Anthropic.Messages.Tool[];
  maxTokens?: number;
  temperature?: number;
}

export async function complete(options: CompletionOptions): Promise<Anthropic.Messages.Message> {
  return getAnthropic().messages.create({
    model: options.model ?? DEFAULT_MODEL,
    system: options.systemPrompt,
    messages: options.messages,
    tools: options.tools,
    max_tokens: options.maxTokens ?? 1024,
    temperature: options.temperature ?? 0.3,
  });
}

/** Executes one tool call and returns a JSON-serializable result. */
export type ToolExecutor = (name: string, input: Record<string, unknown>) => Promise<unknown>;

export interface ToolLoopOptions {
  model?: string;
  systemPrompt: string;
  /** Conversation so far (plain user/assistant turns). */
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  tools: Anthropic.Messages.Tool[];
  executeTool: ToolExecutor;
  /** Safety cap on tool round-trips. Default 5. */
  maxIterations?: number;
  maxTokens?: number;
  temperature?: number;
}

export interface ToolLoopResult {
  reply: string;
  toolsUsed: string[];
  escalated: boolean;
}

/**
 * Runs a full multi-turn Claude tool-use loop: call the model, execute any
 * requested tools, feed the results back, and repeat until the model returns
 * a plain text answer (or the iteration cap is hit). Keeps all Anthropic SDK
 * types contained here so callers (NestJS services) need only supply an
 * `executeTool` callback. `escalate_to_human` flips the `escalated` flag.
 */
export async function completeWithTools(opts: ToolLoopOptions): Promise<ToolLoopResult> {
  const messages: Anthropic.Messages.MessageParam[] = opts.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const toolsUsed: string[] = [];
  let escalated = false;
  let reply = '';
  const maxIterations = opts.maxIterations ?? 5;

  for (let i = 0; i < maxIterations; i++) {
    const result = await complete({
      model: opts.model,
      systemPrompt: opts.systemPrompt,
      messages,
      tools: opts.tools,
      maxTokens: opts.maxTokens,
      temperature: opts.temperature,
    });

    const textThisTurn = result.content
      .filter((b): b is Anthropic.Messages.TextBlock => b.type === 'text')
      .map((b) => b.text)
      .join('');
    if (textThisTurn) reply = textThisTurn;

    const toolUses = result.content.filter(
      (b): b is Anthropic.Messages.ToolUseBlock => b.type === 'tool_use',
    );
    if (toolUses.length === 0) break;

    messages.push({ role: 'assistant', content: result.content });
    const toolResults: Anthropic.Messages.ToolResultBlockParam[] = [];
    for (const tu of toolUses) {
      toolsUsed.push(tu.name);
      if (tu.name === 'escalate_to_human') escalated = true;
      let output: unknown;
      try {
        output = await opts.executeTool(tu.name, (tu.input ?? {}) as Record<string, unknown>);
      } catch (err) {
        output = { error: (err as Error).message };
      }
      toolResults.push({
        type: 'tool_result',
        tool_use_id: tu.id,
        content: JSON.stringify(output ?? null),
      });
    }
    messages.push({ role: 'user', content: toolResults });
  }

  return { reply, toolsUsed, escalated };
}
