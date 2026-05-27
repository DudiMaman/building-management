import type { Metadata } from 'next';
import { LegalPage } from '@/components/legal-page';

export const metadata: Metadata = {
  title: 'הסכם עיבוד נתונים (DPA) — ניהול מבנים',
  description:
    'הסכם עיבוד נתונים סטנדרטי בין החברה ללקוחות העסקיים (Data Processing Agreement) — תואם GDPR + חוק הגנת הפרטיות.',
};

export default function DpaPage() {
  return (
    <LegalPage title='הסכם עיבוד נתונים (DPA)' updated="27 במאי 2026">
      <p>
        מסמך זה מהווה הסכם עיבוד נתונים (Data Processing Agreement) בין
        חברת הניהול ("בעל המידע", "Data Controller") לבין ניהול מבנים בע"מ
        ("מעבד המידע", "Data Processor"). DPA חתום בנפרד זמין לכל לקוח
        שירות בתוכניות Pro ו-Enterprise.
      </p>

      <h2>1. נושא ההסכם</h2>
      <p>
        הסכם זה מסדיר את עיבוד הנתונים האישיים של דיירים, בעלי דירות,
        שוכרים, ספקים, ועובדי חברת הניהול במסגרת השימוש בפלטפורמת ניהול
        מבנים.
      </p>

      <h2>2. סוגי נתונים</h2>
      <ul>
        <li>פרטי זיהוי: שם, אימייל, טלפון, מספר זהות (מוצפן).</li>
        <li>פרטי דירה: כתובת, מספר יחידה.</li>
        <li>פרטים פיננסיים: חיובים, תשלומים, אמצעי תשלום (טוקנים בלבד).</li>
        <li>תקשורת: הודעות, פניות שירות.</li>
      </ul>

      <h2>3. תקופת העיבוד</h2>
      <p>
        העיבוד מתבצע לכל אורך תקופת ההתקשרות, ובהתאם לחובת שמירה משפטית
        (7 שנים לתיעוד חשבונאי) לאחר סיומה.
      </p>

      <h2>4. אמצעי אבטחה (TOMs)</h2>
      <ul>
        <li>הצפנת תקשורת ב-TLS 1.2+, הצפנת נתונים במנוחה ב-AES-256.</li>
        <li>בקרת גישה לפי הרשאות מינימליות (least privilege).</li>
        <li>בידוד נתונים בין לקוחות ברמת PostgreSQL RLS.</li>
        <li>גיבויים יומיים מוצפנים, Point-In-Time Recovery.</li>
        <li>סקירת קוד, סריקת פגיעויות שבועית.</li>
        <li>הדרכת מודעות אבטחה לעובדים.</li>
        <li>ביטוח Cyber משפטי.</li>
      </ul>

      <h2>5. תת-מעבדי משנה (Sub-processors)</h2>
      <ul>
        <li>Supabase — אחסון נתונים ב-EU-West (Frankfurt / Dublin).</li>
        <li>Tranzila — עיבוד תשלומים (תקן PCI SAQ-A).</li>
        <li>Anthropic — שירות AI ל-WhatsApp בוט.</li>
        <li>Meta — WhatsApp Business Cloud API.</li>
        <li>Resend — שליחת אימיילים.</li>
        <li>Inforu / 019 — שליחת SMS.</li>
      </ul>
      <p>
        רשימה מעודכנת זמינה לעיון בלקוחות. שינוי תת-מעבד יתבצע בהתראה של
        30 יום מראש.
      </p>

      <h2>6. העברות בינלאומיות</h2>
      <p>
        כל הנתונים מאוחסנים באיחוד האירופי (Frankfurt או Dublin). אין
        העברת נתונים לארה"ב או למדינות שאינן מאושרות לפי GDPR.
      </p>

      <h2>7. דיווח על אירועי אבטחה</h2>
      <p>
        אנו נדווח על כל אירוע אבטחה רלוונטי לבעל המידע בתוך 72 שעות.
      </p>

      <h2>8. ביקורת וזכות אודיט</h2>
      <p>
        לבעל המידע זכות לבצע אודיט אחד בשנה (לאחר התראה של 30 יום)
        ולקבל דוחות SOC 2 שלנו.
      </p>

      <h2>9. סיום הסכם</h2>
      <p>
        בסיום ההתקשרות, אנו נחזיר לבעל המידע את כל הנתונים ב-Export ZIP, או
        נמחק אותם — לפי בקשת בעל המידע, בכפוף לחובת שמירה משפטית.
      </p>

      <p className="mt-8 text-sm text-slate-500">
        לקבלת DPA חתום: <a href="mailto:legal@building-management.co.il" className="text-primary">legal@building-management.co.il</a>
      </p>
    </LegalPage>
  );
}
