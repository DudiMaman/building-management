/**
 * PdfService — server-side PDF rendering for invoices, receipts, flyers.
 *
 * Uses pdfkit with embedded Hebrew TTFs (Heebo). When the Heebo TTF files
 * are missing from assets/fonts/, the service falls back to Helvetica so
 * PDFs are still produced; Hebrew glyphs just won't render correctly in
 * that case (documented in assets/fonts/README.md).
 *
 * SPEC §8 (flyer) + §11.8 / §37 (invoices).
 */
import { Injectable, Logger } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as QRCode from 'qrcode';
import { shapeRtl } from './hebrew';

const FONTS_DIR = join(process.cwd(), 'assets/fonts');
const HEEBO_REGULAR = join(FONTS_DIR, 'Heebo-Regular.ttf');
const HEEBO_BOLD = join(FONTS_DIR, 'Heebo-Bold.ttf');

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  vat_rate_pct: number;
  vat_amount: number;
  total: number;
}

export interface InvoicePdfInput {
  tenant: {
    name: string;
    legal_name: string | null;
    vat_id: string | null;
    address?: string;
  };
  invoice: {
    type: 'tax_invoice' | 'receipt' | 'tax_invoice_receipt' | 'credit_note';
    serial_number: number;
    issued_at: string;
    description: string | null;
    subtotal: number;
    vat_rate_pct: number;
    vat_amount: number;
    total: number;
    currency: string;
    ita_allocation_number: string | null;
  };
  customer: {
    name: string;
    address?: string | null;
    vat_id?: string | null;
  };
  payer_note?: string;
  lineItems: InvoiceLineItem[];
}

export interface FlyerPdfInput {
  tenant: { name: string; phone?: string | null };
  building: { name: string; address?: string | null };
  qr_payload: string;
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  private readonly fontsAvailable: boolean;

  constructor() {
    this.fontsAvailable = existsSync(HEEBO_REGULAR) && existsSync(HEEBO_BOLD);
    if (!this.fontsAvailable) {
      this.logger.warn(
        `Heebo TTFs not found in ${FONTS_DIR}; Hebrew glyphs will fall back to Helvetica.`,
      );
    }
  }

  private newDoc(): PDFKit.PDFDocument {
    const doc = new PDFDocument({ size: 'A4', margin: 40, info: { Producer: 'building-management' } });
    if (this.fontsAvailable) {
      doc.registerFont('heebo', HEEBO_REGULAR);
      doc.registerFont('heebo-bold', HEEBO_BOLD);
      doc.font('heebo');
    }
    return doc;
  }

