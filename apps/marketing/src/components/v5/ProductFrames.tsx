'use client';
import { useEffect, useState } from 'react';
import {
  Check,
  Circle,
  Image as ImageIcon,
  MapPin,
  MoreHorizontal,
  Paperclip,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import type { Zone } from './LivingBuilding';

/**
 * Product frames — the realistic CRM screens that swap as the reader
 * scrolls through the platform story. Each frame is a real-looking
 * product surface (charts, tickets, chat, documents, logs) built in
 * HTML/CSS so it scales sharply at any density. When a frame becomes
 * active it plays its own micro-choreography (rows reveal, bubbles
 * type in, signatures stamp). Inactive frames are fully removed from
 * the layer (opacity 0 + pointer-events: none).
 *
 * Successor to the schematic LivingBuilding in this section — the
 * latter still serves the auto-cycled "hero understudy" experiments.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const FRAME_CHROME =
  'absolute inset-0 overflow-hidden rounded-2xl border bg-[var(--paper)] shadow-[0_30px_80px_-30px_rgba(28,25,23,0.35)]';

export function ProductFrames({ zone }: { zone: Zone }) {
  return (
    <div
      className="relative aspect-[4/5] w-full"
      role="img"
      aria-label="תצוגת מסכי המערכת — מתחלפת לפי הפרק הנוכחי בסיפור הפלטפורמה"
    >
      <Frame active={zone === 'billing'}>
        <BillingFrame active={zone === 'billing'} />
      </Frame>
      <Frame active={zone === 'maintenance'}>
        <MaintenanceFrame active={zone === 'maintenance'} />
      </Frame>
      <Frame active={zone === 'comms'}>
        <CommsFrame active={zone === 'comms'} />
      </Frame>
      <Frame active={zone === 'docs'}>
        <DocsFrame active={zone === 'docs'} />
      </Frame>
      <Frame active={zone === 'access'}>
        <AccessFrame active={zone === 'access'} />
      </Frame>
    </div>
  );
}

/** Crossfade + small drift wrapper. Inactive frames are detached from
 *  the pointer/scroll tree so they don't trap focus. */
function Frame({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={FRAME_CHROME}
      style={{
        borderColor: 'var(--line)',
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.985)',
        transition: 'opacity 620ms cubic-bezier(0.16, 1, 0.3, 1), transform 620ms cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: active ? 'auto' : 'none',
      }}
      aria-hidden={!active}
    >
      {children}
    </div>
  );
}

