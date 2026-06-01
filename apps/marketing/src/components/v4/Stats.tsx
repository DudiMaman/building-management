const stats = [
  { value: '₪12M', label: 'גביה אוטומטית בשנה', sub: '94% גבייה ממוצעת מול 85% בתעשייה' },
  { value: '8s', label: 'מענה ראשון לפנייה', sub: 'בוט AI בעברית, 24/7' },
  { value: '60%', label: 'חיסכון בזמן ניהול', sub: 'מדידה אצל לקוחות שעברו מ-Excel' },
  { value: '4', label: 'תרחישי בעלים-שוכר נתמכים', sub: 'הבעלים גר / שוכר משלם / בעלים משלם / 50-50' },
];

export function Stats() {
  return (
    <section className="section paper-grain">
      <div className="container">
        <div className="grid items-end gap-4 md:grid-cols-2 md:gap-10">
          <div>
            <div className="eyebrow">המספרים</div>
            <h2 className="display-2 mt-3 max-w-[18ch]">
              נדל"ן מנוהל נמדד במספרים.
            </h2>
          </div>
          <p className="text-[14px] leading-[1.6] text-[var(--ink-3)] md:text-end">
            מבוסס על נתונים אגרגטיביים של חברות הניהול בפלטפורמה
            לתחילת 2026. המעבר נמדד אצל שלוש חברות שעברו מ-Excel ב-2025.
          </p>
        </div>

        <div
          className="mt-10 grid gap-px overflow-hidden border md:mt-14 md:grid-cols-4"
          style={{ borderColor: 'var(--line-2)', background: 'var(--line-2)' }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="reveal p-6 md:p-8"
              style={{ background: 'var(--paper)', animationDelay: `${i * 60}ms` }}
            >
              <div className="tnum text-[40px] font-extrabold leading-[1] tracking-tight ltr md:text-[48px]">
                {s.value}
              </div>
              <div className="mt-4 text-[14px] font-bold md:text-[15px]">{s.label}</div>
              <div className="mt-1.5 text-[12px] leading-[1.5] text-[var(--ink-3)] md:text-[13px]">
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
