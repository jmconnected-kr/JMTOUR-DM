'use client';

import Link from 'next/link';
import styles from './participant.module.css';
import { AuthSignOutButton } from './auth-signout-button';
import { type DemoContent, useDemoContent } from './content-store';

type Props = {
  currentUserId: string;
  currentUserEmail: string;
  currentRole: 'admin' | 'participant';
};

function linesToArray(value: string) {
  return value.split('\n').map((v) => v.trim()).filter(Boolean);
}

function timelineToText(items: Array<{ time: string; title: string; description: string }>) {
  return items.map((item) => `${item.time}|${item.title}|${item.description}`).join('\n');
}

function textToTimeline(value: string) {
  return linesToArray(value).map((line) => {
    const [time = '', title = '', description = ''] = line.split('|').map((s) => s.trim());
    return { time, title, description };
  });
}

function placesToText(items: DemoContent['schedule']['places']) {
  return items.map((item) => `${item.title}|${item.subtitle}`).join('\n');
}

function textToPlaces(value: string) {
  return linesToArray(value).map((line) => {
    const [title = '', subtitle = ''] = line.split('|').map((s) => s.trim());
    return { title, subtitle };
  });
}

export function ParticipantPage({ currentUserId, currentUserEmail, currentRole }: Props) {
  const { workspace, setWorkspace, saveToRemote, reloadFromRemote, isSaving, saveMessage, isLoading } = useDemoContent();

  const participant = workspace.accounts.find((account) => account.userId === currentUserId || (currentUserEmail && account.email.toLowerCase() === currentUserEmail.toLowerCase())) ?? null;
  const event = participant ? workspace.events.find((item) => item.id === participant.eventId) ?? workspace.events[0] : null;
  const eventContent = event ? workspace.pagesByEvent[event.id] : null;

  const updateParticipant = (patch: Record<string, unknown>) => {
    if (!participant) return;
    setWorkspace((prev) => ({
      ...prev,
      accounts: prev.accounts.map((account) => (account.id === participant.id ? { ...account, ...patch } : account)),
      activeEventId: typeof patch.eventId === 'string' ? patch.eventId : prev.activeEventId,
    }));
  };

  const updateParticipantEventSection = <K extends keyof DemoContent>(key: K, patch: Partial<DemoContent[K]>) => {
    if (!participant || !eventContent || !event) return;
    setWorkspace((prev) => ({
      ...prev,
      activeEventId: event.id,
      pagesByEvent: {
        ...prev.pagesByEvent,
        [event.id]: {
          ...eventContent,
          [key]: {
            ...eventContent[key],
            ...patch,
          },
        },
      },
    }));
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div>
            <div className={styles.eyebrow}>Participant Workspace</div>
            <h1>참여자 페이지</h1>
            <p>로그인한 참여자는 자신의 행사 등록 정보, 개인 일정, 메모를 수정하고 권한이 있으면 공유 행사 내용도 편집할 수 있습니다.</p>
          </div>
          <div className={styles.heroLinks}>
            {currentRole === 'admin' ? <Link href="/admin">관리자 페이지</Link> : <Link href="/home">공개 홈 보기</Link>}
            <AuthSignOutButton className={styles.secondary} />
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionTitle}>로그인 계정</div>
          <div className={styles.hint}>{currentUserEmail}</div>
          {currentRole === 'admin' && <div className={styles.hint}>관리자 계정으로 로그인되어 있습니다. 실제 참여자 경험은 참여자 계정으로 확인하세요.</div>}
        </section>

        {!participant && (
          <section className={styles.card}>
            <div className={styles.sectionTitle}>연결된 참여자 정보 없음</div>
            <div className={styles.hint}>이 계정은 아직 행사 참여자 계정과 연결되지 않았습니다. 참여자 회원가입을 다시 진행하거나 관리자 페이지에서 이메일을 연결해 주세요.</div>
          </section>
        )}

        {participant && event && eventContent && (
          <div className={styles.grid}>
            <section className={styles.card}>
              <div className={styles.sectionTitle}>내 계정 / 행사 등록</div>
              <div className={styles.field}><label>이름</label><input className={styles.input} value={participant.name} onChange={(e) => updateParticipant({ name: e.target.value })} /></div>
              <div className={styles.field}><label>이메일</label><input className={styles.input} value={participant.email} readOnly /></div>
              <div className={styles.field}><label>한줄 소개</label><input className={styles.input} value={participant.headline} onChange={(e) => updateParticipant({ headline: e.target.value })} /></div>
              <div className={styles.field}><label>언어</label><input className={styles.input} value={participant.language} onChange={(e) => updateParticipant({ language: e.target.value })} /></div>
              <div className={styles.field}><label>참여 상태</label><input className={styles.input} value={participant.status} onChange={(e) => updateParticipant({ status: e.target.value })} /></div>
              <div className={styles.field}><label>등록 행사</label><select className={styles.select} value={participant.eventId} onChange={(e) => updateParticipant({ eventId: e.target.value })}>{workspace.events.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></div>
              <div className={styles.field}><label>내 메모</label><textarea className={styles.textarea} value={participant.note} onChange={(e) => updateParticipant({ note: e.target.value })} /></div>
              <div className={styles.tagRow}>{participant.quickActions.map((item) => <span key={item} className={styles.tag}>{item}</span>)}</div>
            </section>

            <section className={styles.card}>
              <div className={styles.sectionTitle}>내 일정 등록 / 수정</div>
              <div className={styles.metaBox}><strong>{event.title}</strong><span>{event.dateRange} · {event.location}</span><p>{event.summary}</p></div>
              <div className={styles.field}><label>개인 일정 (시간|제목|설명)</label><textarea className={styles.textarea} value={timelineToText(participant.customSchedule)} onChange={(e) => updateParticipant({ customSchedule: textToTimeline(e.target.value) })} /></div>
              <div className={styles.field}><label>빠른 액션</label><textarea className={styles.textarea} value={participant.quickActions.join('\n')} onChange={(e) => updateParticipant({ quickActions: linesToArray(e.target.value) })} /></div>
            </section>

            <section className={styles.cardWide}>
              <div className={styles.sectionTitle}>권한 및 공유 편집</div>
              <div className={styles.permissionRow}>
                <span className={styles.permissionBadge}>{participant.canEditSchedules ? '일정 편집 가능' : '일정 편집 제한'}</span>
                <span className={styles.permissionBadge}>{participant.canEditSharedPages ? '공유 페이지 편집 가능' : '공유 페이지 편집 제한'}</span>
              </div>

              {participant.canEditSchedules && (
                <div className={styles.editBlock}>
                  <div className={styles.blockTitle}>행사 일정 카드 편집</div>
                  <div className={styles.field}><label>일정 Hero 제목</label><input className={styles.input} value={eventContent.schedule.heroTitle} onChange={(e) => updateParticipantEventSection('schedule', { heroTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>방문 장소 (제목|부제)</label><textarea className={styles.textarea} value={placesToText(eventContent.schedule.places)} onChange={(e) => updateParticipantEventSection('schedule', { places: textToPlaces(e.target.value) })} /></div>
                </div>
              )}

              {participant.canEditSharedPages && (
                <div className={styles.editBlock}>
                  <div className={styles.blockTitle}>공유 홈 편집</div>
                  <div className={styles.field}><label>홈 Hero 제목</label><input className={styles.input} value={eventContent.home.heroTitle} onChange={(e) => updateParticipantEventSection('home', { heroTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>홈 Hero 설명</label><textarea className={styles.textarea} value={eventContent.home.heroBody} onChange={(e) => updateParticipantEventSection('home', { heroBody: e.target.value })} /></div>
                </div>
              )}
            </section>

            <section className={styles.cardWide}>
              <div className={styles.actionBar}>
                <button type="button" className={styles.primary} onClick={() => saveToRemote('participant')} disabled={isSaving || isLoading}>{isSaving ? '저장 중...' : '참여자 변경사항 저장'}</button>
                <button type="button" className={styles.secondary} onClick={reloadFromRemote} disabled={isSaving || isLoading}>원격 다시 불러오기</button>
              </div>
              <div className={styles.hint}>{saveMessage}</div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
