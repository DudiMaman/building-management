/**
 * Hebrew text handling for pdfkit.
 *
 * pdfkit lays out runs of glyphs left-to-right with no BiDi awareness;
 * Hebrew (and any RTL script) therefore renders backwards out of the box.
 * To produce visually-correct Hebrew in PDFs we need to:
 *
 *  1. Reverse the visual order of each Hebrew run so when pdfkit draws
 *     it L→R the glyphs appear in the right reading order.
 *  2. Keep Latin / numeric runs intact (they stay L→R inside the line).
 *  3. Mirror brackets / parentheses when they belong to a Hebrew run.
 *
 * This is a deliberately simple BiDi pass — it does not implement the
 * full Unicode BiDi algorithm (UAX #9), but covers the cases produced
 * by templates in this project (invoices, flyers): plain Hebrew, mixed
 * numbers, currency symbols, and punctuation.
 */

const HEBREW_RANGE = /[֐-׿יִ-ﭏ]/;
const MIRROR: Record<string, string> = {
  '(': ')',
  ')': '(',
  '[': ']',
  ']': '[',
  '{': '}',
  '}': '{',
  '<': '>',
  '>': '<',
};

export function containsHebrew(s: string): boolean {
  return HEBREW_RANGE.test(s);
}

/**
 * Shape a single line for visually-correct RTL rendering in pdfkit.
 * Splits the string into runs by script and reverses Hebrew runs.
 * Returns a string suitable to pass to doc.text() with `features: ['rtla']`
 * disabled (pdfkit's OpenType RTL is fragile in CJS builds).
 */
export function shapeRtlLine(line: string): string {
  if (!containsHebrew(line)) return line;

  // Split into alternating Hebrew / non-Hebrew runs.
  const runs: Array<{ rtl: boolean; text: string }> = [];
  let buf = '';
  let isRtl = HEBREW_RANGE.test(line[0] ?? '');
  for (const ch of line) {
    const charRtl = HEBREW_RANGE.test(ch);
    if (charRtl === isRtl) {
      buf += ch;
    } else {
      runs.push({ rtl: isRtl, text: buf });
      buf = ch;
      isRtl = charRtl;
    }
  }
  if (buf) runs.push({ rtl: isRtl, text: buf });

  // Visually-reverse the line: in an RTL line each LTR island stays
  // intact but its position relative to the line flips.
  const reversed = [...runs].reverse();
  return reversed
    .map((r) => {
      if (!r.rtl) return r.text;
      // Reverse the Hebrew glyphs and mirror any brackets.
      return [...r.text]
        .reverse()
        .map((c) => MIRROR[c] ?? c)
        .join('');
    })
    .join('');
}

/** Shape a multi-line string (each line handled independently). */
export function shapeRtl(text: string): string {
  return text.split('\n').map(shapeRtlLine).join('\n');
}
