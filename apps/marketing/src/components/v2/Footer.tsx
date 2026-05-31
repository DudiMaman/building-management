import Link from 'next/link';

export function FooterV2() {
  return (
    <footer className="bg-[var(--paper)]">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-10 lg:px-10">
        <div className="grid gap-10 border-b border-[var(--ink-line)] pb-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center bg-[var(--ink)] text-[var(--paper)]">
                <span className="serif text-lg leading-none">נ</span>
              </span>
              <span className="serif text-xl tracking-tight">ניהול מבנים</span>
            </div>
            <p className="mt-5 max-w-md text-sm text-[var(--ink-soft)]">
              פלטפורמת ה-CRM לחברות ניהול ואחזקת מבנים בישראל. נדל"ן,
              חשבונאות, תקשורת ושירות — מאוחדים תחת מערכת אחת.
            </p>
            <div className="mt-6 space-y-1 text-sm">
              <div>
                <a className="link text-[var(--ink)]" href="mailto:hello@building-management.co.il">
                  hello@building-management.co.il
                </a>
              </div>
              <div className="text-[var(--ink-soft)]">03-1234567 · תל אביב-יפו</div>
            </div>
          </div>

          <FooterCol title="פלטפורמה" links={[
            { label: 'הפיצ׳רים', href: '#platform' },
            { label: 'איך זה עובד', href: '#how' },
            { label: 'מחירים', href: '#pricing' },
            { label: 'לקוחות', href: '#proof' },
          ]} />

          <FooterCol title="חברה" links={[
            { label: 'אודות', href: '/about' },
            { label: 'בלוג', href: '/blog' },
            { label: 'קריירה', href: '/careers' },
            { label: 'יצירת קשר', href: '/contact' },
          ]} />

          <FooterCol title="משפטי" links={[
            { label: 'תנאי שימוש', href: '/legal/terms' },
            { label: 'מדיניות פרטיות', href: '/legal/privacy' },
            { label: 'DPA', href: '/legal/dpa' },
          ]} />
        </div>

        <div className="flex flex-col gap-3 pt-6 text-xs text-[var(--ink-soft)] sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} ניהול מבנים בע&quot;מ.</span>
          <span className="label">EU-WEST · GDPR · IL PRIVACY 1981</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="lg:col-span-2">
      <div className="label mb-3 text-[var(--ink)]">{title}</div>
      <ul className="space-y-2 text-sm text-[var(--ink-soft)]">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="hover:text-[var(--ink)]">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
