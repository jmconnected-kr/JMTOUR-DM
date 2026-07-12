import { AdminPage } from '../../components/travel-demo/admin-page';
import { requireRole } from '../../lib/auth';

export default async function Page() {
  const context = await requireRole(['admin']);
  return <AdminPage currentUserEmail={context.user.email ?? ''} />;
}
