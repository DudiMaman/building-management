export function StatsV2() {
  const items = [
    { value: '₪12M', label: 'גביה אוטומטית בשנה', context: 'דרך Tranzila, ב-94% גבייה' },
    { value: '60%', label: 'חיסכון בזמן ניהול', context: 'מבוסס על 24 חברות פעילות' },
    { value: '8s', label: 'מענה ראשון לפנייה', context: 'בוט AI בעברית, 24/7' },
    { value: '0', label: 'תקלות ETW לחישוב ועד', context: 'מודל בעלים-שוכר-משלם מובנה' },
  ];

  return (
    <section className="border-y border-[var(--ink-line)] bg-[var(--paper-2)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="serif max-w-xl text-3xl leading-tight md:text-4xl">
            מספרים שמייצרים נדל"ן מתפקד.
          </h2>
          <p className="max-w-sm text-sm text-[var(--ink-soft)]">
            מבוסס על נתוני שימוש אגרגטיביים של הלקוחות שלנו לתחילת 2026.
            ההפרשים מול אקסל בעבודה ידנית נמדדו על ידי שלוש חברות ניהול
            שעברו מ-Excel ב-2025.
          </p>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden border border-[var(--ink-line)] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it) => (
            <div key={it.label} className="bg-[var(--paper)] p-8">
              <div className="serif tnum text-5xl leading-none">{it.value}</div>
              <div className="mt-4 text-sm font-medium">{it.label}</div>
              <div className="mt-1 text-xs text-[var(--ink-soft)]">{it.context}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
