import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[70vh] items-center bg-gradient-to-b from-white to-slate-50 px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <div className="text-7xl font-black text-primary">404</div>
          <h1 className="mt-4 text-3xl font-bold">העמוד לא נמצא</h1>
          <p className="mt-3 text-slate-600">
            הכתובת שביקשתם לא קיימת, או שהדף הועבר. נסו לחזור לדף הבית או לפנות אלינו.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Home className="h-4 w-4" />
              חזרה לדף הבית
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium hover:bg-slate-50"
            >
              צרו קשר
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
