'use client';
import { useState } from 'react';
import { Building2, Users, Home, KeyRound, ArrowLeft } from 'lucide-react';

/**
 * "Enterprise Gateway" path-selector — per the ui-ux-pro-max skill's
 * recommended pattern. Visitors self-segment in the hero by role,
 * and the value-prop copy reflects their selection. The default state
 * shows the management company POV (our primary buyer).
 */

const personas = {
  mgmt: {
    icon: Building2,
    label: 'חברת ניהול',
    headline: 'נהלו תיק נדל"ן שלם — ממסך אחד.',
    subhead:
      'גבייה אוטומטית בכרטיס אשראי, פניות שירות עם AI, חשבוניות תואמות רשות המסים — מ-3 בניינים ועד 500.',
    cta: 'תאמו הדגמה לחברה',
  },
  committee: {
    icon: Users,
    label: 'ועד בית',
    headline: 'ועד שמוביל. לא רץ אחרי ניירת.',
    subhead:
      'הצבעות עם חתימה דיגיטלית, פרוטוקולים חתומים, יומן הוצאות שקוף לכל הדיירים. הקמה ביום אחד.',
    cta: 'התחילו עם הוועד',
  },
  owner: {
    icon: Home,
    label: 'בעלי דירות',
    headline: 'בעלים נעדר? הכל בשליטה.',
    subhead:
      'תיק הדירה לאורך כל החיים שלה. תומך בבעלים נעדר, ריבוי דירות, ופיצול תשלום עם השוכר.',
    cta: 'הצטרפו כבעלים',
  },
  tenant: {
    icon: KeyRound,
    label: 'דיירים ושוכרים',
    headline: 'אפליקציה אחת לכל מה שצריך.',
    subhead:
      'תשלום בכרטיס אשראי, דיווח תקלות עם תמונה, פתיחת שער חניה בלחיצה — והכל בעברית.',
    cta: 'הורידו את האפליקציה',
  },
} as const;

type PersonaKey = keyof typeof personas;

export function PersonaGateway() {
  const [active, setActive] = useState<PersonaKey>('mgmt');
  const p = personas[active];

  return (
    <div className="reveal" style={{ animationDelay: '0ms' }}>
      {/* Eyebrow */}
      <div className="eyebrow">מערכת תפעול 2026 · נבנתה בישראל</div>

      {/* Persona tabs */}
      <div
        className="mt-7 inline-flex flex-wrap gap-1 rounded-full border p-1"
        style={{ background: 'var(--paper)', borderColor: 'var(--line-2)' }}
        role="tablist"
        aria-label="בחירת תפקיד"
      >
        {(Object.keys(personas) as PersonaKey[]).map((key) => {
          const Icon = personas[key].icon;
          const isActive = key === active;
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold transition-all md:text-[14px]`}
              style={{
                background: isActive ? 'var(--ink)' : 'transparent',
                color: isActive ? 'var(--paper)' : 'var(--ink-3)',
              }}
            >
              <Icon className="h-3.5 w-3.5" />
              {personas[key].label}
            </button>
          );
        })}
      </div>

      {/* Headline + sub — reactive to selection */}
      <h1 className="display-1 mt-6 max-w-[19ch]">
        {p.headline}
      </h1>
      <p className="lead mt-5 max-w-[44ch]">{p.subhead}</p>

      {/* CTAs */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <a href="#cta" className="btn btn-ink">
          {p.cta}
          <ArrowLeft className="h-4 w-4" />
        </a>
        <a href="#platform" className="btn btn-ghost">
          סקירת הפלטפורמה
        </a>
      </div>

      <p className="mt-4 text-[13px] text-[var(--ink-3)]">
        ללא התחייבות · 5 דקות התקנה · ניסיון חינם 30 יום
      </p>
    </div>
  );
}
