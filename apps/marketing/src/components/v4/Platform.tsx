/**
 * Platform breadth — bento grid with staggered entrance.
 * Per ui-ux-pro-max: bento is for "breadth section, not hero" + use
 * 30-50ms stagger. Mobile: stack to one column. Desktop: 6-col with
 * mixed cell sizes for editorial rhythm.
 */
import {
  Wallet, MessageCircle, FileText, Wrench, Receipt, KeyRound, FolderArchive, Megaphone,
} from 'lucide-react';

export function Platform() {
  return (
    <section id="platform" className="section">
      <div className="container">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <div className="eyebrow">הפלטפורמה</div>
            <h2 className="display-2 mt-3 max-w-[20ch]">
              גבייה, אחזקה ותקשורת — במקום אחד.
            </h2>
          </div>
          <p className="lead lg:col-span-5">
            לא תוכנה — מערכת תפעול. כל מודול תוכנן יחד עם חברות ניהול
            ישראליות שעובדות במערכת היום. כולל מודלים מקומיים: בעלים-שוכר-משלם,
            רשות המסים, מס"ב, צ׳קים דחויים, ואסיפת ועד דיגיטלית.
          </p>
        </div>

        {/* Bento grid */}
        <div className="mt-12 grid grid-cols-1 gap-3 md:mt-14 md:grid-cols-6">
          {/* Big featured card */}
          <Card span="md:col-span-4 md:row-span-2" big delay={0}>
            <CardEyebrow icon={Wallet} eyebrow="01 / גבייה" />
            <h3 className="mt-4 display-3 max-w-[20ch]">
              חיוב חודשי בכרטיס אשראי. 1–12 תשלומים.
            </h3>
            <p className="mt-3 max-w-[44ch] text-[15px] leading-[1.55] text-[var(--ink-3)]">
              טוקן Tranzila מאובטח, ניסיון חוזר אוטומטי בכישלון, ואסקלציית
              תזכורות לפי שלבים — מיום שלישי באימייל, יום שביעי ב-SMS,
              יום ארבעה-עשר קופי לבעלים, ויום שלושים — סימון לטיפול
              משפטי. תומך במלוא 4 תרחישי בעלים-שוכר-משלם.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Tranzila', '3DS2', 'מס"ב', '1-12 תשלומים', 'תזכורות חכמות'].map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </Card>

          <Card span="md:col-span-2" delay={50}>
            <CardEyebrow icon={MessageCircle} eyebrow="02" />
            <h3 className="mt-3 text-[18px] font-extrabold">בוט AI בעברית</h3>
            <p className="card-body">8 שניות למענה ראשון. WhatsApp + אפליקציה.</p>
          </Card>

          <Card span="md:col-span-2" delay={100}>
            <CardEyebrow icon={FileText} eyebrow="03" />
            <h3 className="mt-3 text-[18px] font-extrabold">חשבוניות ITA</h3>
            <p className="card-body">מספור רציף, ייצוא לחשבשבת ופריוריטי.</p>
          </Card>

          <Card span="md:col-span-2" delay={150}>
            <CardEyebrow icon={Wrench} eyebrow="04" />
            <h3 className="mt-3 text-[18px] font-extrabold">פניות שירות</h3>
            <p className="card-body">סיווג AI, מעקב SLA, ניתוב חכם.</p>
          </Card>

          <Card span="md:col-span-2" delay={200}>
            <CardEyebrow icon={Receipt} eyebrow="05" />
            <h3 className="mt-3 text-[18px] font-extrabold">צ׳קים דחויים</h3>
            <p className="card-body">סריקה, הפקדה, טיפול בחזרה ב-2 קליקים.</p>
          </Card>

          <Card span="md:col-span-2" delay={250}>
            <CardEyebrow icon={KeyRound} eyebrow="06" />
            <h3 className="mt-3 text-[18px] font-extrabold">שערי חניה</h3>
            <p className="card-body">פתיחה מהאפליקציה, קודי אורח, יומן.</p>
          </Card>

          <Card span="md:col-span-2" delay={300}>
            <CardEyebrow icon={FolderArchive} eyebrow="07" />
            <h3 className="mt-3 text-[18px] font-extrabold">כספת מסמכים</h3>
            <p className="card-body">ביטוחים, חוזים, תזכורות תפוגה אוטומטיות.</p>
          </Card>

          <Card span="md:col-span-4" delay={350}>
            <CardEyebrow icon={Megaphone} eyebrow="08" />
            <h3 className="mt-3 text-[18px] font-extrabold">לוח מודעות וסקרים</h3>
            <p className="card-body">
              הודעות עם טירגוט (בעלים בלבד / שוכרים), סקרי אסיפה עם
              חתימה דיגיטלית תואמת חוק חתימה אלקטרונית.
            </p>
          </Card>
        </div>

        <p className="mt-10 text-center text-[14px] text-[var(--ink-3)]">
          ועוד 12 מודולים — מסמכים, מס"ב, דוחות, הצבעות, אפליקציית דסקטופ, ו-API פתוח.{' '}
          <a href="#cta" className="link">דברו איתנו להדגמה ←</a>
        </p>
      </div>
    </section>
  );
}

function Card({
  span = '',
  big = false,
  delay = 0,
  children,
}: {
  span?: string;
  big?: boolean;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${span} card card-hover reveal p-6 md:p-7 ${big ? 'md:p-9' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function CardEyebrow({ icon: Icon, eyebrow }: { icon: any; eyebrow: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="grid h-9 w-9 place-items-center rounded-md"
        style={{ background: 'var(--bg-2)', color: 'var(--ink)' }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-[12px] font-bold tracking-wider" style={{ color: 'var(--brass)' }}>
        {eyebrow}
      </span>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="rounded-md border px-2.5 py-1 text-[11px] font-semibold text-[var(--ink-2)]"
      style={{ borderColor: 'var(--line)', background: 'var(--bg)' }}
    >
      {children}
    </span>
  );
}
