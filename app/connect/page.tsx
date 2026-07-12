import { ConnectPage } from '../../components/travel-demo/connect-page';
import { requireAppUser } from '../../lib/auth';

export default async function Page() {
  await requireAppUser();
  return <ConnectPage />;
}
