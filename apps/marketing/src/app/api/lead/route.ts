import { NextResponse } from 'next/server';

/**
 * Lead form endpoint. For now: validates + logs server-side. Production
 * should forward to the API (`/v1/leads`) or to a CRM webhook.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { name?: string; email?: string; phone?: string; company?: string; message?: string }
    | null;
  if (!body || !body.name || !body.email) {
    return NextResponse.json({ ok: false, error: 'missing name or email' }, { status: 400 });
  }
  // eslint-disable-next-line no-console
  console.log('[lead]', { ...body, ts: new Date().toISOString() });

  const apiUrl = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
  if (apiUrl) {
    try {
      await fetch(`${apiUrl}/v1/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch {
      // Best-effort: don't fail the marketing form if the API is down.
    }
  }
  return NextResponse.json({ ok: true });
}
