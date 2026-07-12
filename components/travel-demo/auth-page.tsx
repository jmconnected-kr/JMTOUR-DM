'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '../../lib/supabase/client';
import styles from './auth-page.module.css';

type Mode = 'participant-login' | 'participant-signup' | 'admin-login';

export function AuthPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const initialMode = (searchParams.get('mode') as Mode) || 'participant-login';

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectByRole = async () => {
    const meResponse = await fetch('/api/auth/me', { cache: 'no-store' });
    if (!meResponse.ok) {
      router.replace('/auth/login');
      return;
    }

    const me = (await meResponse.json()) as { role: 'admin' | 'participant' };
    router.replace(me.role === 'admin' ? '/admin' : '/participant');
    router.refresh();
  };

  const handleLogin = async () => {
    setLoading(true);
    setMessage('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (mode !== 'admin-login') {
      await fetch('/api/auth/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: name, inviteCode }),
      });
    }

    await redirectByRole();
    setLoading(false);
  };

  const handleSignup = async () => {
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (!data.session) {
      setMessage('회원가입이 완료되었습니다. Supabase에서 이메일 인증을 켠 경우 메일 확인 후 로그인해 주세요.');
      setLoading(false);
      return;
    }

    await fetch('/api/auth/bootstrap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ displayName: name, inviteCode }),
    });

    await redirectByRole();
    setLoading(false);
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.eyebrow}>Supabase Auth</div>
          <h1>관리자 / 참여자 실제 로그인</h1>
          <p>
            관리자와 참여자 계정을 분리해 이메일·비밀번호로 로그인합니다. 참여자는 회원가입 후 자기 행사 정보와 일정을 수정할 수 있고,
            관리자는 행사 전체와 참여자 권한을 제어합니다.
          </p>
        </section>

        <section className={styles.card}>
          <div className={styles.tabRow}>
            <button type="button" className={`${styles.tab} ${mode === 'participant-login' ? styles.tabActive : ''}`} onClick={() => setMode('participant-login')}>참여자 로그인</button>
            <button type="button" className={`${styles.tab} ${mode === 'participant-signup' ? styles.tabActive : ''}`} onClick={() => setMode('participant-signup')}>참여자 회원가입</button>
            <button type="button" className={`${styles.tab} ${mode === 'admin-login' ? styles.tabActive : ''}`} onClick={() => setMode('admin-login')}>관리자 로그인</button>
          </div>

          {(mode === 'participant-signup' || mode === 'participant-login') && (
            <div className={styles.hint}>참여자는 가입 후 자동으로 participant 역할이 연결됩니다. 기존 행사 초대 코드가 있으면 함께 입력하세요.</div>
          )}

          {mode === 'participant-signup' && (
            <>
              <div className={styles.field}><label>이름</label><input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div className={styles.field}><label>초대 코드</label><input className={styles.input} value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="선택 입력" /></div>
            </>
          )}

          {mode === 'participant-login' && (
            <div className={styles.field}><label>초대 코드</label><input className={styles.input} value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="기존 계정 연결용, 없으면 비워도 됨" /></div>
          )}

          <div className={styles.field}><label>이메일</label><input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></div>
          <div className={styles.field}><label>비밀번호</label><input className={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} type="password" /></div>

          <button type="button" className={styles.primary} onClick={mode === 'participant-signup' ? handleSignup : handleLogin} disabled={loading}>
            {loading ? '처리 중...' : mode === 'participant-signup' ? '참여자 회원가입' : '로그인'}
          </button>

          {message && <div className={styles.message}>{message}</div>}

          <div className={styles.noteBox}>
            <strong>관리자 계정 안내</strong>
            <span>관리자 회원가입은 열어두지 않았습니다. Supabase Auth에서 계정을 만들고 SQL로 role을 admin으로 승격하면 됩니다.</span>
          </div>
        </section>
      </div>
    </main>
  );
}