/** In-product chrome — same window header on every frame for continuity. */
function Chrome({ title, badge }: { title: string; badge?: string }) {
  return (
    <div
      className="flex items-center justify-between border-b px-5 py-3"
      style={{ borderColor: 'var(--line)', background: 'var(--bg)' }}
    >
      <div className="flex items-center gap-2">
        <img
          src={`${BASE}/v5/pulse-mark.svg`}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 shrink-0"
          aria-hidden
        />
        <span className="text-[13px] font-bold text-[var(--ink)]">{title}</span>
        {badge && (
          <span
            className="ms-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: 'var(--brass-soft)', color: 'var(--brass-2)' }}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        <MoreHorizontal className="h-4 w-4 text-[var(--ink-4)]" />
      </div>
    </div>
  );
}

/* ============================== 01 · BILLING ============================== */

function BillingFrame({ active }: { active: boolean }) {
  const buildings = [
    { name: 'רוטשילד 4', units: 28, rate: 96, status: 'good' },
    { name: 'הרצל 12, רעננה', units: 16, rate: 100, status: 'good' },
    { name: 'בן גוריון 8', units: 22, rate: 89, status: 'mid' },
    { name: 'ויצמן 3', units: 12, rate: 100, status: 'good' },
    { name: 'אבן גבירול 22', units: 34, rate: 78, status: 'low' },
    { name: 'סוקולוב 9', units: 18, rate: 94, status: 'good' },
  ];

  return (
    <div className="flex h-full flex-col">
      <Chrome title="גבייה · מאי 2026" badge="LIVE" />
      <div className="flex-1 overflow-hidden p-5">
        <div className="grid grid-cols-3 gap-3">
          <Kpi label="נגבה החודש" value="₪42,000" delta="+8%" delay={0} active={active} />
          <Kpi label="שיעור גבייה" value="94%" delta="+3 נק׳" delay={80} active={active} />
          <Kpi label="פיגורים" value="4" delta="-2" deltaDown delay={160} active={active} />
        </div>

        {/* Trend strip */}
        <div className="mt-5 rounded-xl border p-4" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-[var(--ink-3)]">12 חודשים אחרונים</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: 'var(--brass)' }}>
              <TrendingUp className="h-3 w-3" /> +12% YoY
            </span>
          </div>
          <div className="mt-3 flex h-[58px] items-end gap-1.5">
            {[58, 64, 60, 72, 70, 78, 82, 76, 85, 88, 92, 94].map((h, i) => (
              <span
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  height: active ? `${h}%` : '6%',
                  background: i === 11 ? 'var(--brass)' : 'rgba(28, 25, 23, 0.18)',
                  transition: `height 600ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 30 + 220}ms`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Buildings list */}
        <div className="mt-4 rounded-xl border" style={{ borderColor: 'var(--line)' }}>
          <div
            className="grid grid-cols-[1fr_56px_92px] items-center gap-3 border-b px-4 py-2 text-[10px] font-bold tracking-wider text-[var(--ink-3)]"
            style={{ borderColor: 'var(--line)' }}
          >
            <span>בניין</span>
            <span className="text-end">דירות</span>
            <span className="text-end">גביה</span>
          </div>
          {buildings.map((b, i) => (
            <div
              key={b.name}
              className="grid grid-cols-[1fr_56px_92px] items-center gap-3 border-b px-4 py-2.5 text-[12px] last:border-b-0"
              style={{
                borderColor: 'var(--line)',
                opacity: active ? 1 : 0,
                transform: active ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 380ms ease, transform 380ms cubic-bezier(0.16, 1, 0.3, 1)`,
                transitionDelay: `${380 + i * 60}ms`,
              }}
            >
              <span className="font-bold text-[var(--ink)]">{b.name}</span>
              <span className="text-end tnum text-[var(--ink-3)]">{b.units}</span>
              <span className="flex items-center justify-end gap-2">
                <span className="h-1.5 w-12 overflow-hidden rounded-full" style={{ background: 'var(--bg-2)' }}>
                  <span
                    className="block h-full rounded-full"
                    style={{
                      width: active ? `${b.rate}%` : '0%',
                      background:
                        b.status === 'good' ? 'var(--moss)' : b.status === 'mid' ? 'var(--brass)' : 'var(--rust)',
                      transition: `width 650ms cubic-bezier(0.16, 1, 0.3, 1) ${500 + i * 60}ms`,
                    }}
                  />
                </span>
                <span className="tnum w-9 text-end font-extrabold text-[var(--ink)]">{b.rate}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  delta,
  deltaDown,
  delay,
  active,
}: {
  label: string;
  value: string;
  delta: string;
  deltaDown?: boolean;
  delay: number;
  active: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-3"
      style={{
        borderColor: 'var(--line)',
        opacity: active ? 1 : 0,
        transform: active ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 420ms ease ${delay}ms, transform 420ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <div className="text-[10px] font-bold tracking-wider text-[var(--ink-3)]">{label}</div>
      <div className="tnum mt-1 text-[20px] font-extrabold leading-none text-[var(--ink)]">{value}</div>
      <div className="mt-1 text-[11px] font-bold" style={{ color: deltaDown ? 'var(--moss)' : 'var(--brass)' }}>
        {delta}
      </div>
    </div>
  );
}

/* ============================ 02 · MAINTENANCE ============================ */

function MaintenanceFrame({ active }: { active: boolean }) {
  const [sla, setSla] = useState(54);
  useEffect(() => {
    if (!active) return;
    const t = setInterval(() => setSla((s) => Math.max(40, s - 1)), 600);
    return () => clearInterval(t);
  }, [active]);

  const stages = [
    { label: 'דווח', time: '09:14', state: 'done' as const },
    { label: 'סווג AI', time: '09:14', state: 'done' as const },
    { label: 'שויך לעובד', time: '09:16', state: 'done' as const },
    { label: 'בטיפול', time: '—', state: 'active' as const },
    { label: 'נסגר', time: '—', state: 'pending' as const },
  ];

  return (
    <div className="flex h-full flex-col">
      <Chrome title="פנייה #482 · ברז דולף" badge="פתוחה" />
      <div className="flex-1 overflow-hidden p-5">
        {/* Incident photo — real dripping-faucet close-up (Wikimedia
            Commons, Dschwen, CC BY-SA 2.5), warm-graded to the site. */}
        <div className="relative h-[170px] overflow-hidden rounded-xl">
          <img
            src={`${BASE}/v5/leak.jpg`}
            alt=""
            width={1280}
            height={610}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: 'sepia(0.12) saturate(0.95)', transform: active ? 'scale(1)' : 'scale(1.06)', transition: 'transform 1200ms cubic-bezier(0.16, 1, 0.3, 1) 150ms' }}
          />
          <div className="absolute inset-x-3 bottom-3 flex items-center gap-2">
            <span
              className="grid h-7 w-7 place-items-center rounded-lg"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            >
              <ImageIcon className="h-3.5 w-3.5 text-white" />
            </span>
            <span
              className="rounded-md px-2 py-1 text-[10px] font-bold text-white"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
            >
              IMG_0312.JPG · צילם הדייר
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
          <Field label="כתובת" value={'רוטשילד 4, ת"א · קומה 3'} icon={MapPin} />
          <Field label="סוג" value="ברז דולף · מטבח" />
          <Field label="הועבר ל" value="יוסי כהן · אינסטלטור" />
          <Field
            label="SLA"
            value={`${sla} דק׳ נותרו`}
            valueStyle={{ color: sla < 30 ? 'var(--rust)' : 'var(--brass)' }}
          />
        </div>

        {/* Timeline */}
        <div className="mt-4 rounded-xl border p-3" style={{ borderColor: 'var(--line)' }}>
          <div className="text-[10px] font-bold tracking-wider text-[var(--ink-3)]">ציר זמן</div>
          <ol className="mt-2.5 space-y-2">
            {stages.map((s, i) => (
              <li
                key={s.label}
                className="flex items-center gap-2.5 text-[12px]"
                style={{
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateX(0)' : 'translateX(8px)',
                  transition: `opacity 320ms ease, transform 320ms cubic-bezier(0.16, 1, 0.3, 1)`,
                  transitionDelay: `${260 + i * 90}ms`,
                }}
              >
                <span
                  className="grid h-5 w-5 place-items-center rounded-full"
                  style={{
                    background:
                      s.state === 'done'
                        ? 'var(--moss)'
                        : s.state === 'active'
                          ? 'var(--brass)'
                          : 'var(--bg-2)',
                    color: s.state === 'pending' ? 'var(--ink-4)' : 'white',
                  }}
                >
                  {s.state === 'done' ? (
                    <Check className="h-3 w-3" />
                  ) : s.state === 'active' ? (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                  ) : (
                    <Circle className="h-2 w-2" />
                  )}
                </span>
                <span
                  className="flex-1 font-bold"
                  style={{ color: s.state === 'pending' ? 'var(--ink-4)' : 'var(--ink)' }}
                >
                  {s.label}
                </span>
                <span className="tnum text-[10px] text-[var(--ink-3)]">{s.time}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  icon: Icon,
  valueStyle,
}: {
  label: string;
  value: string;
  icon?: typeof MapPin;
  valueStyle?: React.CSSProperties;
}) {
  return (
    <div className="rounded-lg border p-2.5" style={{ borderColor: 'var(--line)' }}>
      <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-[var(--ink-3)]">
        {Icon && <Icon className="h-2.5 w-2.5" />}
        {label}
      </div>
      <div className="mt-1 font-bold text-[var(--ink)]" style={valueStyle}>
        {value}
      </div>
    </div>
  );
}

/* =============================== 03 · COMMS =============================== */

function CommsFrame({ active }: { active: boolean }) {
  const messages = [
    { from: 'them' as const, text: 'שלום, מה היתרה שלי לחודש?', t: '09:21' },
    { from: 'bot' as const, text: 'היי דנה 👋 היתרה שלך לדירה 14 ברוטשילד 4: ₪0 — הוראת הקבע נגבתה אמש.', t: '09:21', ai: true },
    { from: 'them' as const, text: 'ויש לי בעיה עם הדוד', t: '09:22' },
    { from: 'bot' as const, text: 'מבין. פותח פנייה לאינסטלטור הבניין ושומר תמונה בכרטיס הדירה. מעדכן אותך כשמשהו זז.', t: '09:22', ai: true, escalate: true },
    { from: 'them' as const, text: 'מתי בערך יגיעו? אני בבית עד 16:00', t: '09:23' },
    { from: 'bot' as const, text: 'יוסי האינסטלטור משובץ להיום בין 14:00–16:00 🔧 תקבלי הודעה כשהוא בדרך אלייך. צריך עוד משהו?', t: '09:23', ai: true },
  ];

  return (
    <div className="flex h-full flex-col">
      <Chrome title="WhatsApp · דנה, דירה 14" badge="בוט" />
      <div className="flex-1 overflow-hidden" style={{ background: '#ece5dd' }}>
        <div className="flex h-full flex-col gap-2 px-4 py-5">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.from === 'them' ? 'justify-end' : 'justify-start'}`}
              style={{
                opacity: active ? 1 : 0,
                transform: active ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 360ms ease, transform 360ms cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: `${260 + i * 320}ms`,
              }}
            >
              <div
                className="relative max-w-[78%] rounded-xl px-3 py-2 text-[13px] leading-snug shadow-sm"
                style={{
                  background: m.from === 'them' ? '#dcf8c6' : '#ffffff',
                  color: 'var(--ink)',
                  borderBottomRightRadius: m.from === 'them' ? 2 : undefined,
                  borderBottomLeftRadius: m.from === 'bot' ? 2 : undefined,
                }}
              >
                {m.ai && (
                  <span className="mb-1 flex items-center gap-1 text-[10px] font-extrabold" style={{ color: 'var(--brass-2)' }}>
                    <Sparkles className="h-2.5 w-2.5" />
                    הבוט החכם
                  </span>
                )}
                <p>{m.text}</p>
                <div className="mt-1 flex items-center justify-end gap-1 text-[9px] text-[var(--ink-4)]">
                  <span className="tnum">{m.t}</span>
                  {m.from === 'them' && <Check className="h-2.5 w-2.5" style={{ color: '#34b7f1' }} />}
                </div>
                {m.escalate && (
                  <div
                    className="mt-2 flex items-center gap-1.5 rounded-md border px-2 py-1.5 text-[10px] font-bold"
                    style={{ background: 'var(--brass-soft)', borderColor: 'rgba(161, 98, 7, 0.2)', color: 'var(--brass-2)' }}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    פנייה #483 נפתחה אוטומטית
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="mt-auto" />
        </div>
      </div>
      <div className="flex items-center gap-2 border-t px-4 py-2.5" style={{ borderColor: 'var(--line)' }}>
        <Paperclip className="h-4 w-4 text-[var(--ink-4)]" />
        <div className="flex-1 rounded-full px-3 py-1.5 text-[11px] text-[var(--ink-4)]" style={{ background: 'var(--bg-2)' }}>
          כתבו הודעה...
        </div>
        <Send className="h-4 w-4" style={{ color: 'var(--brass)' }} />
      </div>
    </div>
  );
}

/* =============================== 04 · DOCS =============================== */

function DocsFrame({ active }: { active: boolean }) {
  const signers = [
    'ד. כהן',
    'ל. לוי',
    'מ. אברהם',
    'ע. בן דוד',
    'ת. שריר',
    'נ. רוזן',
    'י. גולן',
    'ש. גרינברג',
    'ה. אשכנזי',
    'א. מימון',
    'ר. עוזרי',
    'ב. דהן',
  ];
  return (
    <div className="flex h-full flex-col">
      <Chrome title="פרוטוקול אסיפת ועד 06.2026" badge="חתום" />
      <div className="flex-1 overflow-hidden p-5">
        <div
          className="relative mx-auto h-[200px] w-[160px] rounded-lg border bg-white shadow-md"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="border-b px-3 py-2" style={{ borderColor: 'var(--line)' }}>
            <div className="text-[8px] font-bold tracking-wider text-[var(--ink-3)]">פרוטוקול</div>
            <div className="text-[10px] font-extrabold text-[var(--ink)]">אסיפת ועד · 06.2026</div>
          </div>
          <div className="space-y-1.5 p-3">
            {[88, 76, 92, 68, 80, 84, 72].map((w, i) => (
              <span
                key={i}
                className="block h-[3px] rounded-full"
                style={{ background: 'rgba(28, 25, 23, 0.22)', width: `${w}%` }}
              />
            ))}
          </div>
          {/* Stamp */}
          <div
            className="absolute bottom-3 left-3 grid h-12 w-12 rotate-[-12deg] place-items-center rounded-full border-[2px]"
            style={{
              borderColor: 'var(--brass)',
              color: 'var(--brass)',
              opacity: active ? 1 : 0,
              transform: active ? 'rotate(-12deg) scale(1)' : 'rotate(-12deg) scale(0.6)',
              transition: 'opacity 360ms ease 700ms, transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 700ms',
            }}
          >
            <span className="text-[7px] font-extrabold leading-tight">
              חתום
              <br />
              דיגיטלית
            </span>
          </div>
        </div>

        {/* Vote tally */}
        <div className="mt-5 rounded-xl border p-4" style={{ borderColor: 'var(--line)' }}>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[var(--ink)]">שיפוץ לובי · 12,500 ₪</span>
            <span className="text-[11px] font-bold" style={{ color: 'var(--moss)' }}>
              אושר
            </span>
          </div>
          <div className="mt-3 flex h-2 overflow-hidden rounded-full" style={{ background: 'var(--bg-2)' }}>
            <span
              className="block h-full"
              style={{
                width: active ? '85%' : '0%',
                background: 'var(--moss)',
                transition: 'width 700ms cubic-bezier(0.16, 1, 0.3, 1) 300ms',
              }}
            />
            <span
              className="block h-full"
              style={{
                width: active ? '15%' : '0%',
                background: 'var(--rust)',
                transition: 'width 700ms cubic-bezier(0.16, 1, 0.3, 1) 400ms',
              }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span style={{ color: 'var(--moss)' }} className="font-bold">
              בעד · 10
            </span>
            <span style={{ color: 'var(--rust)' }} className="font-bold">
              נגד · 2
            </span>
          </div>
        </div>

        {/* Signatures */}
        <div className="mt-4">
          <div className="text-[10px] font-bold tracking-wider text-[var(--ink-3)]">12 חתימות דיגיטליות</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {signers.map((s, i) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold"
                style={{
                  borderColor: 'var(--line)',
                  background: 'var(--paper)',
                  color: 'var(--ink-2)',
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.85)',
                  transition: 'opacity 280ms ease, transform 280ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transitionDelay: `${800 + i * 50}ms`,
                }}
              >
                <Check className="h-2.5 w-2.5" style={{ color: 'var(--brass)' }} />
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =============================== 05 · ACCESS ============================== */

function AccessFrame({ active }: { active: boolean }) {
  const events = [
    { kind: 'open', label: 'דירה 14 · דנה כהן', method: 'אפליקציה', t: '09:40', ok: true },
    { kind: 'open', label: 'דירה 7 · אורח', method: 'קוד חד-פעמי', t: '09:32', ok: true },
    { kind: 'open', label: 'דירה 22 · מ. לוי', method: 'אפליקציה', t: '09:14', ok: true },
    { kind: 'deny', label: 'לא מזוהה', method: 'נדחה', t: '08:58', ok: false },
    { kind: 'open', label: 'אינסטלטור · יוסי', method: 'גישה זמנית', t: '08:42', ok: true },
  ];

  return (
    <div className="flex h-full flex-col">
      <Chrome title="חניון א׳ · שער ראשי" badge="LIVE" />
      <div className="flex-1 overflow-hidden p-5">
        {/* Gate photo — real boom barrier (Wikimedia Commons, Epolk,
            CC BY-SA 4.0), warm-graded to the site palette. */}
        <div className="relative h-[170px] overflow-hidden rounded-xl">
          <img
            src={`${BASE}/v5/gate.jpg`}
            alt=""
            width={1280}
            height={492}
            className="absolute inset-0 h-full w-full object-cover"
            style={{
              filter: 'sepia(0.18) saturate(0.92) contrast(1.02)',
              transform: active ? 'scale(1)' : 'scale(1.06)',
              transition: 'transform 1200ms cubic-bezier(0.16, 1, 0.3, 1) 150ms',
            }}
          />
          {/* Soft bottom gradient for the camera badge */}
          <span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-12"
            style={{ background: 'linear-gradient(to top, rgba(20,16,12,0.45), transparent)' }}
          />
          <span
            className="absolute bottom-2.5 right-3 rounded-md px-2 py-1 text-[10px] font-bold text-white"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
          >
            מצלמת שער · LIVE
          </span>
          {/* Status pill */}
          <div
            className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold"
            style={{ background: 'rgba(20,16,12,0.6)', color: '#86efac', backdropFilter: 'blur(6px)' }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#86efac]" />
            נפתח · 09:40
          </div>
        </div>

        {/* Log */}
        <div className="mt-4">
          <div className="text-[10px] font-bold tracking-wider text-[var(--ink-3)]">יומן גישה · 24 שעות אחרונות</div>
          <ul className="mt-2 divide-y rounded-xl border" style={{ borderColor: 'var(--line)' }}>
            {events.map((e, i) => (
              <li
                key={i}
                className="flex items-center gap-3 px-3 py-2 text-[12px]"
                style={{
                  borderColor: 'var(--line)',
                  opacity: active ? 1 : 0,
                  transform: active ? 'translateY(0)' : 'translateY(6px)',
                  transition: 'opacity 320ms ease, transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: `${500 + i * 80}ms`,
                }}
              >
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-md"
                  style={{
                    background: e.ok ? 'rgba(77, 124, 15, 0.12)' : 'rgba(185, 28, 28, 0.12)',
                    color: e.ok ? 'var(--moss)' : 'var(--rust)',
                  }}
                >
                  {e.ok ? <Check className="h-3 w-3" /> : <span className="text-[10px] font-extrabold">×</span>}
                </span>
                <span className="flex-1 font-bold text-[var(--ink)]">{e.label}</span>
                <span className="text-[10px] text-[var(--ink-3)]">{e.method}</span>
                <span className="tnum text-[10px] text-[var(--ink-3)]">{e.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
