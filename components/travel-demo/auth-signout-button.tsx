'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';

type Props = {
  className?: string;
  label?: string;
};

export function AuthSignOutButton({ className, label = '로그아웃' }: Props) {
  const router = useRouter();

  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.replace('/auth/login');
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
