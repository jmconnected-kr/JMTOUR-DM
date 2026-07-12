import { redirect } from 'next/navigation';
import { AuthPage } from '../../../components/travel-demo/auth-page';
import { getCurrentAuthContext } from '../../../lib/auth';

export default async function Page() {
  const context = await getCurrentAuthContext();

  if (context) {
    redirect(context.role === 'admin' ? '/admin' : '/participant');
  }

  return <AuthPage />;
}
