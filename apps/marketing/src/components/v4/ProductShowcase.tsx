'use client';
import { useEffect, useState } from 'react';
import { Wallet, MessageCircle, KeyRound, Wrench } from 'lucide-react';

/**
 * Rotating product showcase — three styled mockups (admin / resident /
 * worker) that auto-cycle with a sliver of motion. Per Mews/Stripe
 * pattern from research, real product UI is the hero visual.
 */

type View = 'admin' | 'resident' | 'maintenance';

const tabs: { key: View; label: string }[] = [
  { key: 'admin', label: 'אדמין · חברת ניהול' },
  { key: 'resident', label: 'אפליקציה · דייר' },
  { key: 'maintenance', label: 'איש אחזקה' },
];

export function ProductShowcase() {
  const [view, setView] = useState<View>('admin');
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setView((v) => (v === 'admin' ? 'resident' : v === 'resident' ? 'maintenance' : 'admin'));
    }, 5500);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="relative reveal"
      style={{ animationDelay: '300ms' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Tabs */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {tabs.map((t) => {
          const active = view === t.key;
          return (
            <button
              key={t.key}
              onClick={() => {
                setView(t.key);
                setPaused(true);
              }}
              className="rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors md:text-[12px]"
              style={{
                background: active ? 'var(--ink)' : 'var(--paper)',
                color: active ? 'var(--paper)' : 'var(--ink-3)',
                border: '1px solid',
                borderColor: active ? 'var(--ink)' : 'var(--line)',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Mockup container with backdrop */}
      <div className="relative">
        <div
          className="absolute -inset-4 -z-10 rounded-3xl opacity-50 blur-2xl md:-inset-6"
          style={{ background: 'radial-gradient(ellipse at center, var(--brass-3), transparent 70%)' }}
        />
        <div
          className="overflow-hidden rounded-xl border shadow-[0_30px_60px_-20px_rgba(28,25,23,0.18)]"
          style={{ background: 'var(--paper)', borderColor: 'var(--line-2)' }}
        >
          {view === 'admin' && <AdminView />}
          {view === 'resident' && <ResidentView />}
          {view === 'maintenance' && <WorkerView />}
        </div>
      </div>
    </div>
  );
}

function WindowChrome({ url }: { url: string }) {
  return (
    <div
      className="flex items-center gap-2 border-b px-4 py-2.5"
      style={{ borderColor: 'var(--line)', background: 'var(--bg-2)' }}
    >
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'rgba(28,25,23,0.16)' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'rgba(28,25,23,0.16)' }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: 'rgba(28,25,23,0.16)' }} />
      </div>
      <div
        className="ms-3 flex-1 truncate rounded-md px-3 py-1 text-[11px] ltr"
        style={{ background: 'var(--paper)', color: 'var(--ink-3)' }}
      >
        {url}
      </div>
    </div>
  );
}

function AdminView() {
  return (
    <>
      <WindowChrome url="app.building-management.co.il / dashboard" />
      <div className="grid grid-cols-[160px_1fr] md:grid-cols-[180px_1fr]">
        <div
          className="hide-mobile border-l p-3 text-[12px]"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">ניהול</div>
          {['לוח בקרה', 'בניינים', 'דירות', 'אנשים'].map((l) => (
            <div key={l} className="rounded-md px-2 py-1.5 text-[var(--ink-2)]">{l}</div>
          ))}
          <div className="my-2 border-t" style={{ borderColor: 'var(--line)' }} />
          <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">פיננסי</div>
          <div
            className="rounded-md px-2 py-1.5 font-bold"
            style={{ background: 'var(--bg-2)', color: 'var(--ink)' }}
          >
            חיובים
          </div>
          {['חשבוניות', 'צ׳קים', 'ספקים'].map((l) => (
            <div key={l} className="rounded-md px-2 py-1.5 text-[var(--ink-2)]">{l}</div>
          ))}
        </div>

        <div className="p-4 md:p-5">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">
                לוח בקרה · ינואר 2026
              </div>
              <h3 className="mt-0.5 text-[16px] font-extrabold md:text-[18px]">סקירה כללית</h3>
            </div>
            <span
              className="rounded-md px-2 py-0.5 text-[11px] font-bold"
              style={{ background: 'var(--bg-2)' }}
            >
              עודכן עכשיו
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <Stat label="גביה" value="94%" tone="default" />
            <Stat label="פניות פתוחות" value="8" tone="brass" />
            <Stat label="בפיגור" value="₪580" tone="rust" />
          </div>

          <div
            className="mt-4 overflow-hidden rounded-lg border"
            style={{ borderColor: 'var(--line)' }}
          >
            <Row apt="דירה 4ב · הרצל 12" amount="₪350" status="שולם" tone="moss" date="01/01" />
            <Row apt="דירה 5א · הרצל 12" amount="₪350" status="שולם" tone="moss" date="01/01" />
            <Row apt="דירה 2ב · רוטשילד 4" amount="₪350" status="ממתין" tone="brass" date="01/01" />
            <Row apt="דירה 6א · הרצל 12" amount="₪350" status="בפיגור" tone="rust" date="01/01" />
            <Row apt="דירה 7ג · רוטשילד 4" amount="₪350" status="שולם" tone="moss" date="01/01" />
          </div>
        </div>
      </div>
    </>
  );
}

function ResidentView() {
  return (
    <>
      <WindowChrome url="building-management.co.il / app · iOS" />
      <div className="bg-[var(--bg)] p-4 md:p-6">
        <div className="mx-auto max-w-[320px] overflow-hidden rounded-[28px] border-[3px] shadow-2xl" style={{ borderColor: 'var(--ink)' }}>
          <div className="bg-[var(--paper)] p-4">
            {/* status bar */}
            <div className="flex items-center justify-between text-[10px] font-bold text-[var(--ink)]">
              <span>9:42</span>
              <span>•••</span>
            </div>
            {/* greeting */}
            <div className="mt-4">
              <div className="text-[10px] text-[var(--ink-3)]">בוקר טוב,</div>
              <div className="text-[18px] font-extrabold">דנה כהן</div>
              <div className="text-[11px] text-[var(--ink-3)]">דירה 4ב · הרצל 12</div>
            </div>
            {/* balance card */}
            <div className="mt-4 rounded-xl p-4" style={{ background: 'var(--ink)', color: 'var(--paper)' }}>
              <div className="text-[10px] opacity-70">יתרה לתשלום</div>
              <div className="mt-1 text-[28px] font-extrabold tnum ltr">₪0</div>
              <div className="mt-2 text-[11px]" style={{ color: 'var(--brass-3)' }}>✓ הכל שולם החודש</div>
            </div>
            {/* quick actions */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <QuickAction icon={Wallet} label="תשלום" />
              <QuickAction icon={Wrench} label="פנייה" />
              <QuickAction icon={KeyRound} label="שער" />
            </div>
            {/* feed item */}
            <div
              className="mt-4 rounded-lg border p-3 text-[12px]"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--brass)' }}
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">לוח מודעות</span>
              </div>
              <div className="mt-1.5 font-bold">ניקוי מים · מחר 09:00</div>
              <div className="mt-0.5 text-[var(--ink-3)]">ועד הבית · לפני שעתיים</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function WorkerView() {
  return (
    <>
      <WindowChrome url="maintenance.building-management.co.il / today" />
      <div className="p-4 md:p-5">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">היום · 8 משימות</div>
            <h3 className="mt-0.5 text-[16px] font-extrabold md:text-[18px]">לוז יומי · משה אבני</h3>
          </div>
          <span
            className="rounded-md px-2 py-0.5 text-[11px] font-bold"
            style={{ background: 'var(--bg-2)' }}
          >
            3 הושלמו
          </span>
        </div>

        <div className="mt-4 space-y-2">
          {[
            { time: '09:00', addr: 'הרצל 12, דירה 4ב', task: 'נזילה במטבח', status: 'done' as const },
            { time: '10:30', addr: 'רוטשילד 4, דירה 7ג', task: 'מזגן לא עובד', status: 'now' as const },
            { time: '12:00', addr: 'אלנבי 88, לובי', task: 'נורת חירום', status: 'next' as const },
            { time: '14:30', addr: 'הרצל 12, חניון', task: 'שער חניה תקוע', status: 'next' as const },
          ].map((t, i) => (
            <TaskRow key={i} {...t} />
          ))}
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: 'default' | 'brass' | 'rust' }) {
  const color =
    tone === 'brass' ? 'var(--brass)' : tone === 'rust' ? 'var(--rust)' : 'var(--ink)';
  return (
    <div
      className="rounded-md border p-2.5"
      style={{ borderColor: 'var(--line)', background: 'var(--bg)' }}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--ink-3)]">{label}</div>
      <div className="mt-1 text-[16px] font-extrabold tnum ltr" style={{ color }}>{value}</div>
    </div>
  );
}

function Row({
  apt,
  amount,
  status,
  tone,
  date,
}: {
  apt: string;
  amount: string;
  status: string;
  tone: 'moss' | 'brass' | 'rust';
  date: string;
}) {
  const color = tone === 'moss' ? 'var(--moss)' : tone === 'brass' ? 'var(--brass)' : 'var(--rust)';
  return (
    <div
      className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-t px-3 py-2.5 first:border-t-0"
      style={{ borderColor: 'var(--line)' }}
    >
      <div className="min-w-0 text-[12px] font-semibold">{apt}</div>
      <div className="hide-mobile text-[11px] text-[var(--ink-3)] ltr">{date}</div>
      <div className="tnum text-[12px] font-bold ltr">{amount}</div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
        <span className="text-[10px] font-bold" style={{ color }}>{status}</span>
      </div>
    </div>
  );
}

function TaskRow({
  time,
  addr,
  task,
  status,
}: {
  time: string;
  addr: string;
  task: string;
  status: 'done' | 'now' | 'next';
}) {
  const tone =
    status === 'done' ? 'var(--moss)' : status === 'now' ? 'var(--brass)' : 'var(--ink-3)';
  const label = status === 'done' ? 'בוצע' : status === 'now' ? 'עכשיו' : 'בקרוב';
  return (
    <div
      className="grid grid-cols-[44px_1fr_auto] items-center gap-3 rounded-lg border p-3"
      style={{ borderColor: 'var(--line)' }}
    >
      <div className="text-[12px] font-bold tnum text-[var(--ink-3)] ltr">{time}</div>
      <div>
        <div className="text-[13px] font-bold">{task}</div>
        <div className="mt-0.5 text-[11px] text-[var(--ink-3)]">{addr}</div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: tone }} />
        <span className="text-[10px] font-bold" style={{ color: tone }}>{label}</span>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button
      className="flex flex-col items-center gap-1.5 rounded-lg border p-3"
      style={{ borderColor: 'var(--line)', background: 'var(--bg-2)' }}
    >
      <Icon className="h-4 w-4 text-[var(--ink)]" />
      <span className="text-[10px] font-bold text-[var(--ink)]">{label}</span>
    </button>
  );
}
