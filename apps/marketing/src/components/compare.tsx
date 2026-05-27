import { Check, X, Minus } from 'lucide-react';

type Cell = 'yes' | 'no' | 'partial';

const rows: { label: string; us: Cell; spreadsheet: Cell; competitor: Cell }[] = [
  { label: 'גבייה אוטומטית בכרטיס אשראי', us: 'yes', spreadsheet: 'no', competitor: 'yes' },
  { label: 'בוט AI ב-WhatsApp בעברית', us: 'yes', spreadsheet: 'no', competitor: 'partial' },
  { label: 'מודל בעלים-שוכר-משלם מובנה', us: 'yes', spreadsheet: 'no', competitor: 'no' },
  { label: 'חשבוניות תואמות רשות המסים', us: 'yes', spreadsheet: 'no', competitor: 'partial' },
  { label: 'ניהול צ׳קים חוזרים אוטומטי', us: 'yes', spreadsheet: 'no', competitor: 'no' },
  { label: 'אפליקציה לדיירים (iOS + Android)', us: 'yes', spreadsheet: 'no', competitor: 'yes' },
  { label: 'מס"ב לתשלומי ספקים', us: 'yes', spreadsheet: 'partial', competitor: 'no' },
  { label: 'פלייר QR אוטומטי לקליטה', us: 'yes', spreadsheet: 'no', competitor: 'no' },
  { label: 'אפליקציית דסקטופ', us: 'yes', spreadsheet: 'no', competitor: 'no' },
  { label: 'מחיר חודשי לחברה של 10 בניינים', us: '₪1,290' as unknown as Cell, spreadsheet: '₪0+שעות' as unknown as Cell, competitor: '₪1,800+' as unknown as Cell },
];

function Mark({ v }: { v: Cell }) {
  if (v === 'yes') return <Check className="mx-auto h-5 w-5 text-emerald-600" />;
  if (v === 'no') return <X className="mx-auto h-5 w-5 text-red-400" />;
  if (v === 'partial') return <Minus className="mx-auto h-5 w-5 text-amber-500" />;
  return <span className="font-semibold">{v as unknown as string}</span>;
}

export function Compare() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-4xl font-bold">למה לא להישאר באקסל?</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          השוואה כנה למה שאתם משתמשים בו היום, ולמתחרים שמכירים בשוק.
        </p>

        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-right text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-slate-600">פיצ׳ר</th>
                <th className="px-4 py-4 text-center">
                  <div className="text-base font-bold text-primary-700">ניהול מבנים</div>
                </th>
                <th className="px-4 py-4 text-center">
                  <div className="text-base font-bold text-slate-600">אקסל + פנקס</div>
                </th>
                <th className="px-4 py-4 text-center">
                  <div className="text-base font-bold text-slate-600">פתרון מתחרה</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.label} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3 text-slate-700">{r.label}</td>
                  <td className="px-4 py-3 text-center"><Mark v={r.us} /></td>
                  <td className="px-4 py-3 text-center"><Mark v={r.spreadsheet} /></td>
                  <td className="px-4 py-3 text-center"><Mark v={r.competitor} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          ההשוואה היא הצהרה אובייקטיבית של הפיצ׳רים. מתחרים השוואה: שילוב ממוצע של Bllink + Darimpo.
        </p>
      </div>
    </section>
  );
}
