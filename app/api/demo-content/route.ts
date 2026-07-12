import { NextResponse } from 'next/server';
import {
  createWorkspaceFromLegacy,
  defaultDemoWorkspace,
  isDemoWorkspace,
  isLegacyDemoContent,
  normalizeDemoWorkspace,
  type DemoWorkspace,
} from '../../../components/travel-demo/demo-content-schema';
import { getCurrentAuthContext } from '../../../lib/auth';
import { getSupabaseAdmin, getSupabaseConfigError } from '../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CONTENT_SLUG = process.env.DEMO_CONTENT_SLUG ?? 'travel-demo';

type DemoContentRow = {
  slug: string;
  content: DemoWorkspace | unknown;
  updated_at?: string;
  updated_by?: string | null;
};

function getWorkspaceFromUnknown(input: unknown) {
  if (isDemoWorkspace(input)) return normalizeDemoWorkspace(input);
  if (isLegacyDemoContent(input)) return createWorkspaceFromLegacy(input);
  return defaultDemoWorkspace;
}

async function fetchStoredWorkspace() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      configured: false,
      workspace: defaultDemoWorkspace,
      message: getSupabaseConfigError() || 'Supabase 환경변수가 아직 설정되지 않았습니다.',
      source: 'default' as const,
    };
  }

  const { data, error } = await supabase
    .from('demo_contents')
    .select('slug, content, updated_at, updated_by')
    .eq('slug', CONTENT_SLUG)
    .maybeSingle<DemoContentRow>();

  if (error) {
    return {
      configured: true,
      workspace: defaultDemoWorkspace,
      message: 'Supabase는 연결됐지만 demo_contents 테이블 조회에 실패했습니다. SQL 파일을 먼저 실행해 주세요.',
      source: 'default' as const,
    };
  }

  if (!data?.content) {
    return {
      configured: true,
      workspace: defaultDemoWorkspace,
      message: 'Supabase에 기본 워크스페이스를 생성할 준비가 되었습니다.',
      source: 'default' as const,
    };
  }

  return {
    configured: true,
    workspace: getWorkspaceFromUnknown(data.content),
    message: 'Supabase 저장본을 불러왔습니다.',
    source: 'supabase' as const,
  };
}

async function upsertWorkspace(workspace: DemoWorkspace, updatedBy: string) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false as const, message: getSupabaseConfigError() || 'Supabase 환경변수가 비어 있습니다.' };
  }

  const normalized = normalizeDemoWorkspace(workspace);
  const { error } = await supabase.from('demo_contents').upsert(
    {
      slug: CONTENT_SLUG,
      content: normalized,
      updated_by: updatedBy,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'slug' },
  );

  if (error) {
    return { ok: false as const, message: 'Supabase 저장에 실패했습니다. 테이블 구조를 확인해 주세요.' };
  }

  return { ok: true as const, workspace: normalized };
}

function mergeParticipantWorkspace(current: DemoWorkspace, incoming: DemoWorkspace, user: { id: string; email?: string | null }) {
  const normalizedCurrent = normalizeDemoWorkspace(current);
  const normalizedIncoming = normalizeDemoWorkspace(incoming);
  const email = user.email?.toLowerCase() ?? '';

  const participant = normalizedCurrent.accounts.find(
    (account) => account.userId === user.id || (email && account.email.toLowerCase() === email),
  );

  if (!participant) {
    return { ok: false as const, message: '참여자 계정이 행사 워크스페이스에 연결되지 않았습니다. 다시 로그인해 주세요.' };
  }

  const incomingAccount = normalizedIncoming.accounts.find((account) => account.id === participant.id) ?? participant;
  const nextEventId = normalizedCurrent.events.some((event) => event.id === incomingAccount.eventId)
    ? incomingAccount.eventId
    : participant.eventId;

  const nextAccounts = normalizedCurrent.accounts.map((account) => {
    if (account.id !== participant.id) return account;
    return {
      ...account,
      name: incomingAccount.name,
      email: user.email ?? account.email,
      userId: user.id,
      inviteCode: account.inviteCode,
      eventId: nextEventId,
      status: incomingAccount.status,
      headline: incomingAccount.headline,
      language: incomingAccount.language,
      note: incomingAccount.note,
      quickActions: incomingAccount.quickActions,
      customSchedule: incomingAccount.customSchedule,
      canEditSharedPages: account.canEditSharedPages,
      canEditSchedules: account.canEditSchedules,
    };
  });

  const nextWorkspace: DemoWorkspace = {
    ...normalizedCurrent,
    activeEventId: nextEventId,
    accounts: nextAccounts,
    pagesByEvent: { ...normalizedCurrent.pagesByEvent },
  };

  if (participant.canEditSharedPages || participant.canEditSchedules) {
    const incomingPage = normalizedIncoming.pagesByEvent[nextEventId];
    if (incomingPage) {
      nextWorkspace.pagesByEvent[nextEventId] = incomingPage;
    }
  }

  return { ok: true as const, workspace: normalizeDemoWorkspace(nextWorkspace), updatedBy: `participant:${participant.name}` };
}

export async function GET() {
  const loaded = await fetchStoredWorkspace();

  if (loaded.configured && loaded.source === 'default') {
    const seeded = await upsertWorkspace(loaded.workspace, 'system-seed');
    if (seeded.ok) {
      return NextResponse.json({
        workspace: seeded.workspace,
        configured: true,
        source: 'supabase',
        message: 'Supabase에 기본 워크스페이스를 생성했습니다.',
      });
    }
  }

  return NextResponse.json({
    workspace: loaded.workspace,
    configured: loaded.configured,
    source: loaded.source,
    message: loaded.message,
  });
}

export async function PUT(request: Request) {
  const context = await getCurrentAuthContext();
  if (!context) {
    return NextResponse.json({ message: '로그인이 필요합니다.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: '잘못된 요청 형식입니다.' }, { status: 400 });
  }

  const workspace = (body as { workspace?: unknown })?.workspace;
  if (!isDemoWorkspace(workspace)) {
    return NextResponse.json(
      { message: '저장할 워크스페이스 형식이 올바르지 않습니다.' },
      { status: 400 },
    );
  }

  if (context.role === 'admin') {
    const saved = await upsertWorkspace(normalizeDemoWorkspace(workspace), `admin:${context.user.email ?? context.user.id}`);
    if (!saved.ok) {
      return NextResponse.json({ message: saved.message }, { status: 500 });
    }

    return NextResponse.json({ message: '관리자 변경사항이 Supabase에 저장되었습니다.', workspace: saved.workspace });
  }

  const current = await fetchStoredWorkspace();
  const merged = mergeParticipantWorkspace(current.workspace, normalizeDemoWorkspace(workspace), context.user);
  if (!merged.ok) {
    return NextResponse.json({ message: merged.message }, { status: 401 });
  }

  const saved = await upsertWorkspace(merged.workspace, merged.updatedBy);
  if (!saved.ok) {
    return NextResponse.json({ message: saved.message }, { status: 500 });
  }

  return NextResponse.json({ message: '참여자 변경사항이 Supabase에 저장되었습니다.', workspace: saved.workspace });
}
