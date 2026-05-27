import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Calendar, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'בלוג — ניהול מבנים',
  description: 'מאמרים על ניהול ועד בית, גבייה, ואסטרטגיה בעולם ניהול הנכסים.',
};

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
}

const posts: Post[] = [
  {
    slug: 'how-to-improve-collection-rate',
    title: 'איך לשפר את אחוז הגבייה ב-12% בחצי שנה',
    excerpt:
      'המדריך המעשי לחברות ניהול — אסטרטגיות תזכורת, אסקלציה אוטומטית, ואיך לטפל בדיירים בעייתיים בלי לאבד אותם.',
    date: '15 במאי 2026',
    readTime: '7 דק׳',
    category: 'גבייה',
  },
  {
    slug: 'bounced-check-workflow',
    title: 'צ׳ק חוזר? המדריך המלא לטיפול אוטומטי',
    excerpt:
      'מה החוק אומר, איך להוציא תיק לעורך דין ב-2 קליקים, ולמה רוב חברות הניהול מאבדות 8% מהגבייה בגלל טיפול ידני.',
    date: '8 במאי 2026',
    readTime: '5 דק׳',
    category: 'פיננסים',
  },
  {
    slug: 'whatsapp-bot-customer-service',
    title: 'בוט WhatsApp לחברת ניהול: יתרונות וחסרונות',
    excerpt:
      'איך בוט AI יכול לטפל ב-80% מהשאלות של הדיירים, מתי כדאי להסלים לבן אדם, ואיך בונים סקריפט שעובד בעברית.',
    date: '1 במאי 2026',
    readTime: '6 דק׳',
    category: 'טכנולוגיה',
  },
  {
    slug: 'rental-vaad-responsibility',
    title: 'שוכר מול בעלים: מי משלם את הוועד באמת?',
    excerpt:
      'מבט על הדין הישראלי, על מה שכתוב בחוזה השכירות, ואיך לעצב מערכת ניהול שלא קורסת מול תרחישי חיים מורכבים.',
    date: '22 באפריל 2026',
    readTime: '8 דק׳',
    category: 'משפט',
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50">
        <section className="px-6 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold md:text-5xl">בלוג</h1>
              <p className="mx-auto mt-3 max-w-2xl text-slate-600">
                מאמרים על ניהול ועד בית, גבייה, אסטרטגיה ופיתוח עסקי.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {posts.map((p) => (
                <article
                  key={p.slug}
                  className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-primary-200 hover:shadow-lg"
                >
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="rounded-full bg-primary-50 px-2.5 py-0.5 font-medium text-primary-700">
                      {p.category}
                    </span>
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{p.date}</span>
                    <span>·</span>
                    <span>{p.readTime}</span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold leading-snug">{p.title}</h2>
                  <p className="mt-2 text-slate-600">{p.excerpt}</p>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline"
                  >
                    לקריאה
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>

            <p className="mt-12 text-center text-sm text-slate-500">
              עוד מאמרים בקרוב. הירשמו לעדכונים ב-
              <Link href="/contact" className="text-primary hover:underline">צור קשר</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
