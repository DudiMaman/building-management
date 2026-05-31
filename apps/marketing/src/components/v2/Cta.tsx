import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function CtaV2() {
  return (
    <section className="border-b border-[var(--ink-line)] bg-[var(--ink)] text-[var(--paper)]">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <span className="label text-[var(--brass-soft)]">DEMO</span>
            <h2 className="serif mt-3 text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              נראה לכם את המערכת על
              <br />
              <span className="italic text-[var(--brass-soft)]">הבניינים שלכם.</span>
            </h2>
          </div>

          <div className="lg:col-span-4">
            <p className="text-base text-[var(--paper-2)]">
              שיחה קצרה של 25 דקות. אנחנו לוקחים את הרשימה שלכם, מטעינים
              דירות אמיתיות, ומראים איך הגבייה והפניות יעבדו אצלכם —
              לא דמו גנרי.
            </p>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-between border border-[var(--paper)] bg-[var(--paper)] px-6 py-4 text-[var(--ink)] hover:bg-transparent hover:text-[var(--paper)]"
              >
                <span className="font-medium">תיאום הדגמה</span>
                <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-between border border-[var(--ink-soft)] px-6 py-4 text-[var(--paper)] hover:border-[var(--paper)]"
              >
                <span className="font-medium">לניסיון חינם 30 יום</span>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
