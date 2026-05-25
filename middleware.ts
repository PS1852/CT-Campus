import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Bail out early if env vars are not set
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars in middleware');
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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

  const path = request.nextUrl.pathname;

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
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token || '';

      const profileResponse = await fetch(
        `${supabaseUrl}/rest/v1/profiles?user_id=eq.${user.id}&select=role`,
        {
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      
      const profiles = await profileResponse.json();
      
      if (!profiles || profiles.length === 0 || profiles[0].role !== 'admin') {
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
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/callback',
  ],
};
