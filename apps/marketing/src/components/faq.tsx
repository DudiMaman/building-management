'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'כמה זמן לוקח להקים את המערכת?',
    a: 'ההקמה לוקחת בין 10 דקות ליום עבודה, תלוי בכמות הבניינים. אנחנו מספקים תהליך הטמעה מובנה — ייבוא דירות ודיירים מ-CSV, יצירת פלאיירים עם QR לחלוקה, וליווי אישי במידת הצורך.',
  },
  {
    q: 'האם אני יכול לייבא נתונים קיימים?',
    a: 'כן. תומכים בייבוא דירות, דיירים, וחיובים מ-CSV או Excel. ייבוא ספקים וחוזים אפשרי דרך תמיכה. צוות ההטמעה שלנו יעזור בהמרת הנתונים מהמערכת הקיימת.',
  },
  {
    q: 'איך עובדת הגבייה האוטומטית?',
    a: 'באמצעות חיבור ל-Tranzila (תקן PCI SAQ-A). הדייר מזין כרטיס פעם אחת באפליקציה, החיוב מתבצע אוטומטית כל חודש. תמיכה ב-1 עד 12 תשלומים, 3DS2 בעסקה הראשונה, ואסקלציה אוטומטית של תזכורות (יום 3, 7, 14, 21, 30) במקרה של תשלום שנכשל.',
  },
  {
    q: 'מה לגבי הגנת הפרטיות?',
    a: 'נתונים בענן ב-EU-West (Frankfurt / Dublin), הצפנה ב-rest (AES-256) וב-transit (TLS 1.2+), תאימות מלאה לחוק הגנת הפרטיות הישראלי ולתקנות GDPR. תיעוד DPA זמין ללקוחות.',
  },
  {
    q: 'יש אפליקציה לדיירים?',
    a: 'כן — אפליקציית iOS ו-Android. דיירים יורידו אותה ויסרקו קוד QR מהפלייר שמופק אוטומטית כשמקימים בניין. תהליך ה-onboarding תומך בכל ארבעת התרחישים: בעלים גר, בעלים שמשכיר ושוכר משלם, בעלים שמשלם ושוכר גר, ופיצול 50/50.',
  },
  {
    q: 'איך עובד הבוט AI?',
    a: 'הבוט מבוסס Claude (Anthropic), עונה בעברית, יכול לבדוק יתרה ספציפית לפי תפקיד (בעלים רואה את כל הדירה, שוכר רק את שלו), לפתוח קריאות שירות עם תמונה, ולהסלים לנציג אנושי באופן אוטומטי כשהוא מזהה תלונה או שאלה מחוץ לסקופ.',
  },
  {
    q: 'תומך בחוזי שכירות מורכבים?',
    a: 'בהחלט. תומכים בכל התרחישים: בעלים גר ומשלם, בעלים שמשכיר ושוכר משלם, בעלים שמשכיר וממשיך לשלם, ופיצול 50/50 — כשכל אחד מקבל חיוב נפרד ב-50% מהסכום, עם קבלה נפרדת לכל אחד.',
  },
  {
    q: 'מה לגבי חשבוניות ורשות המסים?',
    a: 'הפקת חשבונית מס, קבלה, חשבונית מס/קבלה, וחשבונית זיכוי — כולן תואמות רשות המסים עם מספור רציף ללא דילוגים, חתימה דיגיטלית, ואפשרות לקבלת מספר הקצאה (e-invoicing) מ-ITA לחשבוניות מעל לסף החוקי. ייצוא לחשבשבת / ריווחית / פריוריטי.',
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-4xl font-bold">שאלות נפוצות</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          לא מצאתם תשובה?{' '}
          <a href="/contact" className="text-primary hover:underline">
            שלחו לנו הודעה
          </a>{' '}
          ונחזור אליכם.
        </p>
        <div className="mt-12 space-y-3">
          {faqs.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <div
                key={f.q}
                className={`rounded-2xl border bg-white transition ${
                  isOpen ? 'border-primary-200 shadow-md' : 'border-slate-200'
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between px-6 py-5 text-right text-lg font-semibold"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`ms-2 h-5 w-5 shrink-0 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-primary-600' : ''
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 leading-relaxed text-slate-600">{f.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
