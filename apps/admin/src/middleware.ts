/**
 * Next.js middleware — refreshes the Supabase session on every request
 * and protects the dashboard routes from anonymous access.
 *
 * Cookie-based sessions need to be re-written on every request so they
 * don't expire mid-session, hence the Supabase boilerplate here.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

interface SetCookie {
  name: string;
  value: string;
  options?: CookieOptions;
}

const PUBLIC_PATHS = ['/login', '/signup', '/legal'];

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({ request: req });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet: SetCookie[]) => {
          for (const { name, value } of cookiesToSet) {
            req.cookies.set(name, value);
          }
          response = NextResponse.next({ request: req });
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set({ name, value, ...options });
          }
        },
      },
    },
  );

  const { data } = await supabase.auth.getUser();
  const pathname = req.nextUrl.pathname;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!data.user && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  if (data.user && pathname === '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/.*).*)'],
};
