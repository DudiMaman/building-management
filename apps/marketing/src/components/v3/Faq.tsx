'use client';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'כמה זמן לוקח להקים בניין במערכת?',
    a:
      'בין 10 דקות (בניין יחיד עם 20 דירות) ליום עבודה (חברה עם 30 בניינים ומיגרציה מ-Excel). תהליך ההקמה אינו דורש מנהל פרויקט וגם לא ספק חיצוני — צוות שלכם מבצע אותו עצמאית. אם תעדיפו ליווי, צוות הצלחת לקוחות זמין ב-Pro ומעלה.',
  },
  {
    q: 'אפשר לייבא דיירים וחיובים מהמערכת הקיימת?',
    a:
      'כן. ייבוא דירות, דיירים, ספקים וחיובים מקובץ Excel או CSV. עבור היסטוריית גבייה מורכבת — אנחנו מסייעים ידנית בייבוא הראשוני (כלול ב-Pro ומעלה).',
  },
  {
    q: 'איך עובדת הגבייה האוטומטית?',
    a:
      'באמצעות חיבור ל-Tranzila (תקן PCI SAQ-A). הדייר מזין פעם אחת כרטיס באפליקציה, החיוב יוצא אוטומטית בתחילת כל חודש. תמיכה ב-1 עד 12 תשלומים. בכישלון חיוב — ניסיון חוזר אוטומטי + אסקלציית תזכורות לפי שלבים: יום 3 אימייל, יום 7 SMS+WhatsApp, יום 14 קופי לבעלים, יום 30 סימון לטיפול משפטי.',
  },
  {
    q: 'מה לגבי הגנת פרטיות?',
    a:
      'הנתונים מאוחסנים ב-EU-West (Frankfurt או Dublin). הצפנה ב-rest (AES-256) ו-in-transit (TLS 1.2+). תאימות מלאה לחוק הגנת הפרטיות התשמ"א-1981 ולתקנות GDPR. DPA חתום זמין ב-Pro ו-Enterprise. בידוד נתונים ברמת PostgreSQL RLS בין חברות הניהול.',
  },
  {
    q: 'יש אפליקציה לדיירים?',
    a:
      'אפליקציה ל-iOS ו-Android, בעברית. הדיירים מורידים אותה וסורקים QR שמופק אוטומטית כשמקימים בניין. תהליך ה-onboarding תומך בכל ארבעת תרחישי הבעלים-שוכר: בעלים גר ומשלם, בעלים משכיר ושוכר משלם, בעלים משכיר וממשיך לשלם, פיצול 50-50.',
  },
  {
    q: 'מי עומד מאחורי הבוט AI?',
    a:
      'הבוט מבוסס Claude מבית Anthropic (לא ChatGPT). מזהה את הדייר לפי מספר טלפון, מודע להקשר (תפקיד, יתרה, חוזה שכירות), פותח קריאות שירות, ומסלים לנציג אנושי כשמזהה תלונה, שאלה משפטית או דרישה מפורשת לנציג. עונה בעברית — לא תרגום של אנגלית.',
  },
  {
    q: 'תומך בחוזי שכירות מורכבים?',
    a:
      'כן — כל ארבעת התרחישים הסטנדרטיים + פיצול 50-50 שבו כל אחד מקבל חיוב נפרד וקבלה נפרדת. שינוי שוכר אמצע החודש מנהל אוטומטית את חלוקת החיוב, וההיסטוריה נשמרת — תוכלו לראות בעוד שלוש שנים מי שילם איזה ועד באיזה חודש.',
  },
  {
    q: 'מה לגבי חשבוניות ורשות המסים?',
    a:
      'הפקת חשבונית מס, קבלה, חשבונית מס/קבלה משולבת וחשבונית זיכוי — תואמות רשות המסים. מספור רציף ללא דילוגים (פונקציית מסד נתונים אטומית). אפשרות לקבלת מספר הקצאה מ-ITA לחשבוניות מעל הסף החוקי. ייצוא לחשבשבת / ריווחית / פריוריטי.',
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section" style={{ background: 'var(--paper)' }}>
      <div className="container max-w-3xl">
        <div className="text-center">
          <div className="eyebrow-he">שאלות נפוצות</div>
          <h2 className="display-2 mt-3">שאלות שאנחנו שומעים הכי הרבה.</h2>
          <p className="lead mx-auto mt-4 max-w-md">
            לא מצאתם תשובה?{' '}
            <a href="#cta" className="link">שלחו לנו הודעה</a>{' '}
            ונחזור תוך 24 שעות.
          </p>
        </div>

        <ul className="mt-10 md:mt-12">
          {faqs.map((f, idx) => {
            const isOpen = open === idx;
            return (
              <li key={f.q} className="border-b first:border-t" style={{ borderColor: 'var(--line)' }}>
                <button
                  onClick={() => setOpen(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="grid w-full grid-cols-[1fr_auto] items-start gap-4 py-5 text-right md:gap-6 md:py-6"
                >
                  <span className="text-[16px] font-bold leading-snug md:text-[18px]">{f.q}</span>
                  <span
                    className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full transition-colors"
                    style={{
                      background: isOpen ? 'var(--ink)' : 'var(--bg-2)',
                      color: isOpen ? 'var(--paper)' : 'var(--ink)',
                    }}
                  >
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="pb-6 pe-12 text-[15px] leading-[1.65] text-[var(--ink-3)] md:text-[16px]">
                    {f.a}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
