/**
 * Hero product mockup — styled HTML showing a slice of the actual
 * admin dashboard (charges list with status + due dates), framed in
 * a window chrome. This is what the research said to do: real product
 * UI as the hero visual, not a generic illustration or 3D blob.
 *
 * Mobile-first: scales down via clamp() and CSS containment.
 */

export function ProductMockup() {
  return (
    <div className="relative">
      {/* Soft backdrop card */}
      <div
        className="absolute -inset-3 -z-10 rounded-2xl md:-inset-5"
        style={{ background: 'var(--bg-3)', opacity: 0.45 }}
      />

      <div
        className="overflow-hidden rounded-xl border shadow-[0_24px_48px_-24px_rgba(27,42,65,0.18)]"
        style={{ background: 'var(--paper)', borderColor: 'var(--line-strong)' }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 border-b px-4 py-2.5"
          style={{ borderColor: 'var(--line)', background: 'var(--bg-2)' }}
        >
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#e0c4a8' }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#d4b483' }} />
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#b08850' }} />
          </div>
          <div
            className="ms-3 flex-1 truncate rounded-md px-3 py-1 text-[11px] ltr"
            style={{ background: 'var(--paper)', color: 'var(--ink-3)' }}
          >
            app.building-management.co.il / charges
          </div>
        </div>

        {/* App body */}
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
          {/* Sidebar — hide on mobile to keep mockup readable */}
          <div className="hide-mobile border-l p-3 text-[12px]" style={{ borderColor: 'var(--line)' }}>
            <div className="mb-3 text-[10px] font-bold tracking-wider text-[var(--ink-3)]">
              ניהול
            </div>
            <SidebarItem label="לוח בקרה" />
            <SidebarItem label="בניינים" />
            <SidebarItem label="חיובים" active />
            <SidebarItem label="פניות" />
            <SidebarItem label="חשבוניות" />
            <SidebarItem label="ספקים" />
            <div className="my-3 border-t" style={{ borderColor: 'var(--line)' }} />
            <div className="mb-2 text-[10px] font-bold tracking-wider text-[var(--ink-3)]">
              דוחות
            </div>
            <SidebarItem label="גבייה" />
            <SidebarItem label="פיגורים" />
          </div>

          {/* Main */}
          <div className="p-4 md:p-5">
            {/* Title row */}
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-[11px] font-semibold tracking-wider text-[var(--ink-3)]">
                  ינואר 2026
                </div>
                <h3 className="display-3 mt-0.5" style={{ fontSize: 18 }}>
                  חיובי ועד בית
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span
                  className="rounded-md px-2 py-1 font-semibold"
                  style={{ background: 'var(--bg-3)', color: 'var(--ink)' }}
                >
                  94% נגבה
                </span>
              </div>
            </div>

            {/* KPI strip */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
              <KpiCell label="נגבה" value="₪42,300" />
              <KpiCell label="פתוח" value="₪2,650" tone="brass" />
              <KpiCell label="בפיגור" value="₪580" tone="rust" />
            </div>

            {/* Table */}
            <div className="mt-4 overflow-hidden rounded-lg border" style={{ borderColor: 'var(--line)' }}>
              <Row
                apt="דירה 4ב"
                payer="אבי כהן · בעלים"
                amount="₪350"
                date="01/01"
                status="paid"
              />
              <Row
                apt="דירה 5א"
                payer="דנה לוי · שוכרת"
                amount="₪350"
                date="01/01"
                status="paid"
              />
              <Row
                apt="דירה 3ג"
                payer="חיים מזרחי · בעלים"
                amount="₪350"
                date="01/01"
                status="paid"
              />
              <Row
                apt="דירה 2ב"
                payer="רחל אביב · שוכרת"
                amount="₪350"
                date="01/01"
                status="pending"
              />
              <Row
                apt="דירה 6א"
                payer="יוסי כהן · בעלים"
                amount="₪350"
                date="01/01"
                status="overdue"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`mb-0.5 rounded-md px-2 py-1.5 ${active ? 'font-semibold' : 'text-[var(--ink-2)]'}`}
      style={{
        background: active ? 'var(--bg-2)' : 'transparent',
        color: active ? 'var(--ink)' : undefined,
      }}
    >
      {label}
    </div>
  );
}

function KpiCell({ label, value, tone }: { label: string; value: string; tone?: 'brass' | 'rust' }) {
  const color =
    tone === 'brass' ? 'var(--brass)' : tone === 'rust' ? 'var(--rust)' : 'var(--ink)';
  return (
    <div
      className="rounded-md border p-2"
      style={{ borderColor: 'var(--line)', background: 'var(--bg)' }}
    >
      <div className="text-[10px] text-[var(--ink-3)]">{label}</div>
      <div className="mt-0.5 tnum text-[14px] font-bold ltr" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function Row({
  apt,
  payer,
  amount,
  date,
  status,
}: {
  apt: string;
  payer: string;
  amount: string;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
}) {
  const dot =
    status === 'paid' ? 'var(--moss)' : status === 'pending' ? 'var(--brass)' : 'var(--rust)';
  const text = status === 'paid' ? 'שולם' : status === 'pending' ? 'ממתין' : 'בפיגור';
  return (
    <div
      className="grid grid-cols-[1fr_auto] items-center gap-3 border-t px-3 py-2.5 first:border-t-0 md:grid-cols-[1fr_1fr_auto_auto]"
      style={{ borderColor: 'var(--line)' }}
    >
      <div className="min-w-0">
        <div className="text-[12px] font-semibold">{apt}</div>
        <div className="truncate text-[10px] text-[var(--ink-3)]">{payer}</div>
      </div>
      <div className="hide-mobile text-[11px] text-[var(--ink-3)] ltr">{date}</div>
      <div className="tnum text-[12px] font-bold ltr">{amount}</div>
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
        <span className="text-[10px] font-semibold" style={{ color: dot }}>
          {text}
        </span>
      </div>
    </div>
  );
}
