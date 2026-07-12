import { ParticipantPage } from '../../components/travel-demo/participant-page';
import { requireRole } from '../../lib/auth';

export default async function Page() {
  const context = await requireRole(['participant', 'admin']);
  return (
    <ParticipantPage
      currentUserId={context.user.id}
      currentUserEmail={context.user.email ?? ''}
      currentRole={context.role}
    />
  );
}
