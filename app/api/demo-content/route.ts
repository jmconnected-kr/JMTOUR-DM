import { NextResponse } from 'next/server';
import { defaultDemoContent, type DemoContent } from '../../../components/travel-demo/demo-content-schema';
import { getSupabaseAdmin, getSupabaseConfigError } from '../../../lib/supabase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CONTENT_SLUG = process.env.DEMO_CONTENT_SLUG ?? 'travel-demo';

type DemoContentRow = {
  slug: string;
  content: DemoContent;
  updated_at?: string;
  updated_by?: string | null;
};

function isDemoContent(value: unknown): value is DemoContent {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return ['home', 'schedule', 'connect', 'play', 'my'].every((key) => key in record);
}

async function loadOrSeedContent() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return {
      ok: true as const,
      content: defaultDemoContent,
      source: 'default' as const,
      configured: false,
      message: getSupabaseConfigError() || 'Supabase 환경변수가 아직 설정되지 않았습니다.',
    };
  }

  const { data, error } = await supabase
    .from('demo_contents')
    .select('slug, content, updated_at, updated_by')
    .eq('slug', CONTENT_SLUG)
    .maybeSingle<DemoContentRow>();

  if (error) {
    return {
      ok: true as const,
      content: defaultDemoContent,
      source: 'default' as const,
      configured: true,
      message: 'Supabase는 연결됐지만 demo_contents 테이블 조회에 실패했습니다. SQL 파일을 먼저 실행해 주세요.',
    };
  }

  if (data?.content && isDemoContent(data.content)) {
    return {
      ok: true as const,
      content: data.content,
      source: 'supabase' as const,
      configured: true,
      message: 'Supabase 저장본을 불러왔습니다.',
    };
  }

  const { error: seedError } = await supabase.from('demo_contents').upsert(
    {
      slug: CONTENT_SLUG,
      content: defaultDemoContent,
      updated_by: 'system-seed',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'slug' },
  );

  if (seedError) {
    return {
      ok: true as const,
      content: defaultDemoContent,
      source: 'default' as const,
      configured: true,
      message: '기본 데이터 시드에 실패했습니다. SQL 파일을 확인해 주세요.',
    };
  }

  return {
    ok: true as const,
    content: defaultDemoContent,
    source: 'supabase' as const,
    configured: true,
    message: 'Supabase에 기본 콘텐츠를 생성했습니다.',
  };
}

export async function GET() {
  const result = await loadOrSeedContent();
  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  const expectedAdminKey = process.env.DEMO_ADMIN_KEY;
  if (!expectedAdminKey) {
    return NextResponse.json(
      { message: 'DEMO_ADMIN_KEY 환경변수가 비어 있습니다.' },
      { status: 500 },
    );
  }

  const incomingAdminKey = request.headers.get('x-admin-key')?.trim();
  if (!incomingAdminKey || incomingAdminKey !== expectedAdminKey) {
    return NextResponse.json(
      { message: '관리자 저장 키가 올바르지 않습니다.' },
      { status: 401 },
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { message: getSupabaseConfigError() || 'Supabase 환경변수가 비어 있습니다.' },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: '잘못된 요청 형식입니다.' }, { status: 400 });
  }

  const content = (body as { content?: unknown })?.content;
  if (!isDemoContent(content)) {
    return NextResponse.json(
      { message: '저장할 콘텐츠 형식이 올바르지 않습니다.' },
      { status: 400 },
    );
  }

  const { error } = await supabase.from('demo_contents').upsert(
    {
      slug: CONTENT_SLUG,
      content,
      updated_by: 'admin-panel',
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'slug' },
  );

  if (error) {
    return NextResponse.json(
      { message: 'Supabase 저장에 실패했습니다. 테이블 구조를 확인해 주세요.' },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: 'Supabase에 실제 저장되었습니다.' });
}
