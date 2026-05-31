const steps = [
  {
    n: '01',
    title: 'הרשמה ויצירת בניין ראשון',
    body:
      'הרשמה לוקחת 4 דקות. מילוי פרטי החברה, יצירת הבניין, ייבוא דירות מ-CSV או הזנה ידנית. בלי ספק שמתקין.',
    time: '~4 דק׳',
  },
  {
    n: '02',
    title: 'פלייר QR לחלוקה',
    body:
      'הפלייר מופק אוטומטית בעברית עם QR ייעודי לבניין שלכם. הדפסה ללובי, שיתוף בקבוצת WhatsApp של הדיירים.',
    time: 'מיידי',
  },
  {
    n: '03',
    title: 'דיירים נרשמים, מחברים אשראי',
    body:
      'הדייר סורק, מוריד את האפליקציה, מצמיד כרטיס פעם אחת. החיוב הראשון מתבצע במחזור הבא — בלי מעקב.',
    time: '24-72 שעות',
  },
  {
    n: '04',
    title: 'אתם מתחילים לנהל',
    body:
      'דאשבורד אחד מציג גבייה, פניות פתוחות, צ׳קים חוזרים והתראות. הצוות חופשי לעבוד על מה שדורש שיקול דעת.',
    time: 'מהיום ה-3',
  },
];

export function HowItWorksV2() {
  return (
    <section id="how" className="border-b border-[var(--ink-line)]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <span className="label text-[var(--brass)]">PROCESS</span>
            <h2 className="serif mt-3 text-4xl leading-tight md:text-5xl">
              מהרשמה ועד גבייה ראשונה —{' '}
              <span className="italic text-[var(--ink-soft)]">בשבוע.</span>
            </h2>
            <p className="mt-6 max-w-sm text-base text-[var(--ink-soft)]">
              בלי הקמה, בלי מנהל פרויקט, בלי שבוע של אימון לצוות.
              המערכת בנויה לעבודה עצמית. אם רוצים ליווי — יש צוות הצלחת
              לקוחות בעברית.
            </p>
          </div>

          <ol className="lg:col-span-8">
            {steps.map((s, idx) => (
              <li
                key={s.n}
                className={`grid grid-cols-[80px_1fr_auto] gap-6 py-8 ${
                  idx !== steps.length - 1 ? 'border-b border-[var(--ink-line)]' : ''
                }`}
              >
                <div className="serif tnum text-4xl text-[var(--brass)]">{s.n}</div>
                <div>
                  <h3 className="serif text-2xl leading-snug">{s.title}</h3>
                  <p className="mt-2 max-w-prose text-[var(--ink-soft)]">{s.body}</p>
                </div>
                <div className="hidden whitespace-nowrap pt-3 md:block">
                  <span className="label text-[var(--ink-soft)]">{s.time}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
