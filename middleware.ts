import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. REFRESH AUTH SESSION
  const { data: { user } } = await supabase.auth.getUser();

  const nextUrl = request.nextUrl;
  const path = nextUrl.pathname;

  // 2. PROTECT STUDENT DASHBOARD
  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. PROTECT ADMIN CONTROL PANELS
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Edge-compatible direct REST API check to verify user profile role
    try {
      const profileResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/profiles?user_id=eq.${user.id}&select=role`,
        {
          headers: {
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${supabase.auth.getSession() ? (await supabase.auth.getSession()).data.session?.access_token : ''}`,
          },
        }
      );
      
      const profiles = await profileResponse.json();
      
      if (!profiles || profiles.length === 0 || profiles[0].role !== 'admin') {
        // Redirection if session is authenticated but role is not admin
        console.warn(`Unauthorized admin panel access attempt by: ${user.email}`);
        return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url));
      }
    } catch (err) {
      console.error('Middleware Edge profile check failed:', err);
      return NextResponse.redirect(new URL('/admin/login?error=server_error', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
