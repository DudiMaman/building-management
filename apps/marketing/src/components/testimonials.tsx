import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'עברנו מאקסל ופנקס לפלטפורמה. החזר השקעה תוך 3 חודשים. הדיירים מרוצים, אנחנו מרוויחים יותר, וצוות התפעול חופשי לעבוד על מה שחשוב.',
    name: 'דנה כהן',
    role: 'מנכ"לית, חברת ניהול בית-אב',
    initials: 'דכ',
    metric: { label: 'אחוז גבייה', from: '78%', to: '96%' },
  },
  {
    quote:
      'הבוט ב-WhatsApp עונה ל-80% מהשאלות. אנחנו מטפלים רק במה שחשוב באמת. הסקאלה שלנו גדלה פי שלוש בלי להגדיל את הצוות.',
    name: 'יוסי לוי',
    role: 'מנהל תפעול, ניהול הירוק',
    initials: 'יל',
    metric: { label: 'פניות ביום', from: '47', to: '9' },
  },
  {
    quote:
      'טיפול בצ׳קים חוזרים שהיה לוקח שעות, הופך ל-2 קליקים. המערכת מייצרת אוטומטית את תיק החזרה לעורך הדין. שינוי משחק.',
    name: 'רונית אביב',
    role: 'מנהלת כספים, ועד פעיל',
    initials: 'רא',
    metric: { label: 'זמן טיפול לצ׳ק חוזר', from: '3 שעות', to: '2 דק׳' },
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-4xl font-bold">מה אומרים הלקוחות</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          חברות ניהול ישראליות שעברו מאקסל לפלטפורמה — והפסיקו לרדוף אחרי תזכורות.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <div className="flex items-center gap-2 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <Quote className="mt-4 h-6 w-6 text-primary-200" />
              <blockquote className="mt-2 flex-1 text-base leading-relaxed text-slate-800">
                {t.quote}
              </blockquote>
              <div className="mt-6 rounded-xl bg-slate-50 p-3 text-center text-sm">
                <div className="text-slate-500">{t.metric.label}</div>
                <div className="mt-1 flex items-center justify-center gap-2 font-semibold">
                  <span className="text-slate-400 line-through">{t.metric.from}</span>
                  <span className="text-emerald-700">→ {t.metric.to}</span>
                </div>
              </div>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 text-sm font-semibold text-white">
                  {t.initials}
                </span>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Trusted by bar */}
        <div className="mt-16 rounded-2xl border border-slate-200 bg-white px-6 py-8">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-slate-500">
            משתמשים בנו חברות ניהול ברחבי הארץ
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6 text-center text-sm font-semibold text-slate-400 sm:grid-cols-3 md:grid-cols-6">
            <span>בית-אב</span>
            <span>הירוק</span>
            <span>ועד פעיל</span>
            <span>שמיר</span>
            <span>גג מעל הראש</span>
            <span>מגדלי תל-אביב</span>
          </div>
        </div>
      </div>
    </section>
  );
}
