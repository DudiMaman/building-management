const integrations = [
  { name: 'Tranzila', desc: 'סליקת אשראי' },
  { name: 'WhatsApp', desc: 'Business Cloud API' },
  { name: 'Claude', desc: 'AI מבית Anthropic' },
  { name: 'חשבשבת', desc: 'ייצוא חשבונאי' },
  { name: 'ריווחית', desc: 'ייצוא חשבונאי' },
  { name: 'מס"ב', desc: 'תשלומי ספקים בינבנקאיים' },
  { name: 'רשות המסים', desc: 'הקצאה דיגיטלית' },
  { name: 'Supabase', desc: 'אחסון מאובטח באירופה' },
];

export function Integrations() {
  return (
    <section className="bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold">משתלב עם מה שאתם כבר משתמשים</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          אינטגרציות ישירות עם הספקים הישראליים והגלובליים שמניעים את ניהול הבניין.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {integrations.map((i) => (
            <div
              key={i.name}
              className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-primary-200"
            >
              <div className="text-base font-semibold">{i.name}</div>
              <div className="mt-1 text-xs text-slate-500">{i.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
