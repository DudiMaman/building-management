const quotes = [
  {
    quote: 'הפסקתי לרדוף אחרי דיירים. החיוב חודשי אוטומטי, צ׳קים שחזרו מטופלים ב-2 קליקים, והמייל שלי שקט.',
    name: 'דנה כהן',
    role: 'מנכ"לית · ח. ניהול בית-אב',
    metric: { from: '78%', to: '96%', label: 'אחוז גבייה' },
  },
  {
    quote: 'הבוט בוואטסאפ עונה ל-80% מהפניות לפני שאני מסתכל בטלפון. גדלנו פי שלוש בלי להוסיף נציגי שירות.',
    name: 'יוסי לוי',
    role: 'מנהל תפעול · ניהול הירוק',
    metric: { from: '47', to: '9', label: 'פניות יומיות' },
  },
  {
    quote: 'מה שהיה לוקח שעות — תיק לעורך דין על צ׳ק שחזר — הופך לשתי דקות. המודל בעלים-שוכר-משלם פשוט עובד.',
    name: 'רונית אביב',
    role: 'מנהלת כספים · ועד פעיל',
    metric: { from: '3 שעות', to: '2 דק׳', label: 'טיפול בצ׳ק חוזר' },
  },
];

export function Testimonials() {
  return (
    <section
      id="proof"
      className="section border-y"
      style={{ borderColor: 'var(--line)', background: 'var(--bg-2)' }}
    >
      <div className="container">
        <div className="grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="eyebrow">לקוחות מספרים</div>
            <h2 className="display-2 mt-3 max-w-[18ch]">
              שלוש חברות שעברו מאקסל ופנקס.
            </h2>
          </div>
          <p className="text-[14px] text-[var(--ink-3)] md:col-span-5">
            שלושה ציטוטים — שלושה מנהלות ומנהלים שעובדים במערכת כל יום.
            נסמן עוד לקוחות חדשים בכל רבעון.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:mt-12 md:grid-cols-3">
          {quotes.map((q, i) => (
            <figure
              key={q.name}
              className="card reveal flex flex-col p-6 md:p-7"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <blockquote className="flex-1 text-[17px] leading-[1.55] md:text-[18px]">
                <span style={{ color: 'var(--brass)' }}>”</span>
                {q.quote}
                <span style={{ color: 'var(--brass)' }}>”</span>
              </blockquote>

              <div
                className="mt-6 grid grid-cols-2 overflow-hidden rounded-md text-center"
                style={{ background: 'var(--bg)' }}
              >
                <div className="border-l p-3" style={{ borderColor: 'var(--line)' }}>
                  <div className="eyebrow-en">לפני</div>
                  <div className="mt-1 text-[18px] font-extrabold tnum text-[var(--ink-3)] line-through ltr">
                    {q.metric.from}
                  </div>
                </div>
                <div className="p-3">
                  <div className="eyebrow-en" style={{ color: 'var(--brass)' }}>אחרי</div>
                  <div className="mt-1 text-[18px] font-extrabold tnum ltr">{q.metric.to}</div>
                </div>
              </div>
              <div
                className="-mt-px py-2 text-center text-[11px] text-[var(--ink-3)]"
                style={{ background: 'var(--bg)', borderTop: '1px solid var(--line)' }}
              >
                {q.metric.label}
              </div>

              <figcaption
                className="mt-6 flex items-center gap-3 border-t pt-5"
                style={{ borderColor: 'var(--line)' }}
              >
                <span
                  className="grid h-9 w-9 place-items-center rounded-full text-[12px] font-extrabold"
                  style={{ background: 'var(--bg-3)', color: 'var(--ink)' }}
                >
                  {q.name.split(' ').map((s) => s[0]).join('')}
                </span>
                <div>
                  <div className="text-[14px] font-extrabold">{q.name}</div>
                  <div className="text-[12px] text-[var(--ink-3)]">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-14 border-t pt-10" style={{ borderColor: 'var(--line-2)' }}>
          <div className="eyebrow-en mb-6 text-center">CLIENT ROSTER · 2026</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-center sm:grid-cols-3 md:grid-cols-6">
            {['בית-אב', 'הירוק', 'ועד פעיל', 'שמיר', 'גג מעל הראש', 'מגדלי תל-אביב'].map((n) => (
              <div key={n} className="text-[15px] font-bold text-[var(--ink-2)]">
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
