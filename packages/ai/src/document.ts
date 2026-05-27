/**
 * Document analyzer — extracts plain text + a Hebrew summary + structured
 * metadata from an uploaded PDF or image using Claude's vision capability.
 *
 * Mockable: if ANTHROPIC_API_KEY is missing, returns a stub result so
 * the upload pipeline still completes end-to-end during dev. Production
 * deployments set the API key and get real analysis.
 *
 * SPEC §39.2: "OCR (Claude vision for PDFs/images, or tesseract for cheap
 * fallback). AI summary + metadata extraction via Claude: 'Summarize this
 * document in one paragraph in Hebrew. Extract: vendor name, expiry date,
 * parties, monetary amounts.'"
 */
import { getAnthropic, DEFAULT_MODEL } from './client';

export interface DocumentAnalysisResult {
  ocr_text: string;
  ai_summary: string;
  ai_metadata: DocumentMetadata;
  source: 'ai' | 'mock';
}

export interface DocumentMetadata {
  vendor_name?: string | null;
  expiry_date?: string | null;
  parties?: string[];
  monetary_amounts?: number[];
  document_type_hint?: string | null;
  notable_dates?: string[];
}

export interface AnalyzeInput {
  /** File bytes (PDF or image). */
  data: Buffer;
  /** MIME type — drives whether we send as document or image. */
  mime: string;
  /** Display name, used to nudge Claude (e.g., "building insurance 2026.pdf"). */
  title?: string;
}

const PROMPT = `אתה עוזר משפטי-תפעולי לחברת ניהול מבנים בישראל. נתחו את המסמך המצורף ותחזירו JSON תקין יחיד באנגלית עם המבנה:
{
  "ocr_text": "<all extracted text from the document, preserving structure as best as possible>",
  "ai_summary": "<one-paragraph summary in Hebrew of what this document is and why it matters>",
  "ai_metadata": {
    "vendor_name": "<vendor or counterparty name, or null>",
    "expiry_date": "<ISO date YYYY-MM-DD of the document's expiry, or null>",
    "parties": ["<list of full names mentioned as parties to the document>"],
    "monetary_amounts": [<list of numeric amounts mentioned, in ILS unless stated otherwise>],
    "document_type_hint": "<insurance | contract | minutes | permit | blueprint | certificate | rental_contract | vendor_invoice | meeting_protocol | bylaws | other>",
    "notable_dates": ["<additional ISO dates the document discusses>"]
  }
}
לא להוסיף הסבר. רק JSON. אם אין מידע על שדה — null או [].`;

export async function analyzeDocument(input: AnalyzeInput): Promise<DocumentAnalysisResult> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return mockResult(input);
  }

  const isImage = input.mime.startsWith('image/');
  const isPdf = input.mime === 'application/pdf';
  if (!isImage && !isPdf) {
    // Plain text or unknown — return the raw text as OCR, no real analysis.
    return {
      ocr_text: input.data.toString('utf-8').slice(0, 50_000),
      ai_summary: '',
      ai_metadata: {},
      source: 'mock',
    };
  }

  try {
    const base64 = input.data.toString('base64');
    const content = [
      {
        type: isImage ? 'image' : 'document',
        source: {
          type: 'base64',
          media_type: isImage ? input.mime : 'application/pdf',
          data: base64,
        },
      },
      { type: 'text', text: input.title ? `Document title: ${input.title}` : 'Analyze.' },
    ];
    const result = await getAnthropic().messages.create({
      model: process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
      system: PROMPT,
      max_tokens: 4000,
      temperature: 0,
      // The PDF "document" block is accepted by the API but the 0.32 TS
      // types only know image. Cast to keep both code paths working.
      messages: [{ role: 'user', content: content as never }],
    });
    const textBlock = result.content.find((c) => c.type === 'text');
    if (!textBlock || !('text' in textBlock)) {
      return mockResult(input);
    }
    const parsed = extractJson(textBlock.text);
    if (!parsed) return mockResult(input);
    return {
      ocr_text: String(parsed.ocr_text ?? ''),
      ai_summary: String(parsed.ai_summary ?? ''),
      ai_metadata: (parsed.ai_metadata as DocumentMetadata) ?? {},
      source: 'ai',
    };
  } catch {
    return mockResult(input);
  }
}

function mockResult(input: AnalyzeInput): DocumentAnalysisResult {
  return {
    ocr_text: '',
    ai_summary: input.title
      ? `[Mock] ניתוח אוטומטי של "${input.title}" לא זמין — הגדירו ANTHROPIC_API_KEY להפעלת ניתוח אמיתי.`
      : '[Mock] OCR לא הופעל — חסר ANTHROPIC_API_KEY.',
    ai_metadata: {},
    source: 'mock',
  };
}

function extractJson(text: string): Record<string, unknown> | null {
  // Claude usually returns clean JSON, but tolerate triple-backtick wraps.
  const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  try {
    return JSON.parse(trimmed);
  } catch {
    // Fallback: find the first { ... } block.
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

