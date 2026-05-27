/**
 * Server-side Supabase client. Reads + writes cookies via next/headers so
 * sessions stay in sync across server components, route handlers, and
 * middleware.
 */
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

interface SetCookie {
  name: string;
  value: string;
  options?: CookieOptions;
}

export async function createSupabaseServerClient() {
  const store = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll: () => store.getAll(),
        setAll: (cookiesToSet: SetCookie[]) => {
          try {
            for (const { name, value, options } of cookiesToSet) {
              store.set({ name, value, ...options });
            }
          } catch {
            // setAll can throw when called from a Server Component context —
            // ignore: the middleware path handles writes for us.
          }
        },
      },
    },
  );
}
