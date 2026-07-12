import { redirect } from 'next/navigation';
import { createClient as createServerSupabase } from './supabase/server';
import { getSupabaseAdmin } from './supabase-admin';

export type AppRole = 'admin' | 'participant';

export async function getCurrentAuthContext() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const admin = getSupabaseAdmin();
  let role: AppRole = 'participant';

  if (admin) {
    const { data } = await admin.from('user_roles').select('role').eq('user_id', user.id).maybeSingle<{ role: AppRole }>();
    role = data?.role ?? 'participant';
  }

  return { user, role };
}

export async function requireRole(allowedRoles: AppRole[]) {
  const context = await getCurrentAuthContext();

  if (!context) {
    redirect('/auth/login');
  }

  if (!allowedRoles.includes(context.role)) {
    redirect(context.role === 'admin' ? '/admin' : '/participant');
  }

  return context;
}

export async function requireAppUser() {
  return requireRole(['admin', 'participant']);
}
