import { QrCode, Smartphone, CreditCard, BarChart3 } from 'lucide-react';

const steps = [
  {
    n: '01',
    icon: Smartphone,
    title: 'הירשמו ב-10 דקות',
    body: 'מילוי טופס קצר, אישור מייל, ויצירת הבניין הראשון — והכל מוכן.',
  },
  {
    n: '02',
    icon: QrCode,
    title: 'הפיקו פלייר עם QR',
    body: 'הפלאיירים מופקים אוטומטית — הדפסה לוובי, שיתוף בקבוצת ה-WhatsApp.',
  },
  {
    n: '03',
    icon: CreditCard,
    title: 'דיירים נרשמים ומשלמים',
    body: 'הדייר סורק את ה-QR, מתקין את האפליקציה, ומחבר כרטיס אשראי.',
  },
  {
    n: '04',
    icon: BarChart3,
    title: 'אתם רואים את הכל',
    body: 'אחוז גבייה, פניות פתוחות, צ׳קים חוזרים — בדאשבורד אחד.',
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-4xl font-bold">איך זה עובד</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          מההרשמה ועד החיוב הראשון — תוך 24 שעות. בלי טכנאים, בלי הקמה ידנית.
        </p>

        <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <li
                key={step.n}
                className="relative rounded-2xl border border-slate-200 bg-white p-6"
              >
                <span className="absolute -top-3 right-6 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-indigo-500 text-xs font-bold text-white">
                  {step.n}
                </span>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.body}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
