'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Building2, Users2, Home, KeyRound } from 'lucide-react';

interface Persona {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  bullets: string[];
  stat: { label: string; value: string };
}

const personas: Persona[] = [
  {
    key: 'mgmt',
    label: 'חברות ניהול',
    icon: Building2,
    title: 'ניהול תפעולי, פיננסי ותקשורתי במקום אחד',
    subtitle: 'מ-3 בניינים ועד 500. הכל בפלטפורמה אחת בעברית.',
    bullets: [
      'תצוגת מפה של כל הבניינים עם מצב גבייה ופניות',
      'גבייה אוטומטית בכרטיס אשראי + מס"ב לספקים',
      'דוחות ניהוליים, ייצוא לחשבשבת / ריווחית / פריוריטי',
      'אפליקציית דסקטופ למקצוענים',
      'ניהול הרשאות לצוות עם תפקידים',
      'בוט AI בעברית שעונה לדיירים 24/7',
    ],
    stat: { label: 'חיסכון ממוצע בזמן ניהול', value: '60%' },
  },
  {
    key: 'committee',
    label: 'ועדי בית',
    icon: Users2,
    title: 'אפס בירוקרטיה, מקסימום שקיפות',
    subtitle: 'ועד שמוביל, לא רץ אחרי ניירת.',
    bullets: [
      'סקרים והצבעות עם חתימה דיגיטלית מאובטחת',
      'לוח מודעות בעברית עם התראות פוש',
      'יומן הוצאות ויתרת קופה בזמן אמת',
      'גישה לכל המסמכים המשפטיים של הבניין',
      'פרוטוקולים חתומים דיגיטלית לאסיפות',
      'ניהול קופה קטנה עם צ׳קים סרוקים',
    ],
    stat: { label: 'זמן לאסיפה ועד דיגיטלית', value: '15 דק׳' },
  },
  {
    key: 'owners',
    label: 'בעלי דירות',
    icon: Home,
    title: 'מעקב כספי גם כשאתם לא גרים בבניין',
    subtitle: 'תומך בבעלים נעדר, ריבוי דירות, פיצול תשלומים.',
    bullets: [
      'תצוגת היסטוריית תשלומים מלאה לדירה',
      'התראה אוטומטית כשהשוכר מאחר בתשלום',
      'אפשרות לכסות תשלום שהשוכר פספס',
      'הזמנת שוכר חדש דרך האפליקציה (Path B)',
      'תיוק חוזי שכירות עם תאריכי תפוגה',
      'מתג ועד-משלם: בעלים / שוכר / 50-50',
    ],
    stat: { label: 'תרחישי בעלים / שוכר נתמכים', value: '4' },
  },
  {
    key: 'renters',
    label: 'דיירים ושוכרים',
    icon: KeyRound,
    title: 'תשלום קל ופניות מהירות',
    subtitle: 'הכל מהטלפון, בעברית, בלי טלפונים מיותרים.',
    bullets: [
      'תשלום בכרטיס אשראי או הוראת קבע (1-12 תשלומים)',
      'דיווח תקלות עם תמונה ווידאו',
      'פתיחת שער חניה בלחיצה אחת',
      'בוט WhatsApp עונה תמיד, מסלים לבן אדם כשצריך',
      'קבלות בעברית עם חתימה דיגיטלית',
      'התראות פוש לעדכוני קריאות',
    ],
    stat: { label: 'זמן ממוצע לתשלום ועד', value: '23 שניות' },
  },
];

export function WhoItsFor() {
  const [active, setActive] = useState(personas[0]!.key);
  const persona = personas.find((p) => p.key === active) ?? personas[0]!;
  const Icon = persona.icon;

  return (
    <section id="who" className="bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-4xl font-bold">למי זה מתאים</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
          בנינו את המערכת מהבסיס לעולם הישראלי — חברות ניהול, ועדי בית, בעלי דירות, ושוכרים.
        </p>

        {/* Tab strip */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {personas.map((p) => {
            const isActive = p.key === active;
            const TabIcon = p.icon;
            return (
              <button
                key={p.key}
                onClick={() => setActive(p.key)}
                aria-pressed={isActive}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary-200'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                <TabIcon className="h-4 w-4" />
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Tab body */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={persona.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 lg:grid-cols-5 lg:p-12"
            >
              <div className="lg:col-span-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-2xl font-bold md:text-3xl">{persona.title}</h3>
                <p className="mt-2 text-slate-600">{persona.subtitle}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {persona.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-600 p-8 text-white lg:col-span-2">
                <p className="text-sm opacity-80">{persona.stat.label}</p>
                <p className="mt-2 text-5xl font-bold">{persona.stat.value}</p>
                <p className="mt-6 text-sm opacity-90">
                  מבוסס על נתונים אגרגטיביים של חברות הניהול בפלטפורמה.
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
