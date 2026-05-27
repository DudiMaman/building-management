import { describe, it, expect } from 'vitest';
import { shapeRtlLine, containsHebrew } from './hebrew';

describe('hebrew shaping', () => {
  it('detects Hebrew characters', () => {
    expect(containsHebrew('שלום')).toBe(true);
    expect(containsHebrew('Hello')).toBe(false);
    expect(containsHebrew('123')).toBe(false);
    expect(containsHebrew('שלום world')).toBe(true);
  });

  it('reverses pure Hebrew', () => {
    // 'שלום' as visual L→R is 'םולש'.
    expect(shapeRtlLine('שלום')).toBe('םולש');
  });

  it('keeps Latin runs intact and flips overall order', () => {
    // 'שלום World' visually-shaped: Latin stays L→R but the Hebrew run is
    // reversed and Latin moves to the left side of the line.
    const result = shapeRtlLine('שלום World');
    expect(result).toContain('World');
    expect(result.indexOf('World')).toBeLessThan(result.indexOf('ם'));
  });

  it('passes pure ASCII through untouched', () => {
    expect(shapeRtlLine('Hello world 123')).toBe('Hello world 123');
  });

  it('flips bracket position around a Hebrew run', () => {
    // Parens are neutral / non-Hebrew runs: they swap to the opposite side
    // of the visually-reversed line. Full BiDi mirroring (UAX#9) is out of
    // scope; this matches what users see in invoice / flyer copy.
    expect(shapeRtlLine('(שלום)')).toBe(')םולש(');
  });
});
