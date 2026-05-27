import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CtaBanner } from '@/components/cta-banner';
import { findPost, posts } from '@/lib/posts';

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = findPost(params.slug);
  if (!post) return { title: 'מאמר לא נמצא' };
  return {
    title: `${post.title} — בלוג ניהול מבנים`,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      publishedTime: post.isoDate,
    },
  };
}

export default function BlogPostPage({ params }: Params) {
  const post = findPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        <article className="mx-auto max-w-3xl px-6 pt-16 pb-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            חזרה לכל המאמרים
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="rounded-full bg-primary-50 px-3 py-1 font-medium text-primary-700">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-slate-600">{post.excerpt}</p>

          <div className="prose prose-slate mt-10 max-w-none text-lg leading-relaxed text-slate-800">
            <PostBody body={post.body} />
          </div>
        </article>

        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <h2 className="text-2xl font-bold">מאמרים נוספים</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {posts
                .filter((p) => p.slug !== post.slug)
                .slice(0, 4)
                .map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="group block rounded-xl border border-slate-200 bg-white p-4 hover:border-primary-200 hover:shadow-md"
                    >
                      <div className="text-xs text-slate-500">{p.category}</div>
                      <div className="mt-1 font-semibold group-hover:text-primary">{p.title}</div>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </section>

        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}

/**
 * Minimal markdown-ish renderer — just enough for our hand-written posts.
 * Supports: ## h2, ### h3, **bold**, lists starting with "- ", and paragraphs.
 * Keeping it dependency-free since the post set is tiny; we'll swap to MDX
 * when the content team takes over.
 */
function PostBody({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/);
  return (
    <>
      {blocks.map((block, i) => {
        if (block.startsWith('## ')) {
          return (
            <h2 key={i} className="mt-10 mb-3 text-2xl font-bold text-slate-900">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith('### ')) {
          return (
            <h3 key={i} className="mt-6 mb-2 text-xl font-semibold text-slate-900">
              {block.slice(4)}
            </h3>
          );
        }
        if (block.startsWith('- ')) {
          const items = block.split('\n').map((line) => line.replace(/^- /, ''));
          return (
            <ul key={i} className="mt-3 list-disc pr-6 text-slate-700">
              {items.map((it, j) => (
                <li key={j} className="mt-1">
                  {renderInline(it)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="mt-3 text-slate-700">
            {renderInline(block)}
          </p>
        );
      })}
    </>
  );
}

function renderInline(text: string) {
  // Split by **bold** and `code` markers.
  const parts: Array<{ kind: 'text' | 'bold' | 'code'; value: string }> = [];
  const regex = /(\*\*([^*]+)\*\*)|(`([^`]+)`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ kind: 'text', value: text.slice(lastIndex, match.index) });
    }
    if (match[2] !== undefined) parts.push({ kind: 'bold', value: match[2]! });
    if (match[4] !== undefined) parts.push({ kind: 'code', value: match[4]! });
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) parts.push({ kind: 'text', value: text.slice(lastIndex) });
  return parts.map((p, i) => {
    if (p.kind === 'bold') return <strong key={i}>{p.value}</strong>;
    if (p.kind === 'code')
      return (
        <code key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
          {p.value}
        </code>
      );
    return <span key={i}>{p.value}</span>;
  });
}
