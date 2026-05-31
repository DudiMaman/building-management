import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ background: 'var(--bg)' }}>
      <div className="container py-12 md:py-16">
        <div
          className="grid gap-10 border-b pb-10 md:grid-cols-12 md:pb-12"
          style={{ borderColor: 'var(--line)' }}
        >
          <div className="md:col-span-5">
            <Link href="/v3" className="flex items-center gap-2.5">
              <span
                className="grid h-9 w-9 place-items-center rounded-md text-base font-bold"
                style={{ background: 'var(--ink)', color: 'var(--paper)' }}
              >
                נ
              </span>
              <span className="text-[17px] font-bold">ניהול מבנים</span>
            </Link>
            <p className="mt-5 max-w-md text-[14px] leading-[1.6] text-[var(--ink-3)]">
              מערכת תפעול לחברות ניהול נדל"ן ולוועדי בית בישראל. גבייה,
              אחזקה ותקשורת — במקום אחד.
            </p>

            <div className="mt-6 space-y-2 text-[14px]">
              <a className="link block" href="mailto:hello@building-management.co.il">
                hello@building-management.co.il
              </a>
              <a className="block ltr" href="tel:+97231234567">
                <span className="text-[var(--ink-2)]">03-1234567</span>
              </a>
              <div className="text-[var(--ink-3)]">תל אביב-יפו</div>
            </div>
          </div>

          <FooterCol
            title="פלטפורמה"
            links={[
              { label: 'הפיצ׳רים', href: '#platform' },
              { label: 'איך זה עובד', href: '#how' },
              { label: 'תמחור', href: '#pricing' },
              { label: 'לקוחות', href: '#proof' },
            ]}
          />

          <FooterCol
            title="חברה"
            links={[
              { label: 'אודות', href: '/about' },
              { label: 'בלוג', href: '/blog' },
              { label: 'יצירת קשר', href: '#cta' },
            ]}
          />

          <FooterCol
            title="משפטי"
            links={[
              { label: 'תנאי שימוש', href: '/legal/terms' },
              { label: 'מדיניות פרטיות', href: '/legal/privacy' },
              { label: 'DPA', href: '/legal/dpa' },
            ]}
          />
        </div>

        <div
          className="flex flex-col gap-3 pt-6 text-[12px] text-[var(--ink-3)] sm:flex-row sm:items-center sm:justify-between"
        >
          <span>© {new Date().getFullYear()} ניהול מבנים בע"מ.</span>
          <span className="eyebrow-en">EU-WEST · GDPR · IL PRIVACY 1981</span>
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
    <div className="md:col-span-2">
      <div className="text-[12px] font-bold tracking-wider text-[var(--ink)] uppercase">
        {title}
      </div>
      <ul className="mt-3 space-y-2.5 text-[14px] text-[var(--ink-2)]">
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
