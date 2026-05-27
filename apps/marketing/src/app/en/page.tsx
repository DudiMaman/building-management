import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Wallet, Wrench, MessageCircle, Bot, FileText, Receipt } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Building Management — Israeli HOA SaaS',
  description:
    'One platform for the management company, residents, owners, and maintenance staff. Automated billing, service tickets, WhatsApp, AI bot.',
  alternates: { canonical: '/en' },
};

const features = [
  { icon: Wallet, title: 'Recurring collection', body: 'Card on file, installments up to 12, ILS-native.' },
  { icon: Wrench, title: 'Service tickets', body: 'Auto-classified, photo uploads, SLA tracking.' },
  { icon: MessageCircle, title: 'WhatsApp inbox', body: 'Native Business Cloud API integration.' },
  { icon: Bot, title: 'AI bot 24/7', body: 'Claude-powered Hebrew customer service.' },
  { icon: FileText, title: 'Tax-compliant invoices', body: 'ITA e-invoicing, gap-free serials, credit notes.' },
  { icon: Receipt, title: 'Check management', body: 'Post-dated, deposit batches, bounced workflow.' },
];

export default function EnHome() {
  return (
    <div lang="en" dir="ltr" className="bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/en" className="text-xl font-bold text-primary">
            Building Management
          </Link>
          <nav className="hidden gap-6 text-sm text-slate-700 md:flex">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <Link href="/">עברית</Link>
          </nav>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Start free
          </Link>
        </div>
      </header>

      <main>
        <section className="px-6 py-20 md:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Israeli HOA management,{' '}
              <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">
                without the headache
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 md:text-xl">
              One platform for the management company, residents, owners, and maintenance staff.
              Hebrew-first, tax-compliant, WhatsApp + AI native.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-medium text-white shadow-lg shadow-primary-300/30 hover:bg-primary-700"
              >
                Start free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="rounded-lg border border-slate-300 bg-white px-8 py-4 text-base font-medium hover:bg-slate-50"
              >
                Book a demo
              </Link>
            </div>
            <p className="mt-6 text-sm text-slate-500">
              30-day trial · no credit card · 10-minute setup
            </p>
          </div>
        </section>

        <section id="features" className="bg-slate-50 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-4xl font-bold">Everything a management company needs</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-primary-200 hover:shadow-lg"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl font-bold">Pricing</h2>
            <p className="mt-3 text-slate-600">
              Starter ₪399/mo · Pro ₪1,290/mo · Enterprise — contact us.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/pricing"
                className="rounded-lg bg-primary px-6 py-3 font-medium text-white hover:bg-primary-700"
              >
                See full pricing →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-6 py-10 text-center text-sm text-slate-500">
        <p>© {new Date().getFullYear()} Building Management. All rights reserved.</p>
        <p className="mt-2">
          <Link href="/" className="text-primary hover:underline">עברית</Link>
          {' · '}
          <Link href="/legal/terms" className="hover:text-primary">Terms</Link>
          {' · '}
          <Link href="/legal/privacy" className="hover:text-primary">Privacy</Link>
        </p>
      </footer>
    </div>
  );
}
