import Link from 'next/link';

export function Footer() {
  return (
    <footer style={{ background: 'var(--bg-2)' }}>
      <div className="container py-14 md:py-20">
        <div
          className="grid gap-10 border-b pb-12 md:grid-cols-12"
          style={{ borderColor: 'var(--line-2)' }}
        >
          <div className="md:col-span-5">
            <Link href="/v4" className="flex items-center gap-2.5">
              <span
                className="relative grid h-10 w-10 place-items-center rounded-[8px]"
                style={{ background: 'var(--ink)' }}
              >
                <span style={{ color: 'var(--paper)' }} className="text-base font-extrabold">
                  נ
                </span>
                <span
                  className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full"
                  style={{ background: 'var(--brass)' }}
                />
              </span>
              <span className="text-[18px] font-extrabold tracking-tight">ניהול מבנים</span>
            </Link>
            <p className="mt-5 max-w-md text-[14px] leading-[1.65] text-[var(--ink-3)]">
              מערכת תפעול לחברות ניהול נדל"ן ולוועדי בית בישראל. גבייה,
              אחזקה, ותקשורת — במקום אחד.
            </p>

            <div className="mt-6 space-y-2 text-[14px]">
              <a className="link block" href="mailto:hello@building-management.co.il">
                hello@building-management.co.il
              </a>
              <a className="block ltr" href="tel:+97231234567">
                <span className="text-[var(--ink-2)]">03-1234567</span>
              </a>
              <div className="text-[var(--ink-3)]">דרך מנחם בגין 132, תל אביב-יפו</div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {['PCI SAQ-A', 'GDPR', 'IL Privacy 1981', 'ISO 27001'].map((tag) => (
                <span
                  key={tag}
                  className="eyebrow-en rounded-full border px-2.5 py-1"
                  style={{ borderColor: 'var(--line-2)', color: 'var(--ink-3)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <FooterCol
            title="פלטפורמה"
            links={[
              { label: 'הפיצ׳רים', href: '#platform' },
              { label: 'איך זה עובד', href: '#how' },
              { label: 'תמחור', href: '#pricing' },
              { label: 'לקוחות', href: '#proof' },
              { label: 'אבטחה', href: '/security' },
            ]}
          />

          <FooterCol
            title="פתרונות"
            links={[
              { label: 'חברות ניהול', href: '#hero' },
              { label: 'ועדי בית', href: '#hero' },
              { label: 'בעלי דירות', href: '#hero' },
              { label: 'דיירים ושוכרים', href: '#hero' },
            ]}
          />

          <FooterCol
            title="חברה"
            links={[
              { label: 'אודות', href: '/about' },
              { label: 'בלוג', href: '/blog' },
              { label: 'דרושים', href: '/careers' },
              { label: 'יצירת קשר', href: '#cta' },
            ]}
          />
        </div>

        <div className="grid gap-4 pt-6 text-[12px] text-[var(--ink-3)] md:grid-cols-2 md:items-center">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>© {new Date().getFullYear()} ניהול מבנים בע"מ.</span>
            <Link href="/legal/terms" className="hover:text-[var(--ink)]">תנאי שימוש</Link>
            <Link href="/legal/privacy" className="hover:text-[var(--ink)]">מדיניות פרטיות</Link>
            <Link href="/legal/dpa" className="hover:text-[var(--ink)]">DPA</Link>
          </div>
          <div className="md:text-end">
            <span className="eyebrow-en">EU-WEST · MADE IN TEL AVIV</span>
          </div>
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
      <div className="text-[12px] font-extrabold tracking-wider text-[var(--ink)] uppercase">
        {title}
      </div>
      <ul className="mt-3 space-y-2.5 text-[14px] text-[var(--ink-2)]">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="hover:text-[var(--ink)]">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
