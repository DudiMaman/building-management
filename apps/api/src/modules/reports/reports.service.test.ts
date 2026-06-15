import { describe, it, expect } from 'vitest';
import { ReportsService } from './reports.service';

const svc = new ReportsService({} as any);

describe('ReportsService.toCsv', () => {
  it('prepends a UTF-8 BOM and a header row inferred from keys', () => {
    const csv = svc.toCsv([{ full_name: 'דנה', outstanding: '250' }]);
    expect(csv.charCodeAt(0)).toBe(0xfeff); // BOM for Excel Hebrew
    expect(csv).toContain('full_name,outstanding');
    expect(csv).toContain('דנה,250');
  });

  it('escapes commas, quotes and newlines', () => {
    const csv = svc.toCsv([{ note: 'a,b "c"\nd' }]);
    expect(csv).toContain('"a,b ""c""\nd"');
  });

  it('returns just a BOM for an empty set', () => {
    expect(svc.toCsv([])).toBe('﻿');
  });
});
