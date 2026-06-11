'use client';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

/** Six questions (trimmed from v4's eight) — side header + accordion. */

const faqs = [
  {
    q: 'כמה זמן לוקח להקים בניין במערכת?',
    a: 'בין 10 דקות (בניין יחיד עם 20 דירות) ליום עבודה (חברה עם 30 בניינים ומיגרציה מ-Excel). הצוות שלכם מבצע את ההקמה עצמאית, ואם תעדיפו ליווי — צוות הצלחת לקוחות זמין ב-Pro ומעלה.',
  },
  {
    q: 'אפשר לייבא דיירים וחיובים מהמערכת הקיימת?',
    a: 'כן. ייבוא דירות, דיירים, ספקים וחיובים מקובץ Excel או CSV. עבור היסטוריית גבייה מורכבת אנחנו מסייעים ידנית בייבוא הראשוני (כלול ב-Pro ומעלה).',
  },
  {
    q: 'איך עובדת הגבייה האוטומטית?',
    a: 'חיבור ל-Tranzila (תקן PCI SAQ-A). הדייר מזין כרטיס פעם אחת באפליקציה, והחיוב יוצא אוטומטית בתחילת כל חודש — 1 עד 12 תשלומים. בכישלון חיוב: ניסיון חוזר + תזכורות מדורגות עד סימון לטיפול משפטי ביום 30.',
  },
  {
    q: 'מה לגבי הגנת פרטיות?',
    a: 'הנתונים מאוחסנים ב-EU-West, מוצפנים ב-rest וב-transit. תאימות מלאה לחוק הגנת הפרטיות התשמ"א-1981 ול-GDPR, עם בידוד נתונים ברמת PostgreSQL RLS בין חברות הניהול. DPA חתום זמין ב-Pro ומעלה.',
  },
  {
    q: 'יש אפליקציה לדיירים?',
    a: 'iOS ו-Android, בעברית. הדיירים סורקים QR שמופק כשמקימים את הבניין, וה-onboarding תומך בכל תרחישי בעלים-שוכר: בעלים גר ומשלם, שוכר משלם, בעלים משלם, או פיצול 50-50.',
  },
  {
    q: 'מי עומד מאחורי הבוט?',
    a: 'הבוט מבוסס Claude מבית Anthropic. הוא מזהה את הדייר לפי טלפון, מכיר את ההקשר (תפקיד, יתרה, חוזה), פותח קריאות שירות ומסלים לנציג אנושי כשצריך. עונה בעברית — לא בתרגום.',
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section border-t" style={{ borderColor: 'var(--line)' }}>
      <div className="container">
        <div className="grid gap-8 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <div className="eyebrow">שאלות נפוצות</div>
            <h2 className="display-2 mt-3 max-w-[12ch]">לפני שאתם שואלים.</h2>
            <p className="lead mt-5 max-w-sm">
              לא מצאתם תשובה? <a href="#cta" className="link">שלחו הודעה</a> ונחזור תוך 24 שעות.
            </p>
          </div>

          <div className="md:col-span-8">
            <ul>
              {faqs.map((f, idx) => {
                const isOpen = open === idx;
                return (
                  <li key={f.q} className="border-b first:border-t" style={{ borderColor: 'var(--line)' }}>
                    <button
                      onClick={() => setOpen(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="grid w-full grid-cols-[1fr_auto] items-start gap-4 py-5 text-right md:py-6"
                    >
                      <span className="text-[16px] font-bold leading-snug md:text-[17px]">{f.q}</span>
                      <span
                        className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full transition-colors"
                        style={{
                          background: isOpen ? 'var(--brass)' : 'var(--bg-2)',
                          color: isOpen ? 'var(--paper)' : 'var(--ink)',
                        }}
                      >
                        {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pb-6 pe-11 text-[14px] leading-[1.7] text-[var(--ink-3)] md:text-[15px]">{f.a}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
