import { describe, it, expect } from 'vitest';
import { PdfService } from './pdf.service';

describe('PdfService smoke', () => {
  const svc = new PdfService();

  it('renders an invoice PDF to a valid buffer', async () => {
    const buf = await svc.renderInvoice({
      tenant: { name: 'דמו ניהול', legal_name: 'דמו ניהול בע"מ', vat_id: '514228888' },
      invoice: {
        type: 'tax_invoice_receipt',
        serial_number: 1,
        issued_at: '2026-05-27T00:00:00Z',
        description: 'ועד בית מאי 2026',
        subtotal: 350,
        vat_rate_pct: 17,
        vat_amount: 59.5,
        total: 409.5,
        currency: 'ILS',
        ita_allocation_number: 'IL-12345678',
      },
      customer: { name: 'אבי כהן' },
      lineItems: [
        {
          description: 'ועד בית — דירה 4ב',
          quantity: 1,
          unit_price: 350,
          subtotal: 350,
          vat_rate_pct: 17,
          vat_amount: 59.5,
          total: 409.5,
        },
      ],
    });
    expect(buf.length).toBeGreaterThan(1000);
    // Every PDF starts with %PDF-
    expect(buf.slice(0, 5).toString('ascii')).toBe('%PDF-');
  });

  it('renders an A4 flyer PDF with QR', async () => {
    const buf = await svc.renderFlyer({
      tenant: { name: 'דמו ניהול', phone: '03-1234567' },
      building: { name: 'רחוב הרצל 12', address: 'הרצל 12, תל אביב' },
      qr_payload: 'https://app.example.com/claim?b=abc&s=xyz',
    });
    expect(buf.length).toBeGreaterThan(2000);
    expect(buf.slice(0, 5).toString('ascii')).toBe('%PDF-');
  });
});
