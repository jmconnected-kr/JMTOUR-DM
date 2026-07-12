import { SchedulePage } from '../../components/travel-demo/schedule-page';
import { requireAppUser } from '../../lib/auth';

export default async function Page() {
  await requireAppUser();
  return <SchedulePage />;
}
