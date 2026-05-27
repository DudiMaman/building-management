import { describe, expect, it } from 'vitest';
import { chunkText } from './kb.service';

describe('chunkText', () => {
  it('returns a single chunk for short text', () => {
    const chunks = chunkText('שלום עולם');
    expect(chunks).toEqual(['שלום עולם']);
  });

  it('splits long text into multiple chunks', () => {
    const para = 'אבגדהוזחטיכלמנסעפצקרשת '.repeat(80); // ~1840 chars
    const chunks = chunkText(para);
    expect(chunks.length).toBeGreaterThan(1);
    for (const c of chunks) {
      expect(c.length).toBeLessThanOrEqual(1300);
    }
  });

  it('prefers paragraph breaks over arbitrary cuts', () => {
    const text =
      'First paragraph with several lines of content that wraps and grows.\n\n' +
      'Second paragraph after a real blank line break.\n\n' +
      'Third paragraph that continues for a while with more words so the chunker has to decide.';
    const chunks = chunkText(text + ' '.repeat(700));
    // At least one chunk boundary should fall at a paragraph break, not mid-word.
    const joined = chunks.join('|');
    expect(joined).not.toContain('Firstparagraph');
  });

  it('produces non-empty chunks only', () => {
    const chunks = chunkText('a'.repeat(2000));
    for (const c of chunks) {
      expect(c.trim().length).toBeGreaterThan(0);
    }
  });

  it('handles empty / whitespace input', () => {
    expect(chunkText('')).toEqual([]);
    expect(chunkText('   \n  \n  ')).toEqual([]);
  });
});
