import { createAdminClient, hasServiceRoleKey } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export type AdminAdmission = {
  id: string;
  status: string;
  payment_submitted: boolean | null;
  payment_submission_time: string | null;
  created_at: string;
  documents_url: string | null;
  profiles: {
    full_name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  courses: {
    title: string | null;
    category: string | null;
  } | null;
};

export function getPrivilegedDbClient() {
  return hasServiceRoleKey() ? createAdminClient() : createClient();
}

export async function getAdminAdmissions(limit?: number) {
  const db = getPrivilegedDbClient();

  let query = db
    .from('admissions')
    .select(`
      id,
      status,
      payment_submitted,
      payment_submission_time,
      created_at,
      documents_url,
      profiles (
        full_name,
        phone,
        email
      ),
      courses (
        title,
        category
      )
    `)
    .order('created_at', { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data || []) as AdminAdmission[];
}

export async function updateAdminAdmissionStatus(id: string, status: 'approved' | 'rejected') {
  const db = getPrivilegedDbClient();

  const { data, error } = await db
    .from('admissions')
    .update({ status })
    .eq('id', id)
    .select(`
      id,
      status,
      payment_submitted,
      payment_submission_time,
      created_at,
      documents_url,
      profiles (
        full_name,
        phone,
        email
      ),
      courses (
        title,
        category
      )
    `)
    .single();

  if (error) {
    throw error;
  }

  return data as AdminAdmission;
}
