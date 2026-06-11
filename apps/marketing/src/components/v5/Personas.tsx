import { Reveal } from './Reveal';

/** Four roles, one platform — condensed from v3's proven section. */

const personas = [
  {
    eyebrow: 'לחברות הניהול',
    title: 'תיק נדל"ן שלם ממסך אחד',
    body: 'מ-3 בניינים ועד 500 — מפת בניינים עם בריאות פיננסית, גבייה ודוחות לפי לקוח.',
  },
  {
    eyebrow: 'לוועדי בית',
    title: 'ועד שמוביל, לא רץ אחרי ניירת',
    body: 'הצבעות בחתימה דיגיטלית, פרוטוקולים חתומים ויומן הוצאות שקוף לכולם.',
  },
  {
    eyebrow: 'לבעלי דירות',
    title: 'גם בעלים נעדר בשליטה מלאה',
    body: 'תיק דירה לאורך כל חייה: היסטוריית תשלומים, חוזה שכירות, התראה כשהשוכר מאחר.',
  },
  {
    eyebrow: 'לדיירים ושוכרים',
    title: 'אפליקציה אחת לכל מה שצריך',
    body: 'תשלום בכרטיס, דיווח תקלה עם תמונה, פתיחת שער בלחיצה ובוט WhatsApp בעברית.',
  },
];

export function Personas() {
  return (
    <section id="who" className="section border-t" style={{ borderColor: 'var(--line)' }}>
      <div className="container">
        <div className="max-w-2xl">
          <div className="eyebrow">למי זה מתאים</div>
          <h2 className="display-2 mt-3">ארבעה משתמשים. פלטפורמה אחת.</h2>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 md:mt-14">
          {personas.map((p, i) => (
            <Reveal key={p.eyebrow} delay={i * 70}>
              <div className="card h-full p-6">
                <div className="flex items-baseline justify-between gap-2">
                  <div className="eyebrow !text-[11px]">{p.eyebrow}</div>
                  <span className="eyebrow-en tnum !text-[10px]">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-3 text-[18px] font-extrabold leading-snug">{p.title}</h3>
                <p className="mt-2.5 text-[14px] leading-[1.65] text-[var(--ink-3)]">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
