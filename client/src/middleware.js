import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookieToSet) {
          cookieToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          })
        }
      }
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  console.log('user =>', user);

  const isProtected = req.nextUrl.pathname.startsWith('/dashboard') || req.nextUrl.pathname.startsWith('/references');

  console.log('isProtected =>', isProtected)
  if (isProtected && !user) {
    const redirectUrl = new URL('/', req.url);
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }
  return res;
};

export const config = {
  matcher: ['/dashboard/:path*', '/references/:path*']
}