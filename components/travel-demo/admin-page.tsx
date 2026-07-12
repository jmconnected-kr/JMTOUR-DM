'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from './admin.module.css';
import { AuthSignOutButton } from './auth-signout-button';
import { DemoContent, DemoEvent, ParticipantAccount, useDemoContent } from './content-store';

type SectionKey = keyof DemoContent;
type AdminPanel = 'events' | 'accounts' | SectionKey;

type Props = {
  currentUserEmail: string;
};

const panelInfo: Array<{ key: AdminPanel; title: string; desc: string; href: string }> = [
  { key: 'events', title: '행사 관리', desc: '행사 등록, 수정, 공개 이벤트 전환', href: '/home' },
  { key: 'accounts', title: '참여자 계정', desc: '참여자 등록, 이메일, 권한 관리', href: '/participant' },
  { key: 'home', title: '홈', desc: '인사, 일정, 추천, 실시간 연결', href: '/home' },
  { key: 'schedule', title: '일정', desc: '장소, 이동, 지도, 컨디션 모드', href: '/schedule' },
  { key: 'connect', title: '커넥트', desc: '현지인 카드, Quick Talk, SOS', href: '/connect' },
  { key: 'play', title: '플레이', desc: '미션, 배지, 리뷰 전쟁, 앨범', href: '/play' },
  { key: 'my', title: 'MY', desc: 'QR, 기록, 포스터, 포토북, 설정', href: '/my' },
];

function linesToArray(value: string) {
  return value.split('\n').map((v) => v.trim()).filter(Boolean);
}
function timelineToText(items: DemoContent['home']['timeline']) { return items.map((item) => `${item.time}|${item.title}|${item.description}`).join('\n'); }
function textToTimeline(value: string) { return linesToArray(value).map((line) => { const [time = '', title = '', description = ''] = line.split('|').map((s) => s.trim()); return { time, title, description }; }); }
function statsToText(items: Array<{ value: string; label: string }>) { return items.map((item) => `${item.value}|${item.label}`).join('\n'); }
function textToStats(value: string) { return linesToArray(value).map((line) => { const [v = '', l = ''] = line.split('|').map((s) => s.trim()); return { value: v, label: l }; }); }
function placesToText(items: Array<{ title: string; subtitle: string }>) { return items.map((item) => `${item.title}|${item.subtitle}`).join('\n'); }
function textToPlaces(value: string) { return linesToArray(value).map((line) => { const [title = '', subtitle = ''] = line.split('|').map((s) => s.trim()); return { title, subtitle }; }); }
function movesToText(items: Array<{ icon: string; title: string; description: string }>) { return items.map((item) => `${item.icon}|${item.title}|${item.description}`).join('\n'); }
function textToMoves(value: string) { return linesToArray(value).map((line) => { const [icon = '🚌', title = '', description = ''] = line.split('|').map((s) => s.trim()); return { icon, title, description }; }); }
function peopleToText(items: DemoContent['connect']['people']) { return items.map((item) => `${item.name}|${item.summary}|${item.emoji}`).join('\n'); }
function textToPeople(value: string, current: DemoContent['connect']['people']) { return linesToArray(value).map((line, index) => { const base = current[index] ?? current[0]; const [name = '', summary = '', emoji = '☕'] = line.split('|').map((s) => s.trim()); return { ...base, name, summary, emoji }; }); }
function emojiItemsToText(items: Array<{ emoji: string; label: string }>) { return items.map((item) => `${item.emoji}|${item.label}`).join('\n'); }
function textToEmojiItems(value: string) { return linesToArray(value).map((line) => { const [emoji = '✨', label = ''] = line.split('|').map((s) => s.trim()); return { emoji, label }; }); }
function posterItemsToText(items: Array<{ title: string; subtitle: string }>) { return items.map((item) => `${item.title}|${item.subtitle}`).join('\n'); }
function textToPosterItems(value: string) { return linesToArray(value).map((line) => { const [title = '', subtitle = ''] = line.split('|').map((s) => s.trim()); return { title, subtitle }; }); }
function makeEmptyEvent(): DemoEvent { const id = `event-${Date.now()}`; return { id, title: '새 행사', location: '도시 / 장소', dateRange: '2026.09.01–09.03', theme: '테마 입력', status: '준비중', summary: '행사 소개를 입력하세요.', managerName: '운영자', participantCount: '0명' }; }
function makeEmptyAccount(eventId: string): ParticipantAccount { return { id: `participant-${Date.now()}`, name: 'New Participant', email: '', userId: '', inviteCode: `JOIN-${Date.now().toString().slice(-4)}`, role: 'participant', eventId, status: '등록 대기', headline: '참여자 소개를 입력하세요.', language: '한국어', note: '', canEditSharedPages: false, canEditSchedules: true, quickActions: ['일정 추가'], customSchedule: [] }; }

