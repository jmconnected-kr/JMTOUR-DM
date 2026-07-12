import { PlayPage } from '../../components/travel-demo/play-page';
import { requireAppUser } from '../../lib/auth';

export default async function Page() {
  await requireAppUser();
  return <PlayPage />;
}
