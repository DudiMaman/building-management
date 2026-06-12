import Link from 'next/link';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Slim footer — brand + contact, two nav columns, legal line. */
export function Footer() {
  return (
    <footer style={{ background: 'var(--bg-2)' }}>
      <div className="container py-12 md:py-16">
        <div className="grid gap-10 border-b pb-10 md:grid-cols-12" style={{ borderColor: 'var(--line-2)' }}>
          <div className="md:col-span-6">
            <Link href="/v5" aria-label="Pulse — דף הבית" className="inline-flex">
              <img src={`${BASE}/v5/pulse-logo.svg`} alt="Pulse" width={144} height={48} className="h-10 w-auto" />
            </Link>
            <p className="mt-4 max-w-sm text-[14px] leading-[1.65] text-[var(--ink-3)]">
              מערכת התפעול לחברות ניהול נדל"ן ולוועדי בית בישראל.
            </p>
            <div className="mt-5 space-y-1.5 text-[14px]">
              <a className="link block w-fit" href="mailto:hello@pulse.co.il">
                hello@pulse.co.il
              </a>
              <a className="block w-fit text-[var(--ink-2)]" href="tel:+97231234567">
                <span className="ltr">03-1234567</span>
              </a>
            </div>
          </div>

          <FooterCol
            title="פלטפורמה"
            links={[
              ['הפלטפורמה', '#story'],
              ['תמחור', '#pricing'],
              ['שאלות נפוצות', '#faq'],
              ['התחברות', '/login'],
            ]}
          />
          <FooterCol
            title="חברה"
            links={[
              ['אודות', '/about'],
              ['בלוג', '/blog'],
              ['יצירת קשר', '#cta'],
            ]}
          />
        </div>

        {/* Photo attributions — required by CC BY-SA. Hosted here instead
            of next to each image to keep the visual sections clean. */}
        <p className="pt-6 text-[11px] leading-[1.7] text-[var(--ink-3)]">
          קרדיטים לצילומים (מעובדים):{' '}
          <a
            href="https://commons.wikimedia.org/wiki/File:Yoo_Towers_03.jpg"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-2 hover:underline"
          >
            Ynhockey
          </a>
          {' · '}
          <a
            href="https://commons.wikimedia.org/wiki/File:Dripping_faucet_1.jpg"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-2 hover:underline"
          >
            Dschwen
          </a>
          {' · '}
          <a
            href="https://commons.wikimedia.org/wiki/File:Closed_parking_lot_boom_barrier.jpg"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-2 hover:underline"
          >
            Epolk
          </a>
          {' '}· Wikimedia Commons · CC BY-SA
        </p>

        <div className="flex flex-col gap-3 pt-4 text-[12px] text-[var(--ink-3)] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} Pulse בע"מ.</span>
            <Link href="/legal/terms" className="hover:text-[var(--ink)]">
              תנאי שימוש
            </Link>
            <Link href="/legal/privacy" className="hover:text-[var(--ink)]">
              פרטיות
            </Link>
          </div>
          <span className="eyebrow-en">EU-WEST · GDPR · IL PRIVACY 1981</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div className="md:col-span-3">
      <div className="text-[12px] font-extrabold uppercase tracking-wider text-[var(--ink)]">{title}</div>
      <ul className="mt-3 space-y-2.5 text-[14px] text-[var(--ink-2)]">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="hover:text-[var(--ink)]">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
