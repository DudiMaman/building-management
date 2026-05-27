import Link from 'next/link';
import { Building, Mail, Phone, MapPin } from 'lucide-react';
import { Newsletter } from './newsletter';

export function Footer() {
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL ?? 'http://localhost:3001/login';

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
                <Building className="h-4 w-4" />
              </span>
              ניהול מבנים
            </Link>
            <p className="mt-4 max-w-sm text-sm text-slate-600">
              פלטפורמת CRM מודרנית לחברות ניהול ואחזקת מבנים בישראל.
              גבייה אוטומטית, פניות שירות, וואטסאפ ובוט AI — הכל בעברית.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-600" />
                <a href="mailto:hello@building-management.co.il" className="hover:text-primary">
                  hello@building-management.co.il
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-600" />
                <a href="tel:+97231234567" className="hover:text-primary">03-1234567</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-600" />
                <span>תל אביב-יפו, ישראל</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">מוצר</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/#features" className="hover:text-primary">פיצ׳רים</Link></li>
              <li><Link href="/#pricing" className="hover:text-primary">מחירים</Link></li>
              <li><Link href="/#who" className="hover:text-primary">למי זה מתאים</Link></li>
              <li><Link href="/contact" className="hover:text-primary">הדגמה</Link></li>
              <li><Link href={adminUrl} className="hover:text-primary">התחברות</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">חברה</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/blog" className="hover:text-primary">בלוג</Link></li>
              <li><Link href="/contact" className="hover:text-primary">צור קשר</Link></li>
              <li><Link href="/contact" className="hover:text-primary">קריירה</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">משפטי</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/legal/terms" className="hover:text-primary">תנאי שימוש</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-primary">מדיניות פרטיות</Link></li>
              <li><Link href="/legal/dpa" className="hover:text-primary">DPA</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 grid gap-6 rounded-2xl bg-slate-50 p-6 md:grid-cols-2 md:items-center md:gap-12">
          <div>
            <h4 className="text-lg font-semibold">קבלו עדכונים</h4>
            <p className="mt-1 text-sm text-slate-600">
              מאמרים על ניהול ועד בית, גבייה ואסטרטגיה — אחת לחודש, בלי SPAM.
            </p>
          </div>
          <Newsletter />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ניהול מבנים. כל הזכויות שמורות.</p>
          <div className="flex gap-4">
            <span>נתונים ב-EU-West (GDPR + חוק הגנת הפרטיות התשמ"א-1981)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
