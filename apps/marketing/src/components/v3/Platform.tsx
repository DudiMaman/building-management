/**
 * Platform breadth — bento grid (not hero). Per research, bento is
 * for "the breadth section, not the hero". Asymmetric cells, three
 * sized differently to break the rhythm.
 */
import { Wallet, MessageCircle, FileText, Wrench, Receipt, KeyRound, FolderArchive, Megaphone } from 'lucide-react';

export function Platform() {
  return (
    <section id="platform" className="section">
      <div className="container">
        {/* Section header */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-7">
            <div className="eyebrow-he">הפלטפורמה</div>
            <h2 className="display-2 mt-3 max-w-[20ch]">
              גבייה, אחזקה ותקשורת — במקום אחד.
            </h2>
          </div>
          <p className="lead lg:col-span-5">
            לא תוכנה. מערכת תפעול שלמה לחברות ניהול נדל"ן. כל מודול
            תוכנן יחד עם חברות ניהול ישראליות שעובדות במערכת היום.
          </p>
        </div>

        {/* Bento grid */}
        <div
          className="mt-12 grid gap-2.5 md:mt-14 md:grid-cols-3 md:gap-3"
        >
          {/* Big card — collection (the headline feature) */}
          <Card span="md:col-span-2 md:row-span-2" big>
            <CardHeader icon={Wallet} eyebrow="01 / גבייה אוטומטית">
              חיוב חודשי בכרטיס אשראי. 1–12 תשלומים.
            </CardHeader>
            <p className="mt-3 max-w-[42ch] text-[15px] leading-[1.6] text-[var(--ink-3)]">
              טוקן Tranzila מאובטח, ניסיון חוזר אוטומטי בכישלון,
              ואסקלציית תזכורות לפי שלבים — מיום שלישי באימייל ועד יום
              שלושים בסימון לטיפול משפטי. תומך במלוא 4 התרחישים של
              בעלים-שוכר-משלם.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Tag>Tranzila</Tag>
              <Tag>3DS2</Tag>
              <Tag>מס"ב</Tag>
              <Tag>1-12 תשלומים</Tag>
              <Tag>תזכורות חכמות</Tag>
            </div>
          </Card>

          <Card>
            <CardHeader icon={MessageCircle} eyebrow="02">
              בוט AI בעברית
            </CardHeader>
            <p className="card-body">
              עונה ב-WhatsApp תוך 8 שניות. מודע לדייר, לתפקיד וליתרה.
              מסלים לבן אדם כשצריך.
            </p>
          </Card>

          <Card>
            <CardHeader icon={FileText} eyebrow="03">
              חשבוניות רשות המסים
            </CardHeader>
            <p className="card-body">
              מספור רציף, מספר הקצאה ITA, ייצוא לחשבשבת / ריווחית /
              פריוריטי. בלי גיליונות אקסל.
            </p>
          </Card>

          <Card>
            <CardHeader icon={Wrench} eyebrow="04">
              פניות שירות
            </CardHeader>
            <p className="card-body">
              מהאפליקציה, מ-WhatsApp או טלפון. סיווג אוטומטי לפי AI,
              מעקב SLA, ניתוב לאיש האחזקה.
            </p>
          </Card>

          <Card>
            <CardHeader icon={Receipt} eyebrow="05">
              צ׳קים דחויים וחוזרים
            </CardHeader>
            <p className="card-body">
              סריקה במצלמה, אצוות הפקדה, טיפול בצ׳ק חוזר ב-2 קליקים
              עם תיק להעברה לעורך דין.
            </p>
          </Card>

          <Card>
            <CardHeader icon={KeyRound} eyebrow="06">
              שערי חניה
            </CardHeader>
            <p className="card-body">
              פתיחה מהאפליקציה, קודי אורח חד-פעמיים, יומן גישה מלא.
            </p>
          </Card>

          <Card>
            <CardHeader icon={FolderArchive} eyebrow="07">
              מסמכי הבניין
            </CardHeader>
            <p className="card-body">
              ביטוחים, חוזים, אישורי תקינות — כספת אחת לכל בניין,
              עם תזכורות תפוגה אוטומטיות.
            </p>
          </Card>

          <Card>
            <CardHeader icon={Megaphone} eyebrow="08">
              לוח מודעות וסקרים
            </CardHeader>
            <p className="card-body">
              הודעות בעברית עם טירגוט (בעלים בלבד / שוכרים), סקרי
              אסיפה עם חתימה דיגיטלית.
            </p>
          </Card>
        </div>

        {/* Footnote */}
        <p className="mt-8 text-center text-[13px] text-[var(--ink-3)] md:mt-10">
          ועוד 12 מודולים: ספקים, מס"ב, דוחות, הצבעות, אפליקציית דסקטופ למקצוענים, ו-API פתוח.{' '}
          <a href="#all" className="link">לרשימה המלאה ←</a>
        </p>
      </div>
    </section>
  );
}

function Card({
  children,
  span = '',
  big = false,
}: {
  children: React.ReactNode;
  span?: string;
  big?: boolean;
}) {
  return (
    <div
      className={`${span} rounded-lg border p-6 transition-colors hover:border-[var(--line-strong)] md:p-7 ${
        big ? 'md:p-8' : ''
      }`}
      style={{ background: 'var(--paper)', borderColor: 'var(--line)' }}
    >
      {children}
    </div>
  );
}

function CardHeader({
  icon: Icon,
  eyebrow,
  children,
}: {
  icon: any;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2.5">
        <span
          className="grid h-9 w-9 place-items-center rounded-md"
          style={{ background: 'var(--bg-2)', color: 'var(--ink)' }}
        >
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-[12px] font-bold text-[var(--brass)]">{eyebrow}</span>
      </div>
      <h3 className="mt-4 text-[18px] font-bold leading-snug md:text-[19px]">{children}</h3>
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

