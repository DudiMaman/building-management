/**
 * Persona segmentation block — per research, this is the canonical SMB-tier
 * pattern (Hemlane, TenantCloud, Buildium). Four roles, each with their
 * own value prop and a small list. Mobile: stack to one column.
 *
 * The 4 personas align with the SPEC's bill-payer model (owner/renter/
 * primary-occupant) plus the management company itself.
 */

const personas = [
  {
    eyebrow: 'לחברות הניהול',
    title: 'נהלו תיק נדל"ן שלם ממסך אחד',
    body: 'מ-3 בניינים ועד 500. אותו דאשבורד מציג גבייה, פניות, צ׳קים והתראות לפי לקוח.',
    points: ['מפת בניינים עם בריאות פיננסית', 'גבייה אוטומטית + מס"ב לספקים', 'דוחות והתאמות לחשבשבת'],
  },
  {
    eyebrow: 'לוועדי בית',
    title: 'ועד שמוביל. לא רץ אחרי ניירת',
    body: 'הצבעות עם חתימה דיגיטלית, פרוטוקולים חתומים, יומן הוצאות שקוף לכולם.',
    points: ['סקרים והצבעות מאובטחות', 'יומן הוצאות וקופה', 'אפליקציית דסקטופ לחברים'],
  },
  {
    eyebrow: 'לבעלי דירות',
    title: 'בעלים נעדר? הכל בשליטה',
    body: 'תיק הדירה לאורך כל החיים שלה. תומך בבעלים נעדר, ריבוי דירות, ופיצול תשלום.',
    points: ['היסטוריית תשלומים מלאה', 'התראה כשהשוכר מאחר', 'ניהול חוזה שכירות דיגיטלי'],
  },
  {
    eyebrow: 'לדיירים ושוכרים',
    title: 'אפליקציה אחת לכל מה שצריך',
    body: 'תשלום בכרטיס אשראי, דיווח תקלות עם תמונה, פתיחת שער חניה בלחיצה.',
    points: ['1-12 תשלומים, בלי טפסים', 'דיווח תקלות מצולם', 'בוט WhatsApp בעברית'],
  },
];

export function Personas() {
  return (
    <section
      id="who"
      className="section border-t"
      style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}
    >
      <div className="container">
        <div className="grid items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="eyebrow-he">למי זה מתאים</div>
            <h2 className="display-2 mt-3 max-w-[18ch]">
              ארבעה משתמשים. פלטפורמה אחת.
            </h2>
          </div>
          <p className="text-[14px] leading-[1.6] text-[var(--ink-3)] md:col-span-5">
            בנינו את המערכת מהבסיס לעולם הישראלי — חברת הניהול,
            הוועד, הבעלים והדייר. כל אחד מקבל את האפליקציה שלו.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:mt-14 md:grid-cols-2">
          {personas.map((p, i) => (
            <div
              key={p.eyebrow}
              className="rounded-lg border p-6 md:p-7"
              style={{ background: 'var(--bg)', borderColor: 'var(--line)' }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <div className="eyebrow-he">{p.eyebrow}</div>
                <div
                  className="tnum text-[12px] font-bold tracking-wider ltr"
                  style={{ color: 'var(--ink-3)' }}
                >
                  {String(i + 1).padStart(2, '0')} / 04
                </div>
              </div>
              <h3 className="display-3 mt-3 max-w-[20ch]" style={{ fontSize: 'clamp(22px,2.4vw,28px)' }}>
                {p.title}
              </h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-[var(--ink-3)]">{p.body}</p>
              <ul
                className="mt-5 space-y-2 border-t pt-4 text-[14px] text-[var(--ink-2)]"
                style={{ borderColor: 'var(--line)' }}
              >
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2">
                    <span
                      className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                      style={{ background: 'var(--brass)' }}
                    />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
