'use client';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'כמה זמן לוקח להקים בניין במערכת?',
    a: 'בין 10 דקות (בניין יחיד עם 20 דירות) ליום עבודה (חברה עם 30 בניינים שמייבאת היסטוריית גבייה). תהליך ההקמה אינו דורש מנהל פרויקט ולא ספק חיצוני — צוות שלכם מבצע אותו עצמאית. אם אתם מעדיפים ליווי, צוות הצלחת לקוחות שלנו זמין ב-Pro ומעלה.',
  },
  {
    q: 'אפשר לייבא דיירים וחיובים מהמערכת הקיימת?',
    a: 'כן. ייבוא דירות, דיירים, ספקים וחיובים מקובץ Excel או CSV. עבור היסטוריית גבייה מורכבת — אנחנו מסייעים ידנית בייבוא הראשוני (כלול ב-Pro).',
  },
  {
    q: 'איך עובדת הגבייה האוטומטית?',
    a: 'באמצעות חיבור ל-Tranzila (תקן PCI SAQ-A). הדייר מזין פעם אחת כרטיס באפליקציה, החיוב מתבצע אוטומטית בתחילת כל חודש. תמיכה ב-1 עד 12 תשלומים. בכישלון חיוב — ניסיון חוזר אוטומטי + אסקלציית תזכורות לפי שלבים: יום 3 אימייל, יום 7 SMS+WhatsApp, יום 14 קופי לבעלים, יום 30 סימון לטיפול משפטי.',
  },
  {
    q: 'מה לגבי הגנת פרטיות והרשאות?',
    a: 'הנתונים מאוחסנים ב-EU-West (Frankfurt או Dublin). הצפנה ב-rest (AES-256) ו-in-transit (TLS 1.2+). תאימות מלאה לחוק הגנת הפרטיות התשמ״א-1981 ולתקנות GDPR. DPA חתום זמין ב-Pro ו-Enterprise. בידוד נתונים ברמת PostgreSQL RLS בין חברות הניהול.',
  },
  {
    q: 'יש אפליקציה לדיירים?',
    a: 'אפליקציה ל-iOS ו-Android, בעברית. הדיירים מורידים אותה ומסרקים QR שמופק אוטומטית כשמקימים בניין. תהליך ה-onboarding תומך בכל ארבעת תרחישי הבעלים-שוכר: בעלים גר ומשלם, בעלים משכיר ושוכר משלם, בעלים משכיר וממשיך לשלם, פיצול 50-50.',
  },
  {
    q: 'מי עומד מאחורי הבוט?',
    a: 'הבוט מבוסס על Claude מבית Anthropic (לא ChatGPT). מזהה את הדייר לפי מספר טלפון, מודע להקשר (תפקיד, יתרה, חוזה שכירות), פותח קריאות שירות, ומסלים לנציג אנושי כשמזהה תלונה, שאלה משפטית, או דרישה מפורשת לנציג. עונה בעברית — לא תרגום של אנגלית.',
  },
  {
    q: 'תומך בחוזי שכירות מורכבים?',
    a: 'בהחלט. תומכים בכל ארבעת התרחישים הסטנדרטיים, וגם בפיצול 50-50 שבו כל אחד מקבל חיוב נפרד וקבלה נפרדת. שינוי שוכר אמצע החודש מנהל אוטומטית את חלוקת החיוב, וההיסטוריה נשמרת — תוכלו לראות בעוד שלוש שנים מי שילם איזה ועד באיזה חודש.',
  },
  {
    q: 'מה לגבי חשבוניות ורשות המסים?',
    a: 'הפקת חשבונית מס, קבלה, חשבונית מס/קבלה משולבת וחשבונית זיכוי — תואמות רשות המסים. מספור רציף ללא דילוגים (פונקציית מסד נתונים אטומית). אפשרות לקבלת מספר הקצאה מ-ITA לחשבוניות מעל הסף החוקי. ייצוא לחשבשבת / ריווחית / פריוריטי.',
  },
];

export function FaqV2() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-b border-[var(--ink-line)]">
      <div className="mx-auto max-w-4xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="text-center">
          <span className="label text-[var(--brass)]">FAQ</span>
          <h2 className="serif mt-3 text-4xl leading-tight md:text-5xl">
            שאלות שאנחנו{' '}
            <span className="italic text-[var(--ink-soft)]">שומעים הכי הרבה.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-md text-sm text-[var(--ink-soft)]">
            לא מצאתם תשובה?{' '}
            <a href="/contact" className="link text-[var(--ink)]">
              שלחו לנו הודעה
            </a>{' '}
            ונחזור תוך 24 שעות.
          </p>
        </div>

        <ul className="mt-14">
          {faqs.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <li key={f.q} className="border-b border-[var(--ink-line)] first:border-t">
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-6 py-6 text-right"
                >
                  <span className="label mt-2 shrink-0 text-[var(--brass)]">
                    Q.{String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="serif flex-1 text-xl leading-snug">{f.q}</span>
                  <span className="mt-1 shrink-0 text-[var(--ink-soft)]">
                    {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="pe-12 ps-[68px] pb-6 text-[var(--ink-soft)]">{f.a}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
