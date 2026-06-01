const steps = [
  {
    n: '01',
    title: 'הרשמה ויצירת בניין ראשון',
    body: 'מילוי פרטי החברה, יצירת בניין, ייבוא דירות מ-Excel או הזנה ידנית.',
    time: '4 דק׳',
  },
  {
    n: '02',
    title: 'פלייר QR לחלוקה',
    body: 'הפלייר מופק אוטומטית בעברית. תליה בלובי, שליחה לקבוצת WhatsApp.',
    time: 'מיידי',
  },
  {
    n: '03',
    title: 'דיירים נרשמים ומחברים אשראי',
    body: 'הדייר סורק, מוריד את האפליקציה, מצמיד כרטיס פעם אחת. החיוב הראשון יוצא במחזור הבא.',
    time: '24-72 ש׳',
  },
  {
    n: '04',
    title: 'הצוות מתחיל לנהל',
    body: 'דאשבורד אחד מציג גבייה, פניות, צ׳קים והתראות. הצוות חופשי לעסוק במה שדורש שיקול דעת.',
    time: 'מהיום ה-3',
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="section border-y"
      style={{ borderColor: 'var(--line)', background: 'var(--paper)' }}
    >
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="eyebrow">איך זה עובד</div>
            <h2 className="display-2 mt-3 max-w-[14ch]">
              מההרשמה ועד הגבייה הראשונה — בשבוע.
            </h2>
            <p className="lead mt-5 max-w-md">
              בלי הקמה, בלי מנהל פרויקט, בלי שבוע אימון לצוות. המערכת
              בנויה לעבודה עצמית. צוות הצלחת לקוחות בעברית זמין ב-Pro
              ומעלה אם רוצים ליווי.
            </p>
          </div>

          <ol className="lg:col-span-8">
            {steps.map((s, i) => (
              <li
                key={s.n}
                className={`reveal grid grid-cols-[56px_1fr] gap-4 py-7 md:grid-cols-[64px_1fr_auto] md:gap-6 ${
                  i < steps.length - 1 ? 'border-b' : ''
                }`}
                style={{ borderColor: 'var(--line)', animationDelay: `${i * 100}ms` }}
              >
                <div className="text-[28px] font-extrabold leading-none tnum ltr md:text-[36px]" style={{ color: 'var(--brass)' }}>
                  {s.n}
                </div>
                <div>
                  <h3 className="text-[18px] font-extrabold leading-tight md:text-[22px]">{s.title}</h3>
                  <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-[var(--ink-3)]">
                    {s.body}
                  </p>
                </div>
                <div className="hide-mobile pt-2 text-end">
                  <span className="eyebrow-en">{s.time}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
