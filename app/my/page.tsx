import { MyPage } from '../../components/travel-demo/my-page';
import { requireAppUser } from '../../lib/auth';

export default async function Page() {
  await requireAppUser();
  return <MyPage />;
}
