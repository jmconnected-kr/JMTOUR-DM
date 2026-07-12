import { redirect } from 'next/navigation';
import { getCurrentAuthContext } from '../lib/auth';

export default async function Page() {
  const context = await getCurrentAuthContext();

  if (!context) {
    redirect('/auth/login');
  }

  redirect(context.role === 'admin' ? '/admin' : '/participant');
}