export function AdminPage({ currentUserEmail }: Props) {
  const { workspace, activeEvent, content, setActiveEventId, upsertEvent, removeEvent, upsertAccount, removeAccount, updateActivePageSection, resetContent, reloadFromRemote, saveToRemote, isLoading, isSaving, saveMessage, remoteLoaded, backendConfigured } = useDemoContent();
  const [active, setActive] = useState<AdminPanel>('events');
  const [selectedAccountId, setSelectedAccountId] = useState<string>(workspace.accounts[0]?.id ?? '');

  const activeInfo = useMemo(() => panelInfo.find((item) => item.key === active)!, [active]);
  const selectedAccount = useMemo(() => workspace.accounts.find((account) => account.id === selectedAccountId) ?? workspace.accounts[0] ?? null, [workspace.accounts, selectedAccountId]);
  const connectionLabel = backendConfigured ? (remoteLoaded ? 'Supabase 연결됨' : 'Supabase 테이블 확인 필요') : 'Supabase 설정 필요';
  const connectionTone = backendConfigured && remoteLoaded ? styles.statusOk : styles.statusWarn;

  const updateEvent = (patch: Partial<DemoEvent>) => upsertEvent({ ...activeEvent, ...patch });
  const updateAccount = (patch: Partial<ParticipantAccount>) => selectedAccount && upsertAccount({ ...selectedAccount, ...patch });

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.eyebrow}>Admin Studio</div>
          <div className={styles.title}>관리자 행사 컨트롤 센터</div>
          <div className={styles.subtitle}>로그인한 관리자 계정으로 행사, 참여자, 전체 페이지를 통합 관리합니다.</div>
        </section>

        <section className={`${styles.previewCard} ${styles.saveBar}`}>
          <div className={styles.statusRow}>
            <span className={`${styles.statusBadge} ${connectionTone}`}>{connectionLabel}</span>
            <span className={styles.saveMeta}>{isLoading ? '불러오는 중...' : saveMessage || '상태 대기 중'}</span>
          </div>
          <div className={styles.actionRow}>
            <div className={styles.fieldInline}>
              <label>로그인 관리자</label>
              <input className={`${styles.input} ${styles.secureInput}`} value={currentUserEmail} readOnly />
            </div>
            <button type="button" className={styles.primary} onClick={() => saveToRemote('admin')} disabled={isSaving || isLoading}>{isSaving ? '저장 중...' : '관리자 저장'}</button>
            <button type="button" className={styles.secondary} onClick={reloadFromRemote} disabled={isSaving || isLoading}>원격 다시 불러오기</button>
            <AuthSignOutButton className={styles.secondary} />
          </div>
        </section>

        <section className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarGroup}>
              <div className={styles.sidebarLabel}>현재 공개 행사</div>
              <select className={styles.select} value={workspace.activeEventId} onChange={(e) => setActiveEventId(e.target.value)}>
                {workspace.events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}
              </select>
              <div className={styles.hint}>공개 행사 변경 시 참여자 화면도 같은 데이터로 전환됩니다.</div>
            </div>

            <div className={styles.tabList}>
              {panelInfo.map((item) => (
                <button key={item.key} type="button" className={`${styles.tabButton} ${active === item.key ? styles.tabButtonActive : ''}`} onClick={() => setActive(item.key)}>
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </button>
              ))}
            </div>
            <div className={styles.sidebarActions}>
              <button type="button" className={styles.primary} onClick={resetContent}>기본 데모로 되돌리기</button>
              <Link href={activeInfo.href} className={styles.linkBtn}>현재 화면 미리보기</Link>
              <Link href="/participant" className={styles.linkBtn}>참여자 페이지 보기</Link>
            </div>
          </aside>

          <section className={styles.main}>
            <div className={styles.headerRow}>
              <div><div className={styles.headerTitle}>{activeInfo.title}</div><div className={styles.headerMeta}>{activeInfo.desc}</div></div>
              <div className={styles.previewLinks}>{panelInfo.filter((item) => !['events', 'accounts'].includes(item.key)).map((item) => <Link key={item.key} href={item.href}>{item.title} 보기</Link>)}</div>
            </div>

            {active === 'events' && (
              <div className={styles.formGrid}>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>행사 목록</div>
                  <div className={styles.cardList}>{workspace.events.map((event) => <button key={event.id} type="button" className={`${styles.itemButton} ${workspace.activeEventId === event.id ? styles.itemButtonActive : ''}`} onClick={() => setActiveEventId(event.id)}><strong>{event.title}</strong><span>{event.dateRange} · {event.location}</span></button>)}</div>
                  <div className={styles.inlineActions}><button type="button" className={styles.secondary} onClick={() => { const next = makeEmptyEvent(); upsertEvent(next); setActiveEventId(next.id); }}>새 행사 추가</button><button type="button" className={styles.secondary} onClick={() => removeEvent(activeEvent.id)}>현재 행사 삭제</button></div>
                </div>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>현재 행사 정보</div>
                  <div className={styles.field}><label>행사 ID</label><input className={styles.input} value={activeEvent.id} readOnly /></div>
                  <div className={styles.field}><label>행사명</label><input className={styles.input} value={activeEvent.title} onChange={(e) => updateEvent({ title: e.target.value })} /></div>
                  <div className={styles.field}><label>장소</label><input className={styles.input} value={activeEvent.location} onChange={(e) => updateEvent({ location: e.target.value })} /></div>
                  <div className={styles.field}><label>일정 범위</label><input className={styles.input} value={activeEvent.dateRange} onChange={(e) => updateEvent({ dateRange: e.target.value })} /></div>
                  <div className={styles.field}><label>테마</label><input className={styles.input} value={activeEvent.theme} onChange={(e) => updateEvent({ theme: e.target.value })} /></div>
                  <div className={styles.field}><label>상태</label><input className={styles.input} value={activeEvent.status} onChange={(e) => updateEvent({ status: e.target.value })} /></div>
                  <div className={styles.field}><label>운영자</label><input className={styles.input} value={activeEvent.managerName} onChange={(e) => updateEvent({ managerName: e.target.value })} /></div>
                  <div className={styles.field}><label>참여 인원</label><input className={styles.input} value={activeEvent.participantCount} onChange={(e) => updateEvent({ participantCount: e.target.value })} /></div>
                  <div className={styles.field}><label>행사 소개</label><textarea className={styles.textarea} value={activeEvent.summary} onChange={(e) => updateEvent({ summary: e.target.value })} /></div>
                </div>
              </div>
            )}

            {active === 'accounts' && (
              <div className={styles.formGrid}>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>참여자 계정 목록</div>
                  <div className={styles.cardList}>{workspace.accounts.map((account) => <button key={account.id} type="button" className={`${styles.itemButton} ${selectedAccount?.id === account.id ? styles.itemButtonActive : ''}`} onClick={() => setSelectedAccountId(account.id)}><strong>{account.name}</strong><span>{account.email || '이메일 미연결'} · {account.status}</span></button>)}</div>
                  <div className={styles.inlineActions}><button type="button" className={styles.secondary} onClick={() => { const next = makeEmptyAccount(workspace.activeEventId); upsertAccount(next); setSelectedAccountId(next.id); }}>참여자 추가</button>{selectedAccount && <button type="button" className={styles.secondary} onClick={() => removeAccount(selectedAccount.id)}>선택 계정 삭제</button>}</div>
                </div>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>참여자 상세</div>
                  {selectedAccount ? <>
                    <div className={styles.field}><label>이름</label><input className={styles.input} value={selectedAccount.name} onChange={(e) => updateAccount({ name: e.target.value })} /></div>
                    <div className={styles.field}><label>이메일</label><input className={styles.input} value={selectedAccount.email} onChange={(e) => updateAccount({ email: e.target.value })} /></div>
                    <div className={styles.field}><label>연결된 User ID</label><input className={styles.input} value={selectedAccount.userId} onChange={(e) => updateAccount({ userId: e.target.value })} /></div>
                    <div className={styles.field}><label>초대 코드</label><input className={styles.input} value={selectedAccount.inviteCode} onChange={(e) => updateAccount({ inviteCode: e.target.value })} /></div>
                    <div className={styles.field}><label>소속 행사</label><select className={styles.select} value={selectedAccount.eventId} onChange={(e) => updateAccount({ eventId: e.target.value })}>{workspace.events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select></div>
                    <div className={styles.field}><label>상태</label><input className={styles.input} value={selectedAccount.status} onChange={(e) => updateAccount({ status: e.target.value })} /></div>
                    <div className={styles.field}><label>소개</label><input className={styles.input} value={selectedAccount.headline} onChange={(e) => updateAccount({ headline: e.target.value })} /></div>
                    <div className={styles.field}><label>사용 언어</label><input className={styles.input} value={selectedAccount.language} onChange={(e) => updateAccount({ language: e.target.value })} /></div>
                    <div className={styles.field}><label>메모</label><textarea className={styles.textarea} value={selectedAccount.note} onChange={(e) => updateAccount({ note: e.target.value })} /></div>
                    <div className={styles.checkRow}><label><input type="checkbox" checked={selectedAccount.canEditSchedules} onChange={(e) => updateAccount({ canEditSchedules: e.target.checked })} /> 일정 편집 허용</label><label><input type="checkbox" checked={selectedAccount.canEditSharedPages} onChange={(e) => updateAccount({ canEditSharedPages: e.target.checked })} /> 공유 페이지 편집 허용</label></div>
                    <div className={styles.field}><label>빠른 액션</label><textarea className={styles.textarea} value={selectedAccount.quickActions.join('\n')} onChange={(e) => updateAccount({ quickActions: linesToArray(e.target.value) })} /></div>
                    <div className={styles.field}><label>개인 일정</label><textarea className={styles.textarea} value={timelineToText(selectedAccount.customSchedule)} onChange={(e) => updateAccount({ customSchedule: textToTimeline(e.target.value) })} /></div>
                  </> : <div className={styles.hint}>아직 생성된 참여자 계정이 없습니다.</div>}
                </div>
              </div>
            )}

            {active === 'home' && <div className={styles.formGrid}><div className={styles.panel}><div className={styles.panelTitle}>홈 상단</div><div className={styles.field}><label>인사 이름</label><input className={styles.input} value={content.home.greetingName} onChange={(e) => updateActivePageSection('home', { greetingName: e.target.value })} /></div><div className={styles.field}><label>상단 설명</label><input className={styles.input} value={content.home.subcopy} onChange={(e) => updateActivePageSection('home', { subcopy: e.target.value })} /></div><div className={styles.field}><label>Hero 제목</label><input className={styles.input} value={content.home.heroTitle} onChange={(e) => updateActivePageSection('home', { heroTitle: e.target.value })} /></div><div className={styles.field}><label>Hero 설명</label><textarea className={styles.textarea} value={content.home.heroBody} onChange={(e) => updateActivePageSection('home', { heroBody: e.target.value })} /></div><div className={styles.field}><label>Hero 버튼들</label><textarea className={styles.textarea} value={content.home.heroActions.join('\n')} onChange={(e) => updateActivePageSection('home', { heroActions: linesToArray(e.target.value) })} /></div></div><div className={styles.panel}><div className={styles.panelTitle}>홈 상세</div><div className={styles.field}><label>타임라인</label><textarea className={styles.textarea} value={timelineToText(content.home.timeline)} onChange={(e) => updateActivePageSection('home', { timeline: textToTimeline(e.target.value) })} /></div><div className={styles.field}><label>추천 제목</label><input className={styles.input} value={content.home.recommendationTitle} onChange={(e) => updateActivePageSection('home', { recommendationTitle: e.target.value })} /></div><div className={styles.field}><label>추천 설명</label><textarea className={styles.textarea} value={content.home.recommendationNote} onChange={(e) => updateActivePageSection('home', { recommendationNote: e.target.value })} /></div><div className={styles.field}><label>실시간 연결 수치</label><input className={styles.input} value={content.home.liveConnectionsValue} onChange={(e) => updateActivePageSection('home', { liveConnectionsValue: e.target.value })} /></div><div className={styles.field}><label>기록 통계</label><textarea className={styles.textarea} value={statsToText(content.home.recordStats)} onChange={(e) => updateActivePageSection('home', { recordStats: textToStats(e.target.value) })} /></div></div></div>}
            {active === 'schedule' && <div className={styles.formGrid}><div className={styles.panel}><div className={styles.panelTitle}>일정 Hero</div><div className={styles.field}><label>페이지 제목</label><input className={styles.input} value={content.schedule.title} onChange={(e) => updateActivePageSection('schedule', { title: e.target.value })} /></div><div className={styles.field}><label>상단 설명</label><input className={styles.input} value={content.schedule.subcopy} onChange={(e) => updateActivePageSection('schedule', { subcopy: e.target.value })} /></div><div className={styles.field}><label>Hero 제목</label><input className={styles.input} value={content.schedule.heroTitle} onChange={(e) => updateActivePageSection('schedule', { heroTitle: e.target.value })} /></div><div className={styles.field}><label>Hero 설명</label><textarea className={styles.textarea} value={content.schedule.heroBody} onChange={(e) => updateActivePageSection('schedule', { heroBody: e.target.value })} /></div></div><div className={styles.panel}><div className={styles.panelTitle}>장소 / 이동</div><div className={styles.field}><label>방문 장소</label><textarea className={styles.textarea} value={placesToText(content.schedule.places)} onChange={(e) => updateActivePageSection('schedule', { places: textToPlaces(e.target.value) })} /></div><div className={styles.field}><label>장소 태그</label><textarea className={styles.textarea} value={content.schedule.placeTags.join('\n')} onChange={(e) => updateActivePageSection('schedule', { placeTags: linesToArray(e.target.value) })} /></div><div className={styles.field}><label>이동 정보</label><textarea className={styles.textarea} value={movesToText(content.schedule.moves)} onChange={(e) => updateActivePageSection('schedule', { moves: textToMoves(e.target.value) })} /></div><div className={styles.field}><label>컨디션 모드 제목</label><input className={styles.input} value={content.schedule.conditionTitle} onChange={(e) => updateActivePageSection('schedule', { conditionTitle: e.target.value })} /></div><div className={styles.field}><label>빠른 실행 버튼</label><textarea className={styles.textarea} value={content.schedule.quickActions.join('\n')} onChange={(e) => updateActivePageSection('schedule', { quickActions: linesToArray(e.target.value) })} /></div></div></div>}
            {active === 'connect' && <div className={styles.formGrid}><div className={styles.panel}><div className={styles.panelTitle}>커넥트 메시지</div><div className={styles.field}><label>상단 설명</label><input className={styles.input} value={content.connect.subcopy} onChange={(e) => updateActivePageSection('connect', { subcopy: e.target.value })} /></div><div className={styles.field}><label>Hero 제목</label><input className={styles.input} value={content.connect.heroTitle} onChange={(e) => updateActivePageSection('connect', { heroTitle: e.target.value })} /></div><div className={styles.field}><label>Hero 설명</label><textarea className={styles.textarea} value={content.connect.heroBody} onChange={(e) => updateActivePageSection('connect', { heroBody: e.target.value })} /></div><div className={styles.field}><label>SOS 설명</label><textarea className={styles.textarea} value={content.connect.sosNote} onChange={(e) => updateActivePageSection('connect', { sosNote: e.target.value })} /></div></div><div className={styles.panel}><div className={styles.panelTitle}>현지인 / 토픽</div><div className={styles.field}><label>현지인 카드</label><textarea className={styles.textarea} value={peopleToText(content.connect.people)} onChange={(e) => updateActivePageSection('connect', { people: textToPeople(e.target.value, content.connect.people) })} /></div><div className={styles.field}><label>Quick Talk</label><textarea className={styles.textarea} value={content.connect.quickTalkTopics.join('\n')} onChange={(e) => updateActivePageSection('connect', { quickTalkTopics: linesToArray(e.target.value) })} /></div><div className={styles.field}><label>SOS 버튼</label><textarea className={styles.textarea} value={content.connect.sosTopics.join('\n')} onChange={(e) => updateActivePageSection('connect', { sosTopics: linesToArray(e.target.value) })} /></div><div className={styles.field}><label>소모임 제목</label><input className={styles.input} value={content.connect.meetupTitle} onChange={(e) => updateActivePageSection('connect', { meetupTitle: e.target.value })} /></div></div></div>}
            {active === 'play' && <div className={styles.formGrid}><div className={styles.panel}><div className={styles.panelTitle}>플레이 Hero</div><div className={styles.field}><label>상단 설명</label><input className={styles.input} value={content.play.subcopy} onChange={(e) => updateActivePageSection('play', { subcopy: e.target.value })} /></div><div className={styles.field}><label>Hero 제목</label><input className={styles.input} value={content.play.heroTitle} onChange={(e) => updateActivePageSection('play', { heroTitle: e.target.value })} /></div><div className={styles.field}><label>Hero 설명</label><textarea className={styles.textarea} value={content.play.heroBody} onChange={(e) => updateActivePageSection('play', { heroBody: e.target.value })} /></div><div className={styles.field}><label>앨범 통계</label><textarea className={styles.textarea} value={statsToText(content.play.albumStats)} onChange={(e) => updateActivePageSection('play', { albumStats: textToStats(e.target.value) })} /></div></div><div className={styles.panel}><div className={styles.panelTitle}>배지 / 리뷰전쟁</div><div className={styles.field}><label>지역 인증</label><textarea className={styles.textarea} value={emojiItemsToText(content.play.regionItems)} onChange={(e) => updateActivePageSection('play', { regionItems: textToEmojiItems(e.target.value) })} /></div><div className={styles.field}><label>새 배지</label><textarea className={styles.textarea} value={emojiItemsToText(content.play.badgeItems)} onChange={(e) => updateActivePageSection('play', { badgeItems: textToEmojiItems(e.target.value) })} /></div><div className={styles.field}><label>리뷰 왼쪽 제목</label><input className={styles.input} value={content.play.reviewLeftTitle} onChange={(e) => updateActivePageSection('play', { reviewLeftTitle: e.target.value })} /></div><div className={styles.field}><label>리뷰 오른쪽 제목</label><input className={styles.input} value={content.play.reviewRightTitle} onChange={(e) => updateActivePageSection('play', { reviewRightTitle: e.target.value })} /></div></div></div>}
            {active === 'my' && <div className={styles.formGrid}><div className={styles.panel}><div className={styles.panelTitle}>MY 핵심</div><div className={styles.field}><label>상단 설명</label><input className={styles.input} value={content.my.subcopy} onChange={(e) => updateActivePageSection('my', { subcopy: e.target.value })} /></div><div className={styles.field}><label>Hero 제목</label><input className={styles.input} value={content.my.heroTitle} onChange={(e) => updateActivePageSection('my', { heroTitle: e.target.value })} /></div><div className={styles.field}><label>Hero 설명</label><textarea className={styles.textarea} value={content.my.heroBody} onChange={(e) => updateActivePageSection('my', { heroBody: e.target.value })} /></div><div className={styles.field}><label>QR 설명</label><textarea className={styles.textarea} value={content.my.qrDescription} onChange={(e) => updateActivePageSection('my', { qrDescription: e.target.value })} /></div></div><div className={styles.panel}><div className={styles.panelTitle}>포스터 / 설정</div><div className={styles.field}><label>도시 수</label><input className={styles.input} value={content.my.cityCount} onChange={(e) => updateActivePageSection('my', { cityCount: e.target.value })} /></div><div className={styles.field}><label>도시명</label><input className={styles.input} value={content.my.cityNames} onChange={(e) => updateActivePageSection('my', { cityNames: e.target.value })} /></div><div className={styles.field}><label>새 배지</label><input className={styles.input} value={content.my.badgeNames} onChange={(e) => updateActivePageSection('my', { badgeNames: e.target.value })} /></div><div className={styles.field}><label>포스터 / 포토북</label><textarea className={styles.textarea} value={posterItemsToText(content.my.posters)} onChange={(e) => updateActivePageSection('my', { posters: textToPosterItems(e.target.value) })} /></div><div className={styles.field}><label>설정 항목</label><textarea className={styles.textarea} value={content.my.settingItems.join('\n')} onChange={(e) => updateActivePageSection('my', { settingItems: linesToArray(e.target.value) })} /></div></div></div>}

            <div className={styles.previewCard}><strong>연동 체크 포인트</strong><div className={styles.previewList}><div>• 관리자는 행사 등록, 참여자 이메일 연결, 공개 행사 전환을 담당합니다.</div><div>• 참여자는 이메일·비밀번호 로그인 후 자기 행사 정보와 개인 일정을 수정합니다.</div><div>• 공유 편집 권한을 켜면 참여자도 행사 페이지 문구와 일정 일부를 수정할 수 있습니다.</div><div>• 저장 후에는 /admin, /participant, /home, /schedule, /connect, /play, /my가 모두 같은 Supabase 데이터를 봅니다.</div></div></div>
          </section>
        </section>
      </div>
    </main>
  );
}
