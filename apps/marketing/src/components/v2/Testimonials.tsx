const quotes = [
  {
    quote:
      'הפסקתי לרדוף אחרי דיירים. החיוב חודשי אוטומטי, הצ׳קים חוזרים מטופלים ב-2 קליקים, והמייל שלי שקט.',
    name: 'דנה כהן',
    role: 'מנכ״לית · חברת ניהול בית-אב',
    metric: { from: '78%', to: '96%', label: 'אחוז גביה' },
  },
  {
    quote:
      'הבוט עונה ל-80% מהשאלות לפני שאני מסתכל בטלפון. הצוות שלי גדל פי שלוש בלי להוסיף נציגי שירות.',
    name: 'יוסי לוי',
    role: 'מנהל תפעול · ניהול הירוק',
    metric: { from: '47', to: '9', label: 'פניות יומיות' },
  },
  {
    quote:
      'מה שהיה לוקח שעות — תיק לעורך דין על צ׳ק שחזר — הופך לדקה. המודל בעלים-שוכר-משלם פשוט עובד.',
    name: 'רונית אביב',
    role: 'מנהלת כספים · ועד פעיל',
    metric: { from: '3 שעות', to: '2 דק׳', label: 'טיפול בצ׳ק חוזר' },
  },
];

export function TestimonialsV2() {
  return (
    <section id="proof" className="border-b border-[var(--ink-line)] bg-[var(--paper)]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="label text-[var(--brass)]">CLIENTS</span>
            <h2 className="serif mt-3 text-4xl leading-tight md:text-5xl">
              חברות ניהול שעברו{' '}
              <span className="italic text-[var(--ink-soft)]">מאקסל ופנקס.</span>
            </h2>
          </div>
          <p className="max-w-md text-[var(--ink-soft)] lg:col-span-5">
            שלושה ציטוטים — שלושה משתמשים שעובדים במערכת כל יום. נסמן
            לקוחות חדשים בכל רבעון.
          </p>
        </div>

        <div className="mt-12 grid gap-px border border-[var(--ink-line)] bg-[var(--ink-line)] md:grid-cols-3">
          {quotes.map((q) => (
            <figure key={q.name} className="flex flex-col bg-[var(--paper)] p-8 lg:p-10">
              <blockquote className="serif text-2xl leading-snug">
                <span className="text-[var(--brass)]">&ldquo;</span>
                {q.quote}
                <span className="text-[var(--brass)]">&rdquo;</span>
              </blockquote>

              <div className="mt-8 grid grid-cols-2 gap-px border border-[var(--ink-line)] bg-[var(--ink-line)] text-xs">
                <div className="bg-[var(--paper-2)] p-3">
                  <div className="label text-[var(--ink-soft)]">לפני</div>
                  <div className="serif tnum mt-1 text-xl text-[var(--ink-soft)] line-through">
                    {q.metric.from}
                  </div>
                </div>
                <div className="bg-[var(--paper-2)] p-3">
                  <div className="label text-[var(--moss)]">אחרי</div>
                  <div className="serif tnum mt-1 text-xl text-[var(--ink)]">
                    {q.metric.to}
                  </div>
                </div>
                <div className="col-span-2 bg-[var(--paper)] p-3 text-center text-xs text-[var(--ink-soft)]">
                  {q.metric.label}
                </div>
              </div>

              <figcaption className="mt-6 flex-1 pt-6 border-t border-[var(--ink-line)]">
                <div className="text-sm font-medium">{q.name}</div>
                <div className="mt-1 text-xs text-[var(--ink-soft)]">{q.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Client roster */}
        <div className="mt-16 border-t border-[var(--ink-line)] pt-10">
          <div className="label mb-6 text-[var(--ink-soft)]">CLIENT ROSTER · 2026</div>
          <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            {['בית-אב', 'הירוק', 'ועד פעיל', 'שמיר', 'גג מעל הראש', 'מגדלי תל-אביב'].map((n) => (
              <div key={n} className="serif text-lg text-[var(--ink-soft)]">
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
