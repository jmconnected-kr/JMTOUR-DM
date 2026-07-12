import { HomePage } from '../../components/travel-demo/home-page';
import { requireAppUser } from '../../lib/auth';

export default async function Page() {
  await requireAppUser();
  return <HomePage />;
}
