'use client';
import { useState, useEffect } from 'react';
import { Building, CreditCard, Globe, Bell, Shield, Users } from 'lucide-react';
import { PageHeader } from '@/components/data-table';
import { apiFetch } from '@/lib/api';

interface Tenant {
  id: string;
  name: string;
  legal_name: string | null;
  vat_id: string | null;
  billing_email: string;
  plan: string;
  trial_ends_at: string | null;
  locale: string;
  timezone: string;
}

const TAB_ITEMS = [
  { id: 'company', label: 'פרטי החברה', icon: Building },
  { id: 'billing', label: 'חיוב ותוכנית', icon: CreditCard },
  { id: 'team', label: 'צוות', icon: Users },
  { id: 'notifications', label: 'התראות', icon: Bell },
  { id: 'localization', label: 'שפה ושעון', icon: Globe },
  { id: 'security', label: 'אבטחה', icon: Shield },
] as const;

type TabId = (typeof TAB_ITEMS)[number]['id'];

export default function SettingsPage() {
  const [tab, setTab] = useState<TabId>('company');
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Tenant>('/tenants/me')
      .then((t) => setTenant(t))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader title="הגדרות" subtitle="ניהול פרטי החברה, תוכנית, צוות והרשאות" />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <nav className="space-y-1">
          {TAB_ITEMS.map((t) => {
            const Icon = t.icon;
            const isActive = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          {loading && <p className="text-sm text-slate-500">טוען...</p>}
          {!loading && tab === 'company' && tenant && <CompanyTab tenant={tenant} />}
          {!loading && tab === 'billing' && tenant && <BillingTab tenant={tenant} />}
          {!loading && tab === 'team' && <Stub title="צוות" body="הזמנת חברי צוות חדשים והגדרת הרשאות." />}
          {!loading && tab === 'notifications' && <Stub title="התראות" body="ניהול טמפלייטים, ערוצי שליחה ו-DND ברירת מחדל." />}
          {!loading && tab === 'localization' && tenant && <LocalizationTab tenant={tenant} />}
          {!loading && tab === 'security' && <Stub title="אבטחה" body="2FA, מפתחות API, שמירת לוגים." />}
          {!loading && !tenant && (
            <p className="text-sm text-red-600">
              לא ניתן לטעון את פרטי החברה. ודאו ש-API פועל ושאתם מחוברים.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function CompanyTab({ tenant }: { tenant: Tenant }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">פרטי החברה</h2>
      <ReadField label="שם החברה" value={tenant.name} />
      <ReadField label="שם משפטי" value={tenant.legal_name ?? '—'} />
      <ReadField label="ע.מ. / ח.פ." value={tenant.vat_id ?? '—'} />
      <ReadField label="אימייל לחיוב" value={tenant.billing_email} />
      <p className="text-xs text-slate-500">
        עריכת פרטים: כרגע דרך התמיכה — עורכים בכתב מעבר API ל-PUT /v1/tenants/me. UI מלא בקרוב.
      </p>
    </div>
  );
}

function BillingTab({ tenant }: { tenant: Tenant }) {
  const trialEnds = tenant.trial_ends_at ? new Date(tenant.trial_ends_at) : null;
  const daysLeft = trialEnds ? Math.max(0, Math.ceil((trialEnds.getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">תוכנית וחיוב</h2>
      <div className="rounded-xl border border-slate-200 bg-gradient-to-br from-primary-50 to-white p-5">
        <p className="text-xs text-slate-500">התוכנית שלכם</p>
        <p className="mt-1 text-2xl font-bold text-primary-700">
          {{
            trial: 'ניסיון',
            starter: 'Starter',
            pro: 'Pro',
            enterprise: 'Enterprise',
          }[tenant.plan] ?? tenant.plan}
        </p>
        {daysLeft != null && (
          <p className="mt-2 text-sm text-slate-600">
            {daysLeft} ימים נותרו לניסיון — שדרגו לפני שיסתיים כדי לא לאבד גישה.
          </p>
        )}
      </div>
      <button className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
        שדרוג תוכנית
      </button>
    </div>
  );
}

function LocalizationTab({ tenant }: { tenant: Tenant }) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">שפה ושעון</h2>
      <ReadField label="שפת ברירת מחדל" value={tenant.locale} />
      <ReadField label="אזור זמן" value={tenant.timezone} />
    </div>
  );
}

function Stub({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-3 text-sm text-slate-600">{body}</p>
      <div className="mt-6 rounded-xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        UI במלא בקרוב — endpoints בצד שרת כבר זמינים.
      </div>
    </div>
  );
}

function ReadField({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}
