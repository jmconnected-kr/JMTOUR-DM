import { NextResponse } from 'next/server';
import {
  createWorkspaceFromLegacy,
  defaultDemoWorkspace,
  isDemoWorkspace,
  isLegacyDemoContent,
  normalizeDemoWorkspace,
  type DemoWorkspace,
  type ParticipantAccount,
} from '../../../../components/travel-demo/demo-content-schema';
import { getCurrentAuthContext } from '../../../../lib/auth';
import { getSupabaseAdmin, getSupabaseConfigError } from '../../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';

const CONTENT_SLUG = process.env.DEMO_CONTENT_SLUG ?? 'travel-demo';

type DemoContentRow = {
  slug: string;
  content: DemoWorkspace | unknown;
};

function createParticipantAccount(user: { id: string; email?: string | null }, displayName?: string, inviteCode?: string): ParticipantAccount {
  return {
    id: `participant-${user.id}`,
    name: displayName?.trim() || user.email?.split('@')[0] || 'Participant',
    email: user.email ?? '',
    userId: user.id,
    inviteCode: inviteCode?.trim() || `JOIN-${user.id.slice(0, 6).toUpperCase()}`,
    role: 'participant',
    eventId: defaultDemoWorkspace.activeEventId,
    status: '등록 완료',
    headline: '새로 등록한 참여자',
    language: '한국어',
    note: '',
    canEditSharedPages: false,
    canEditSchedules: true,
    quickActions: ['일정 추가', 'QR 체크인'],
    customSchedule: [],
  };
}

export async function POST(request: Request) {
  const context = await getCurrentAuthContext();
  if (!context) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  const admin = getSupabaseAdmin();
  if (!admin) {
    return NextResponse.json({ message: getSupabaseConfigError() || 'Supabase 설정이 비어 있습니다.' }, { status: 500 });
  }

  let body: { displayName?: string; inviteCode?: string } = {};
  try {
    body = (await request.json()) as { displayName?: string; inviteCode?: string };
  } catch {
    // no-op
  }

  if (context.role === 'admin') {
    return NextResponse.json({ message: '관리자 계정은 추가 연결이 필요 없습니다.', role: 'admin' });
  }

  const { data: row } = await admin
    .from('demo_contents')
    .select('slug, content')
    .eq('slug', CONTENT_SLUG)
    .maybeSingle<DemoContentRow>();

  const rawContent = row?.content;
  const workspace = isDemoWorkspace(rawContent)
    ? normalizeDemoWorkspace(rawContent)
    : isLegacyDemoContent(rawContent)
      ? createWorkspaceFromLegacy(rawContent)
      : defaultDemoWorkspace;
  const inviteCode = body.inviteCode?.trim() ?? '';
  const email = context.user.email ?? '';

  const linkedIndex = workspace.accounts.findIndex(
    (account) => account.userId === context.user.id || (email && account.email.toLowerCase() === email.toLowerCase()) || (inviteCode && account.inviteCode === inviteCode),
  );

  if (linkedIndex >= 0) {
    workspace.accounts[linkedIndex] = {
      ...workspace.accounts[linkedIndex],
      userId: context.user.id,
      email,
      name: body.displayName?.trim() || workspace.accounts[linkedIndex].name,
    };
  } else {
    workspace.accounts.push(createParticipantAccount(context.user, body.displayName, inviteCode));
  }

  const { error: saveError } = await admin.from('demo_contents').upsert(
    {
      slug: CONTENT_SLUG,
      content: workspace,
      updated_at: new Date().toISOString(),
      updated_by: `bootstrap:${email || context.user.id}`,
    },
    { onConflict: 'slug' },
  );

  if (saveError) {
    return NextResponse.json({ message: '참여자 계정 연결 저장에 실패했습니다.' }, { status: 500 });
  }

  return NextResponse.json({ message: '참여자 계정을 연결했습니다.', role: 'participant' });
}
