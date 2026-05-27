import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Calendar, ArrowLeft } from 'lucide-react';
import { posts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'בלוג — ניהול מבנים',
  description: 'מאמרים על ניהול ועד בית, גבייה, ואסטרטגיה בעולם ניהול הנכסים.',
};

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
                  <h2 className="mt-3 text-xl font-bold leading-snug">
                    <Link href={`/blog/${p.slug}`} className="hover:text-primary">
                      {p.title}
                    </Link>
                  </h2>
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
              עוד מאמרים בקרוב. דברו איתנו ב-
              <Link href="/contact" className="text-primary hover:underline">צור קשר</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
