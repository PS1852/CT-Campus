import { createClient } from '@/lib/supabase/server';

export async function requireAdminUser() {
  const supabase = createClient();
  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'ctcampus2019@gmail.com').toLowerCase();

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { user: null, supabase, authorized: false, error: 'Authentication required.' };
  }

  if ((user.email || '').toLowerCase() === adminEmail) {
    return { user, supabase, authorized: true, error: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileError || profile?.role !== 'admin') {
    return { user, supabase, authorized: false, error: 'Administrator access required.' };
  }

  return { user, supabase, authorized: true, error: null };
}
