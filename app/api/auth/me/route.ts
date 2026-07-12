import { NextResponse } from 'next/server';
import { getCurrentAuthContext } from '../../../../lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const context = await getCurrentAuthContext();

  if (!context) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    role: context.role,
    user: {
      id: context.user.id,
      email: context.user.email ?? '',
    },
  });
}
