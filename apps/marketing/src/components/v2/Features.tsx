/**
 * Bento-style features grid — asymmetric cells, each with a small
 * technical-illustration glyph instead of a generic icon. The grid is
 * 6×4 on lg, with three "wide" cells to break the monotony of equal
 * cards. Keeps to two materials: cream paper + thin navy lines.
 */
export function FeaturesV2() {
  return (
    <section id="platform" className="border-b border-[var(--ink-line)]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="mb-14 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="label text-[var(--brass)]">PLATFORM</span>
            <h2 className="serif mt-3 text-4xl leading-tight md:text-5xl">
              כל מה שצריך לנהל בניין —
              <br />
              <span className="italic text-[var(--ink-soft)]">בלי לפתוח 7 כרטיסיות.</span>
            </h2>
          </div>
          <p className="max-w-md text-base text-[var(--ink-soft)] lg:col-span-5">
            בנינו כל מודול מתוך עבודה צמודה עם חברות ניהול ישראליות —
            לא העתקה של פתרון אמריקאי. כולל מודלים מקומיים: בעלים-שוכר-משלם,
            רשות המסים, מס&quot;ב, צ&apos;קים דחויים, ואסיפת ועד דיגיטלית.
          </p>
        </div>

        {/* Bento grid: 6 columns × 4 rows on lg */}
        <div className="grid grid-cols-1 gap-px border border-[var(--ink-line)] bg-[var(--ink-line)] sm:grid-cols-2 lg:grid-cols-6 lg:grid-rows-[auto_auto]">
          {/* Billing — wide */}
          <Card span="lg:col-span-3 lg:row-span-2" eyebrow="01 / גבייה" title="גביה אוטומטית בכרטיס אשראי">
            <p className="text-sm text-[var(--ink-soft)]">
              הוראת קבע על טוקן Tranzila. 1–12 תשלומים, ניסיון חוזר אוטומטי
              בכישלון, אסקלציית תזכורות לפי שלבים. תומך מודל שוכר-משלם עם
              קופי חובה לבעלים.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <Tag>Tranzila</Tag>
              <Tag>3DS2</Tag>
              <Tag>מס&quot;ב</Tag>
              <Tag>1-12 תשלומים</Tag>
              <Tag>אסקלציה</Tag>
            </div>
            <div className="mt-8 border-t border-[var(--ink-line)] pt-6">
              <CreditCardGlyph />
            </div>
          </Card>

          {/* AI bot */}
          <Card span="lg:col-span-3" eyebrow="02 / AI" title="בוט עברית 24/7">
            <p className="text-sm text-[var(--ink-soft)]">
              Claude (Anthropic). מזהה את הדייר לפי טלפון, יודע יתרה,
              פותח קריאות, מסלים לבן אדם. עונה ל-80% מהפניות לבד.
            </p>
          </Card>

          {/* Invoices */}
          <Card span="lg:col-span-3" eyebrow="03 / רשות המסים" title="חשבוניות וקבלות דיגיטליות">
            <p className="text-sm text-[var(--ink-soft)]">
              מספור רציף ללא דילוגים, מספר הקצאה ITA, חשבונית זיכוי
              בלחיצה. ייצוא לחשבשבת / ריווחית / פריוריטי.
            </p>
          </Card>

          {/* Tickets */}
          <Card span="lg:col-span-2" eyebrow="04" title="פניות שירות">
            <p className="text-sm text-[var(--ink-soft)]">
              מ-WhatsApp ומהאפליקציה. סיווג אוטומטי, מעקב SLA.
            </p>
          </Card>

          {/* Checks */}
          <Card span="lg:col-span-2" eyebrow="05" title="צ׳קים דחויים וחוזרים">
            <p className="text-sm text-[var(--ink-soft)]">
              סריקה במצלמה, אצוות הפקדה, טיפול בחזרה ב-2 קליקים.
            </p>
          </Card>

          {/* Gate */}
          <Card span="lg:col-span-2" eyebrow="06" title="שערי חניה">
            <p className="text-sm text-[var(--ink-soft)]">
              פתיחה מהאפליקציה. קודי אורח, יומן גישה מלא.
            </p>
          </Card>
        </div>

        {/* Footer rule with smaller modules */}
        <div className="mt-px grid gap-px border-x border-b border-[var(--ink-line)] bg-[var(--ink-line)] sm:grid-cols-2 lg:grid-cols-4">
          <Mini title="מסמכים" body="כספת לבניין עם תזכורות תפוגה" />
          <Mini title="ועד דיגיטלי" body="סקרים והצבעות עם חתימה" />
          <Mini title="מס&quot;ב" body="ייצוא לתשלום ספקים" />
          <Mini title="פלייר QR" body="קליטה מיידית של דיירים חדשים" />
        </div>
      </div>
    </section>
  );
}

function Card({
  span,
  eyebrow,
  title,
  children,
}: {
  span: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`${span} bg-[var(--paper)] p-7 lg:p-9`}>
      <div className="label text-[var(--ink-soft)]">{eyebrow}</div>
      <h3 className="serif mt-3 text-2xl leading-snug">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Mini({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-[var(--paper)] p-6">
      <h4 className="text-sm font-semibold text-[var(--ink)]">{title}</h4>
      <p className="mt-1 text-xs text-[var(--ink-soft)]">{body}</p>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-[var(--ink-line)] px-2.5 py-1 text-[10px] tracking-wider text-[var(--ink-soft)]">
      {children}
    </span>
  );
}

/** Stylized credit-card line drawing — sits in the Billing card. */
function CreditCardGlyph() {
  return (
    <svg viewBox="0 0 240 140" className="h-auto w-full" aria-hidden>
      <rect x="2" y="2" width="236" height="136" fill="none" stroke="#0b1623" strokeWidth="1.2" />
      <rect x="14" y="36" width="60" height="34" fill="#e8dccb" stroke="#0b1623" strokeWidth="0.8" />
      <line x1="14" y1="92" x2="158" y2="92" stroke="#0b1623" strokeWidth="1" />
      <line x1="14" y1="102" x2="100" y2="102" stroke="#0b1623" strokeWidth="0.6" />
      <line x1="14" y1="112" x2="60" y2="112" stroke="#0b1623" strokeWidth="0.6" />
      <text x="184" y="32" fontFamily="'IBM Plex Sans', monospace" fontSize="9" fill="#0b1623" textAnchor="end" letterSpacing="0.1em">
        TRANZILA · ILS
      </text>
      <text x="184" y="118" fontFamily="'IBM Plex Sans', monospace" fontSize="9" fill="#0b1623" textAnchor="end" letterSpacing="0.1em">
        12/29
      </text>
      <circle cx="206" cy="56" r="14" fill="none" stroke="#b08850" strokeWidth="1.2" />
      <circle cx="222" cy="56" r="14" fill="none" stroke="#b08850" strokeWidth="1.2" />
    </svg>
  );
}
