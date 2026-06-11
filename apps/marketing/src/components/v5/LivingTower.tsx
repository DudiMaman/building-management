'use client';
import { useEffect, useRef, useState } from 'react';
import { CreditCard, Wrench, MessageCircle, FileCheck, DoorOpen, Receipt } from 'lucide-react';

/**
 * Living Tower — the v5 hero visual, photo edition. A real photograph of a
 * designed residential tower with the live event system layered on top:
 * radar pings at the event location, spring-in glass chips, and a bottom
 * feed bar. Cycles faster than the old schematic (2.7s) and covers the
 * whole capability surface (billing, maintenance, bot, votes, access,
 * invoicing). Pauses on hover; goes fully static under reduced motion.
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
    ping: { top: '30%', left: '72%' },
    chip: { top: '24%', left: '26%' },
  },
  {
    id: 'maintenance',
    icon: Wrench,
    color: '#fda4af',
    title: 'נזילה בקומה 3 — שויכה',
    sub: 'צילום ומיקום אצל העובד',
    time: '09:14',
    ping: { top: '50%', left: '16%' },
    chip: { top: '46%', left: '22%' },
  },
  {
    id: 'bot',
    icon: MessageCircle,
    color: '#86efac',
    title: 'הבוט ענה לדייר',
    sub: 'WhatsApp · 8 שניות',
    time: '09:21',
    ping: { top: '20%', left: '10%' },
    chip: { top: '15%', left: '16%' },
  },
  {
    id: 'vote',
    icon: FileCheck,
    color: 'var(--brass-3)',
    title: 'הצבעה אושרה',
    sub: 'שיפוץ לובי · 12 חתימות',
    time: '09:36',
    ping: { top: '13%', left: '86%' },
    chip: { top: '9%', left: '36%' },
  },
  {
    id: 'access',
    icon: DoorOpen,
    color: '#93c5fd',
    title: 'שער החניה נפתח',
    sub: 'דייר מזוהה · חניון א׳',
    time: '09:40',
    ping: { top: '82%', left: '78%' },
    chip: { top: '76%', left: '24%' },
  },
  {
    id: 'invoice',
    icon: Receipt,
    color: 'var(--brass-3)',
    title: 'קבלה #2031 נשלחה',
    sub: 'תואמת רשות המסים',
    time: '09:47',
    ping: { top: '70%', left: '22%' },
    chip: { top: '62%', left: '34%' },
  },
];

const CYCLE_MS = 2700;

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

  const ev = EVENTS[idx];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{ aspectRatio: '4 / 5', boxShadow: '0 30px 70px -30px rgba(28,25,23,0.45)' }}
      role="img"
      aria-label="מגדל מגורים מודרני שמוצגים עליו אירועי מערכת חיים: גבייה, תקלות, בוט, הצבעות, שערים וחשבוניות"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      {/* Photo + slow Ken Burns */}
      <img
        src={`${BASE}/v5/tower.jpg`}
        alt=""
        width={1200}
        height={1500}
        className={`absolute inset-0 h-full w-full object-cover ${animate ? 'lt-kenburns' : ''}`}
      />

      {/* Readability gradients */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(20,16,12,0.72) 0%, rgba(20,16,12,0.12) 30%, rgba(20,16,12,0) 55%), linear-gradient(to bottom, rgba(20,16,12,0.35) 0%, rgba(20,16,12,0) 22%)',
        }}
      />

      {/* Address plate */}
      <div
        className="absolute flex items-center gap-2 rounded-md px-2.5 py-1.5"
        style={{
          top: 14,
          left: 14,
          background: 'rgba(20,16,12,0.55)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.14)',
        }}
        aria-hidden
      >
        <span className="lb-blink inline-block h-1.5 w-1.5 rounded-full" style={{ background: '#86efac' }} />
        <span className="text-[11px] font-bold text-white">רוטשילד 4, תל אביב</span>
        <span className="eyebrow-en !text-[9px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
          LIVE
        </span>
      </div>

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

      {/* Bottom feed bar */}
      <div
        className="absolute inset-x-3 bottom-3 overflow-hidden rounded-xl"
        style={{
          background: 'rgba(20,16,12,0.6)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
        aria-hidden
      >
        <div key={ev.id} className={animate ? 'lt-feed-in' : ''}>
          <div className="flex items-center gap-2.5 px-3.5 py-2.5">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: ev.color }} />
            <span className="truncate text-[12px] font-bold text-white">{ev.title}</span>
            <span className="hidden truncate text-[11px] sm:block" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {ev.sub}
            </span>
            <span className="tnum ms-auto shrink-0 text-[10px]" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-mono)' }}>
              {ev.time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
