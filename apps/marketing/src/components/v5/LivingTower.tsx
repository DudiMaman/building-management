'use client';
import { useEffect, useRef, useState } from 'react';
import {
  Banknote,
  Bell,
  Calendar,
  CreditCard,
  DoorOpen,
  FileCheck,
  MessageCircle,
  Receipt,
  UserPlus,
  Wrench,
} from 'lucide-react';

/**
 * Living Tower — the v5 hero visual, photo edition. A real photograph of a
 * designed residential tower with the live event system layered on top:
 * radar pings at the event location and spring-in glass chips. Ten events
 * cycle at a brisk 1.35s beat covering the whole capability surface.
 * Pauses on hover; goes fully static under reduced motion.
 *
 * The schematic LivingBuilding still serves the scroll-driven platform
 * story below — photo for emotion, diagram for explanation.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

interface TowerEvent {
  id: string;
  icon: typeof CreditCard;
  color: string;
  title: string;
  sub: string;
  time: string;
  /** ping anchor on the photo (percent, physical left/top) */
  ping: { top: string; left: string };
  /** chip position (percent, physical left/top) */
  chip: { top: string; left: string };
}

const EVENTS: TowerEvent[] = [
  {
    id: 'billing',
    icon: CreditCard,
    color: 'var(--brass-3)',
    title: 'ועד יוני נגבה · ₪420',
    sub: 'דירה 12 · הוראת קבע',
    time: '09:02',
    ping: { top: '22%', left: '66%' },
    chip: { top: '13%', left: '10%' },
  },
  {
    id: 'maintenance',
    icon: Wrench,
    color: '#fda4af',
    title: 'נזילה בקומה 3 — שויכה',
    sub: 'צילום ומיקום אצל העובד',
    time: '09:14',
    ping: { top: '48%', left: '20%' },
    chip: { top: '40%', left: '30%' },
  },
  {
    id: 'bot',
    icon: MessageCircle,
    color: '#86efac',
    title: 'הבוט ענה לדייר',
    sub: 'WhatsApp · 8 שניות',
    time: '09:21',
    ping: { top: '36%', left: '76%' },
    chip: { top: '30%', left: '40%' },
  },
  {
    id: 'vote',
    icon: FileCheck,
    color: 'var(--brass-3)',
    title: 'הצבעה אושרה',
    sub: 'שיפוץ לובי · 12 חתימות',
    time: '09:36',
    ping: { top: '9%', left: '54%' },
    chip: { top: '4%', left: '8%' },
  },
  {
    id: 'access',
    icon: DoorOpen,
    color: '#93c5fd',
    title: 'שער החניה נפתח',
    sub: 'דייר מזוהה · חניון א׳',
    time: '09:40',
    ping: { top: '80%', left: '62%' },
    chip: { top: '70%', left: '14%' },
  },
  {
    id: 'invoice',
    icon: Receipt,
    color: 'var(--brass-3)',
    title: 'קבלה #2031 נשלחה',
    sub: 'תואמת רשות המסים',
    time: '09:47',
    ping: { top: '62%', left: '30%' },
    chip: { top: '55%', left: '42%' },
  },
  {
    id: 'lease',
    icon: UserPlus,
    color: '#86efac',
    title: 'שוכר חדש נקלט',
    sub: 'דירה 8 · חוזה דיגיטלי',
    time: '09:52',
    ping: { top: '28%', left: '46%' },
    chip: { top: '21%', left: '4%' },
  },
  {
    id: 'reminder',
    icon: Bell,
    color: 'var(--brass-3)',
    title: 'תזכורת נשלחה · 3 מאחרים',
    sub: 'SMS + WhatsApp',
    time: '09:58',
    ping: { top: '44%', left: '60%' },
    chip: { top: '37%', left: '14%' },
  },
  {
    id: 'check',
    icon: Banknote,
    color: '#86efac',
    title: 'צ׳ק נפרע · ₪1,850',
    sub: 'ספק גינון · מס"ב',
    time: '10:04',
    ping: { top: '56%', left: '74%' },
    chip: { top: '49%', left: '32%' },
  },
  {
    id: 'service',
    icon: Calendar,
    color: '#93c5fd',
    title: 'טכנאי מעלית הוזמן',
    sub: 'ביקורת תקופתית · יום ג׳',
    time: '10:11',
    ping: { top: '70%', left: '14%' },
    chip: { top: '63%', left: '24%' },
  },
];

const CYCLE_MS = 1350;

export function LivingTower({ className = '' }: { className?: string }) {
  const [idx, setIdx] = useState(0);
  const [animate, setAnimate] = useState(true);
  const paused = useRef(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setAnimate(false);
      return;
    }
    const t = setInterval(() => {
      if (!paused.current) setIdx((i) => (i + 1) % EVENTS.length);
    }, CYCLE_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className={`relative ${className}`}
      style={{ aspectRatio: '4 / 5' }}
      role="img"
      aria-label="מגדל מגורים מודרני שמוצגים עליו אירועי מערכת חיים: גבייה, תקלות, בוט, הצבעות, שערים וחשבוניות"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* Cutout towers — sky removed, edges dissolve into the page.
          The site background IS the sky: no glow, no halo, no frame. */}
      <img
        src={`${BASE}/v5/towers-cutout.webp`}
        alt=""
        width={1200}
        height={1500}
        className={`absolute inset-0 h-full w-full object-cover ${animate ? 'lt-grow' : ''}`}
        style={{ filter: 'sepia(0.08) saturate(0.96) contrast(1.02)' }}
      />

      {/* Radar pings — one per event, only the active one runs */}
      {EVENTS.map((e, i) => (
        <div
          key={e.id}
          aria-hidden
          className="absolute"
          style={{ top: e.ping.top, left: e.ping.left, width: 14, height: 14 }}
        >
          {animate && i === idx && (
            <>
              <span className="lt-ping" style={{ borderColor: e.color }} />
              <span className="lt-ping lt-ping-2" style={{ borderColor: e.color }} />
            </>
          )}
          <span
            className="absolute inset-[4px] rounded-full transition-opacity duration-300"
            style={{ background: e.color, opacity: i === idx ? 1 : 0, boxShadow: `0 0 12px ${e.color}` }}
          />
        </div>
      ))}

      {/* Event chips — glass over photo, spring entrance */}
      {EVENTS.map((e, i) => {
        const Icon = e.icon;
        return (
          <div
            key={e.id}
            className="lt-chip absolute flex items-start gap-2.5 rounded-xl px-3.5 py-2.5"
            data-active={i === idx}
            aria-hidden
            style={{
              ...e.chip,
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: '0 14px 34px -12px rgba(20,16,12,0.45)',
            }}
          >
            <span
              className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg"
              style={{ background: 'var(--ink)', color: e.color }}
            >
              <Icon style={{ width: 14, height: 14 }} />
            </span>
            <span>
              <span className="block whitespace-nowrap text-[12.5px] font-extrabold leading-tight" style={{ color: 'var(--ink)' }}>
                {e.title}
              </span>
              <span className="block whitespace-nowrap text-[11px]" style={{ color: 'var(--ink-3)' }}>
                {e.sub}
              </span>
            </span>
          </div>
        );
      })}

    </div>
  );
}
