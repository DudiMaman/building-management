'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Wallet,
  Wrench,
  MessageCircle,
  Building2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-16 pb-20 md:pt-24 md:pb-28">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-right"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-2 text-sm text-primary-700">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary-500" />
            <span>חדש — בוט AI בעברית ב-WhatsApp 24/7</span>
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
            ניהול מבנים
            <br />
            <span className="bg-gradient-to-l from-primary-600 to-indigo-500 bg-clip-text text-transparent">
              בלי כאב ראש
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-600 md:text-xl lg:max-w-none">
            פלטפורמה אחת לחברת הניהול, לדיירים, לבעלי דירות ולאנשי האחזקה.
            גבייה, פניות שירות, וואטסאפ, בוט AI, שערי חניה, חשבוניות רשות המסים.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-4 text-base font-medium text-white shadow-lg shadow-primary-300/30 transition hover:bg-primary-700"
            >
              התחילו ניסיון חינם
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-slate-300 bg-white px-8 py-4 text-base font-medium hover:bg-slate-50"
            >
              קבעו הדגמה
            </Link>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            30 יום ניסיון חינם • ללא כרטיס אשראי • הקמה תוך 10 דקות
          </p>
        </motion.div>

        <DashboardMockup />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform">
        <div className="mx-auto h-96 w-3/4 rounded-full bg-gradient-to-r from-primary-100 via-indigo-100 to-pink-100 blur-3xl opacity-50" />
      </div>
    </section>
  );
}

/**
 * Animated dashboard mockup — uses Tailwind components only (no screenshots,
 * per SPEC §6.6). Framer Motion staggers each card in, then a few KPIs
 * gently animate to feel alive.
 */
function DashboardMockup() {
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
  };
  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="relative"
    >
      {/* Floating gradient backdrop */}
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary-100/60 via-indigo-100/40 to-transparent blur-2xl" />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-primary-100/50">
        {/* Window chrome */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </div>
          <div className="rounded-md bg-slate-50 px-3 py-1 text-xs text-slate-500">
            app.building-management.co.il
          </div>
          <div className="w-12" />
        </div>

        {/* KPI row */}
        <motion.div variants={item} className="mt-4 grid grid-cols-3 gap-3">
          <KpiTile icon={Building2} label="בניינים" value="12" tone="primary" />
          <KpiTile icon={AlertCircle} label="פניות" value="8" tone="amber" />
          <KpiTile icon={Wallet} label="גבייה" value="94%" tone="green" delta="+2.3" />
        </motion.div>

        {/* Mini chart row */}
        <motion.div variants={item} className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <TrendingUp className="h-4 w-4 text-primary-600" />
              גבייה ב-90 ימים אחרונים
            </div>
            <div className="text-xs font-semibold text-emerald-600">+18%</div>
          </div>
          <Sparkline />
        </motion.div>

        {/* Activity row */}
        <motion.div variants={item} className="mt-4 space-y-2">
          <ActivityRow
            icon={Wallet}
            tone="primary"
            title="חיוב חודשי הופק - הרצל 10"
            time="לפני 5 דק׳"
          />
          <ActivityRow
            icon={Wrench}
            tone="amber"
            title="פנייה חדשה: נזילה בדירה 12"
            time="לפני 23 דק׳"
          />
          <ActivityRow
            icon={MessageCircle}
            tone="green"
            title="בוט WhatsApp ענה לדייר"
            time="לפני שעה"
          />
        </motion.div>
      </div>

      {/* Floating WhatsApp bubble */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, type: 'spring' }}
        className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-emerald-500 px-4 py-3 text-sm text-white shadow-lg shadow-emerald-200 md:block"
        dir="rtl"
      >
        <div className="font-semibold">בוט AI</div>
        <div className="opacity-90">היתרה שלך: ₪0 ✓</div>
      </motion.div>
    </motion.div>
  );
}

function KpiTile({
  icon: Icon,
  label,
  value,
  delta,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  delta?: string;
  tone: 'primary' | 'amber' | 'green';
}) {
  const tones: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="flex items-center gap-2">
        <div className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="text-[10px] text-slate-500">{label}</div>
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <div className="text-xl font-bold">{value}</div>
        {delta && <div className="text-[10px] font-semibold text-emerald-600">{delta}%</div>}
      </div>
    </div>
  );
}

function ActivityRow({
  icon: Icon,
  tone,
  title,
  time,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: 'primary' | 'amber' | 'green';
  title: string;
  time: string;
}) {
  const tones: Record<string, string> = {
    primary: 'bg-primary-50 text-primary-700',
    amber: 'bg-amber-50 text-amber-700',
    green: 'bg-emerald-50 text-emerald-700',
  };
  return (
    <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-2.5">
      <div className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 truncate text-xs text-slate-700">{title}</div>
      <div className="text-[10px] text-slate-400">{time}</div>
    </div>
  );
}

function Sparkline() {
  // Hand-built sparkline so we don't pull in a chart lib.
  const points = [12, 22, 18, 28, 24, 38, 30, 44, 50, 46, 62, 58, 72];
  const w = 240;
  const h = 50;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const stepX = w / (points.length - 1);
  const path = points
    .map((v, i) => {
      const x = i * stepX;
      const y = h - ((v - min) / (max - min)) * h;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  const fill = `${path} L ${w} ${h} L 0 ${h} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={fill}
        fill="url(#sparkFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
      />
    </svg>
  );
}
