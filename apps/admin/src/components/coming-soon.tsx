import { Construction } from 'lucide-react';
import { PageHeader } from './data-table';

interface ComingSoonProps {
  title: string;
  subtitle?: string;
  body?: string;
  endpoints?: string[];
}

/**
 * Placeholder used by admin pages whose backend endpoints exist but the
 * UI hasn't been built yet. Lists the API surfaces that are already
 * working so the team knows what's wireable next.
 */
export function ComingSoon({ title, subtitle, body, endpoints }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
          <Construction className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-xl font-semibold">העמוד עוד בפיתוח</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-600">
          {body ?? 'ה-API כבר זמין; ה-UI מצויר ועולה בקרוב.'}
        </p>
        {endpoints && endpoints.length > 0 && (
          <div className="mx-auto mt-6 max-w-md rounded-xl bg-slate-50 p-4 text-right">
            <p className="text-xs font-semibold text-slate-500">Endpoints זמינים:</p>
            <ul className="mt-2 space-y-1 font-mono text-xs text-slate-700">
              {endpoints.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
