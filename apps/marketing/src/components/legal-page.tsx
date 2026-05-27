import type { ReactNode } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <article className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-slate-500">עודכן לאחרונה: {updated}</p>
          <div className="prose prose-slate mt-8 max-w-none leading-relaxed text-slate-700 [&>h2]:mt-10 [&>h2]:mb-3 [&>h2]:text-2xl [&>h2]:font-bold [&>h3]:mt-6 [&>h3]:mb-2 [&>h3]:text-lg [&>h3]:font-semibold [&>p]:mt-3 [&>ul]:mt-3 [&>ul]:list-disc [&>ul]:pr-6 [&>li]:mt-1">
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
