'use client';
import { useEffect, useRef, useState } from 'react';
import { CreditCard, Wrench, MessageCircle, FileCheck, DoorOpen } from 'lucide-react';
import { LivingBuilding, ZONE_LABELS, type Zone } from './LivingBuilding';

/**
 * Scroll-driven product story — v5's structural innovation. The same
 * Living Building from the hero returns here in `controlled` mode and
 * stays sticky while five chapters scroll past; each chapter lights up
 * its zone in the building. IntersectionObserver only — no scroll-jacking,
 * no libraries. On mobile the building is hidden and each chapter stands
 * alone as a card with its icon.
 */

const STEPS: {
  zone: Zone;
  icon: typeof CreditCard;
  title: string;
  body: string;
  bullets: string[];
}[] = [
  {
    zone: 'billing',
    icon: CreditCard,
    title: 'הכסף נכנס. לבד.',
    body:
      'חיוב אשראי אוטומטי בתחילת כל חודש, 1–12 תשלומים, וקבלה תואמת רשות המסים שנשלחת מעצמה. מי שמאחר מקבל תזכורות מדורגות — בלי שתרימו טלפון.',
    bullets: ['הוראת קבע בכרטיס אשראי', 'אסקלציית תזכורות למאחרים', 'חשבוניות במספור רציף'],
  },
  {
    zone: 'maintenance',
    icon: Wrench,
    title: 'תקלה נסגרת לפני שהיא הופכת לתלונה.',
    body:
      'הדייר מצלם, ה-AI מסווג ומנתב, והעובד מקבל משימה עם תמונה ומיקום מדויק. הדייר רואה סטטוס בזמן אמת — אתם רואים SLA.',
    bullets: ['דיווח מצולם מהאפליקציה', 'סיווג וניתוב אוטומטיים', 'מעקב SLA לכל פנייה'],
  },
  {
    zone: 'comms',
    icon: MessageCircle,
    title: 'הבוט עונה. אתם מנהלים.',
    body:
      'בוט WhatsApp בעברית מזהה את הדייר לפי הטלפון, מכיר את היתרה והחוזה שלו, ועונה 24/7. תלונה או שאלה משפטית? עוברת לנציג אנושי.',
    bullets: ['WhatsApp בעברית, 24/7', 'זיהוי דייר והקשר מלא', 'אסקלציה חכמה לאנושי'],
  },
  {
    zone: 'docs',
    icon: FileCheck,
    title: 'הניירת חתומה. ההחלטות מתועדות.',
    body:
      'הצבעות אסיפה עם חתימה דיגיטלית, פרוטוקולים מתויקים אוטומטית, וכספת מסמכי בניין עם תזכורות תפוגה לביטוח ולביקורות.',
    bullets: ['הצבעות בחתימה דיגיטלית', 'כספת מסמכים לכל בניין', 'תזכורות ביטוח ותקופתיות'],
  },
  {
    zone: 'access',
    icon: DoorOpen,
    title: 'גם השער מחובר.',
    body:
      'דיירים פותחים שער חניה מהאפליקציה, אורחים מקבלים קוד חד-פעמי, וכל פתיחה נרשמת ביומן. בלי שלטים שהולכים לאיבוד.',
    bullets: ['פתיחה מהאפליקציה', 'קודי אורח חד-פעמיים', 'יומן גישה מלא'],
  },
];

export function PlatformStory() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActive(idx);
          }
        }
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="story" className="section border-t" style={{ borderColor: 'var(--line)' }}>
      <div className="container">
        <div className="max-w-2xl">
          <div className="eyebrow">הפלטפורמה</div>
          <h2 className="display-2 mt-3">
            בניין אחד. חמש מערכות.
            <br />
            <span style={{ color: 'var(--brass)' }}>אפס ניירת.</span>
          </h2>
          <p className="lead mt-5">
            גללו — ותראו איך כל חלק של הבניין מדווח למסך אחד.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-8 lg:grid-cols-12 lg:gap-14">
          {/* Chapters (RTL: right column, reading start) */}
          <div className="lg:col-span-6">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === active;
              return (
                <div
                  key={s.zone}
                  data-idx={i}
                  data-active={isActive}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  className="story-step card mb-4 p-6 md:p-8 lg:mb-0 lg:rounded-none lg:border-x-0 lg:border-b lg:border-t-0 lg:bg-transparent lg:px-0 lg:py-16 lg:first:pt-6"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <div className="story-step-inner">
                    <div className="flex items-center gap-3">
                      <span
                        className="grid h-10 w-10 place-items-center rounded-xl"
                        style={{
                          background: isActive ? 'var(--ink)' : 'var(--bg-2)',
                          color: isActive ? 'var(--brass-3)' : 'var(--ink-3)',
                          transition: 'background-color 400ms, color 400ms',
                        }}
                      >
                        <Icon style={{ width: 18, height: 18 }} />
                      </span>
                      <span className="eyebrow-en tnum">
                        {String(i + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
                      </span>
                      <span className="text-[12px] font-bold" style={{ color: 'var(--brass)' }}>
                        {ZONE_LABELS[s.zone]}
                      </span>
                    </div>
                    <h3 className="display-3 mt-4 max-w-[22ch]">{s.title}</h3>
                    <p className="mt-3 max-w-[48ch] text-[15px] leading-[1.7] text-[var(--ink-3)]">{s.body}</p>
                    <ul className="mt-5 space-y-2 text-[14px] text-[var(--ink-2)]">
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5">
                          <span className="mt-[9px] inline-block h-1 w-1 shrink-0 rounded-full" style={{ background: 'var(--brass)' }} />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky building (desktop only) */}
          <div className="hidden lg:col-span-6 lg:block">
            <div className="sticky top-24">
              <div
                className="rounded-2xl border p-6"
                style={{
                  borderColor: 'var(--line)',
                  background: 'var(--bg-2)',
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(28,25,23,0.025) 1px, transparent 0)',
                  backgroundSize: '22px 22px',
                }}
              >
                <LivingBuilding mode="controlled" zone={STEPS[active].zone} />
              </div>
              <div className="mt-4 flex items-center justify-between px-1">
                <span className="text-[13px] font-bold" style={{ color: 'var(--ink)' }}>
                  {ZONE_LABELS[STEPS[active].zone]} · {STEPS[active].title}
                </span>
                <span className="eyebrow-en tnum">
                  {String(active + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