  /** Buffer-collect helper — turn a streaming pdfkit doc into a Buffer. */
  private async collect(doc: PDFKit.PDFDocument): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      doc.on('data', (c: Buffer) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      doc.end();
    });
  }

  /** Right-aligned Hebrew text helper. */
  private heText(
    doc: PDFKit.PDFDocument,
    text: string,
    x: number,
    y: number,
    options: { width?: number; size?: number; bold?: boolean; align?: 'left' | 'right' | 'center' } = {},
  ) {
    const size = options.size ?? 11;
    const align = options.align ?? 'right';
    const width = options.width ?? doc.page.width - 80;
    if (this.fontsAvailable) {
      doc.font(options.bold ? 'heebo-bold' : 'heebo');
    } else {
      doc.font(options.bold ? 'Helvetica-Bold' : 'Helvetica');
    }
    doc.fontSize(size).text(shapeRtl(text), x, y, { width, align });
  }

  /**
   * Render a tax-compliant Hebrew invoice / receipt / credit note PDF.
   */
  async renderInvoice(input: InvoicePdfInput): Promise<Buffer> {
    const doc = this.newDoc();
    const docTypeHe = invoiceTypeHebrew(input.invoice.type);
    const right = doc.page.width - 40;
    const pageWidth = doc.page.width - 80;

    // Header — tenant info on the right side (Hebrew)
    this.heText(doc, input.tenant.legal_name ?? input.tenant.name, 40, 40, {
      size: 18,
      bold: true,
      align: 'right',
    });
    if (input.tenant.vat_id) {
      this.heText(doc, `ע.מ. / ח.פ.: ${input.tenant.vat_id}`, 40, 65, { size: 10, align: 'right' });
    }
    if (input.tenant.address) {
      this.heText(doc, input.tenant.address, 40, 80, { size: 10, align: 'right' });
    }

    // Document title (centered, very large)
    this.heText(doc, docTypeHe, 40, 110, { size: 24, bold: true, align: 'center' });

    // Serial number + date (top-left for LTR balance)
    doc.fontSize(11).fillColor('black').font('Helvetica');
    doc.text(`No.  ${input.invoice.serial_number}`, 40, 140, { align: 'left', width: pageWidth });
    doc.text(`Date: ${input.invoice.issued_at.slice(0, 10)}`, 40, 156, { align: 'left', width: pageWidth });
    if (input.invoice.ita_allocation_number) {
      this.heText(
        doc,
        `מספר הקצאה (רשות המסים): ${input.invoice.ita_allocation_number}`,
        40,
        172,
        { size: 10, align: 'left' },
      );
    }

    // Customer block
    let y = 200;
    this.heText(doc, 'לכבוד:', 40, y, { size: 11, bold: true });
    y += 16;
    this.heText(doc, input.customer.name, 40, y, { size: 12 });
    y += 14;
    if (input.customer.address) {
      this.heText(doc, input.customer.address, 40, y, { size: 10 });
      y += 14;
    }
    if (input.customer.vat_id) {
      this.heText(doc, `ע.מ./ח.פ.: ${input.customer.vat_id}`, 40, y, { size: 10 });
      y += 14;
    }
    if (input.payer_note) {
      this.heText(doc, input.payer_note, 40, y, { size: 10, bold: true });
      y += 16;
    }

    // Line items table
    y += 14;
    this.drawLineItemsTable(doc, y, input.lineItems, input.invoice.currency);
    const tableBottom = y + 24 + Math.max(input.lineItems.length, 1) * 22 + 6;

    // Totals box
    const totalsX = 40;
    let ty = tableBottom + 18;
    this.heText(doc, `סך לפני מע"מ: ${money(input.invoice.subtotal, input.invoice.currency)}`, totalsX, ty, {
      size: 11, align: 'left',
    });
    ty += 16;
    this.heText(
      doc,
      `מע"מ ${Number(input.invoice.vat_rate_pct).toFixed(0)}%: ${money(input.invoice.vat_amount, input.invoice.currency)}`,
      totalsX,
      ty,
      { size: 11, align: 'left' },
    );
    ty += 18;
    this.heText(doc, `סה"כ לתשלום: ${money(input.invoice.total, input.invoice.currency)}`, totalsX, ty, {
      size: 14, bold: true, align: 'left',
    });

    // Footer
    const footerY = doc.page.height - 60;
    this.heText(
      doc,
      'מסמך זה הופק על ידי מערכת ניהול מבנים — חתימה דיגיטלית עם גושר רצף מספרי',
      40,
      footerY,
      { size: 8, align: 'center' },
    );
    return this.collect(doc);
  }

  private drawLineItemsTable(
    doc: PDFKit.PDFDocument,
    y: number,
    items: InvoiceLineItem[],
    currency: string,
  ) {
    const cols = {
      description: { x: 240, width: 260, align: 'right' as const, header: 'תיאור' },
      qty: { x: 200, width: 40, align: 'center' as const, header: 'כמות' },
      unit: { x: 130, width: 70, align: 'center' as const, header: 'מחיר' },
      total: { x: 40, width: 90, align: 'left' as const, header: 'סה"כ' },
    };

    // Header row background
    doc.rect(40, y, doc.page.width - 80, 22).fillColor('#eef2ff').fill().fillColor('black');
    let hy = y + 6;
    for (const c of Object.values(cols)) {
      this.heText(doc, c.header, c.x, hy, { size: 10, bold: true, align: c.align, width: c.width });
    }
    let ry = y + 24;
    for (const it of items) {
      this.heText(doc, it.description, cols.description.x, ry, {
        size: 10, align: 'right', width: cols.description.width,
      });
      this.heText(doc, String(it.quantity), cols.qty.x, ry, {
        size: 10, align: 'center', width: cols.qty.width,
      });
      this.heText(doc, money(it.unit_price, currency), cols.unit.x, ry, {
        size: 10, align: 'center', width: cols.unit.width,
      });
      this.heText(doc, money(it.total, currency), cols.total.x, ry, {
        size: 10, align: 'left', width: cols.total.width,
      });
      ry += 22;
    }
    // Bottom border
    doc.moveTo(40, ry).lineTo(doc.page.width - 40, ry).strokeColor('#e5e7eb').stroke();
  }

  /**
   * Render the A4 print flyer (SPEC §8) with Hebrew copy + QR.
   */
  async renderFlyer(input: FlyerPdfInput): Promise<Buffer> {
    const doc = this.newDoc();
    const W = doc.page.width;
    const H = doc.page.height;

    // Top band — brand
    doc.rect(0, 0, W, 120).fillColor('#4f46e5').fill();
    this.heText(doc, input.tenant.name, 40, 40, { size: 16, bold: true, align: 'center' });
    doc.fillColor('white');
    this.heText(doc, input.tenant.name, 40, 40, { size: 16, bold: true, align: 'center' });
    this.heText(doc, `ברוכים הבאים לבניין ${input.building.name}!`, 40, 70, {
      size: 22, bold: true, align: 'center',
    });
    doc.fillColor('black');

    // Hero copy
    let y = 150;
    this.heText(doc, 'ניהול הבניין שלכם עבר לאפליקציה.', 40, y, { size: 18, bold: true, align: 'center' });
    y += 40;

    // Bullets
    const bullets = [
      'דיווח תקלות בלחיצת כפתור',
      'תשלום ועד בית מאובטח בכרטיס אשראי',
      'עדכונים מוועד הבית בזמן אמת',
      'בוט AI שעונה 24/7',
      'פתיחת שער חניה מהטלפון',
    ];
    this.heText(doc, 'מה תקבלו?', 40, y, { size: 16, bold: true, align: 'right' });
    y += 26;
    for (const b of bullets) {
      this.heText(doc, `•  ${b}`, 80, y, { size: 14, align: 'right' });
      y += 22;
    }

    // QR code
    y += 30;
    this.heText(doc, 'סרקו את הברקוד כדי להתחיל', 40, y, {
      size: 16, bold: true, align: 'center',
    });
    y += 30;

    const qrPng = await QRCode.toBuffer(input.qr_payload, {
      type: 'png',
      margin: 1,
      width: 280,
      errorCorrectionLevel: 'M',
    });
    const qrSize = 220;
    doc.image(qrPng, (W - qrSize) / 2, y, { width: qrSize, height: qrSize });
    y += qrSize + 20;

    // Footer — building address + phone
    if (input.building.address) {
      this.heText(doc, input.building.address, 40, H - 100, { size: 12, align: 'center' });
    }
    if (input.tenant.phone) {
      this.heText(doc, `זקוקים לעזרה? התקשרו: ${input.tenant.phone}`, 40, H - 80, {
        size: 12, align: 'center',
      });
    }

    return this.collect(doc);
  }

  /**
   * Render a smaller "share-image" PDF in a square aspect for posting to
   * Instagram / WhatsApp. Same content as the flyer but reduced.
   * Note: true PNG image variants would need a raster pipeline (canvas /
   * satori) — for now we ship a square-page PDF that hosts can print to
   * raster. Tracked as a follow-up.
   */
  async renderFlyerSquare(input: FlyerPdfInput): Promise<Buffer> {
    const doc = new PDFDocument({ size: [1080, 1080], margin: 60 });
    if (this.fontsAvailable) {
      doc.registerFont('heebo', HEEBO_REGULAR);
      doc.registerFont('heebo-bold', HEEBO_BOLD);
      doc.font('heebo');
    }
    doc.rect(0, 0, 1080, 1080).fillColor('#eef2ff').fill().fillColor('black');
    this.heText(doc, `ברוכים הבאים לבניין ${input.building.name}!`, 60, 80, {
      size: 40, bold: true, align: 'center', width: 960,
    });
    this.heText(doc, 'ניהול הבניין שלכם באפליקציה', 60, 160, {
      size: 28, align: 'center', width: 960,
    });
    const qrPng = await QRCode.toBuffer(input.qr_payload, { type: 'png', margin: 1, width: 600 });
    doc.image(qrPng, (1080 - 480) / 2, 280, { width: 480, height: 480 });
    this.heText(doc, 'סרקו והתחילו', 60, 820, { size: 36, bold: true, align: 'center', width: 960 });
    this.heText(doc, input.tenant.name, 60, 900, { size: 24, align: 'center', width: 960 });
    if (input.tenant.phone) {
      this.heText(doc, input.tenant.phone, 60, 940, { size: 22, align: 'center', width: 960 });
    }
    return this.collect(doc);
  }
}

function money(value: number, currency: string): string {
  const n = Number(value);
  if (currency === 'ILS') return `${n.toFixed(2)} ₪`;
  return `${n.toFixed(2)} ${currency}`;
}

function invoiceTypeHebrew(type: string): string {
  switch (type) {
    case 'tax_invoice':
      return 'חשבונית מס';
    case 'receipt':
      return 'קבלה';
    case 'tax_invoice_receipt':
      return 'חשבונית מס / קבלה';
    case 'credit_note':
      return 'חשבונית זיכוי';
    default:
      return type;
  }
}
