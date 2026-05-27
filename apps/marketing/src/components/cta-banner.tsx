import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';

export function CtaBanner() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-primary-700 via-primary-600 to-indigo-600 px-8 py-16 text-white shadow-2xl shadow-primary-200">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur">
            <Sparkles className="h-4 w-4" />
            30 יום ניסיון, ללא כרטיס אשראי
          </span>
          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            מוכנים להפסיק לרדוף אחרי תזכורות?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
            הצטרפו לחברות ניהול שעברו לפלטפורמה ושיפרו אחוזי גבייה ב-12% בממוצע
            בחצי שנה.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-base font-semibold text-primary-700 shadow-lg transition hover:bg-slate-50"
            >
              התחילו ניסיון חינם
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/40 bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              קבעו הדגמה
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
