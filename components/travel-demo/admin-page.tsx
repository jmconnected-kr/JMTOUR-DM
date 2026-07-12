'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import styles from './admin.module.css';
import { DemoContent, useDemoContent } from './content-store';

type SectionKey = keyof DemoContent;

const sectionInfo: Array<{ key: SectionKey; title: string; desc: string; href: string }> = [
  { key: 'home', title: '홈', desc: '인사, 일정, 추천, 실시간 연결', href: '/home' },
  { key: 'schedule', title: '일정', desc: '장소, 이동, 지도, 컨디션 모드', href: '/schedule' },
  { key: 'connect', title: '커넥트', desc: '현지인 카드, Quick Talk, SOS', href: '/connect' },
  { key: 'play', title: '플레이', desc: '미션, 배지, 리뷰 전쟁, 앨범', href: '/play' },
  { key: 'my', title: 'MY', desc: 'QR, 기록, 포스터, 포토북, 설정', href: '/my' },
];

function linesToArray(value: string) {
  return value
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean);
}

function timelineToText(items: DemoContent['home']['timeline']) {
  return items.map((item) => `${item.time}|${item.title}|${item.description}`).join('\n');
}

function textToTimeline(value: string) {
  return linesToArray(value).map((line) => {
    const [time = '', title = '', description = ''] = line.split('|').map((s) => s.trim());
    return { time, title, description };
  });
}

function statsToText(items: Array<{ value: string; label: string }>) {
  return items.map((item) => `${item.value}|${item.label}`).join('\n');
}

function textToStats(value: string) {
  return linesToArray(value).map((line) => {
    const [v = '', l = ''] = line.split('|').map((s) => s.trim());
    return { value: v, label: l };
  });
}

function placesToText(items: Array<{ title: string; subtitle: string }>) {
  return items.map((item) => `${item.title}|${item.subtitle}`).join('\n');
}

function textToPlaces(value: string) {
  return linesToArray(value).map((line) => {
    const [title = '', subtitle = ''] = line.split('|').map((s) => s.trim());
    return { title, subtitle };
  });
}

function movesToText(items: Array<{ icon: string; title: string; description: string }>) {
  return items.map((item) => `${item.icon}|${item.title}|${item.description}`).join('\n');
}

function textToMoves(value: string) {
  return linesToArray(value).map((line) => {
    const [icon = '🚌', title = '', description = ''] = line.split('|').map((s) => s.trim());
    return { icon, title, description };
  });
}

function peopleToText(items: DemoContent['connect']['people']) {
  return items.map((item) => `${item.name}|${item.summary}|${item.emoji}`).join('\n');
}

function textToPeople(value: string, current: DemoContent['connect']['people']) {
  return linesToArray(value).map((line, index) => {
    const base = current[index] ?? current[0];
    const [name = '', summary = '', emoji = '☕'] = line.split('|').map((s) => s.trim());
    return {
      ...base,
      name,
      summary,
      emoji,
    };
  });
}

function emojiItemsToText(items: Array<{ emoji: string; label: string }>) {
  return items.map((item) => `${item.emoji}|${item.label}`).join('\n');
}

function textToEmojiItems(value: string) {
  return linesToArray(value).map((line) => {
    const [emoji = '✨', label = ''] = line.split('|').map((s) => s.trim());
    return { emoji, label };
  });
}

function posterItemsToText(items: Array<{ title: string; subtitle: string }>) {
  return items.map((item) => `${item.title}|${item.subtitle}`).join('\n');
}

function textToPosterItems(value: string) {
  return linesToArray(value).map((line) => {
    const [title = '', subtitle = ''] = line.split('|').map((s) => s.trim());
    return { title, subtitle };
  });
}

export function AdminPage() {
  const { content, setContent, resetContent } = useDemoContent();
  const [active, setActive] = useState<SectionKey>('home');

  const activeInfo = useMemo(() => sectionInfo.find((item) => item.key === active)!, [active]);

  const updateSection = <K extends SectionKey>(key: K, patch: Partial<DemoContent[K]>) => {
    setContent((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...patch,
      },
    }));
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.eyebrow}>Admin Studio</div>
          <div className={styles.title}>관리자 편집 페이지</div>
          <div className={styles.subtitle}>
            참여자 화면의 실제 노출 문구와 카드 구성을 같은 데이터로 묶어 두었습니다. 여기서 수정하면 현재 브라우저 기준으로 홈, 일정, 커넥트, 플레이, MY 화면에 바로 반영됩니다.
          </div>
        </section>

        <section className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.tabList}>
              {sectionInfo.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`${styles.tabButton} ${active === item.key ? styles.tabButtonActive : ''}`}
                  onClick={() => setActive(item.key)}
                >
                  <strong>{item.title}</strong>
                  <span>{item.desc}</span>
                </button>
              ))}
            </div>
            <div className={styles.sidebarActions}>
              <button type="button" className={styles.primary} onClick={resetContent}>기본값으로 되돌리기</button>
              <Link href={activeInfo.href} className={styles.linkBtn}>현재 화면 미리보기</Link>
            </div>
          </aside>

          <section className={styles.main}>
            <div className={styles.headerRow}>
              <div>
                <div className={styles.headerTitle}>{activeInfo.title} 편집</div>
                <div className={styles.headerMeta}>{activeInfo.desc}</div>
              </div>
              <div className={styles.previewLinks}>
                {sectionInfo.map((item) => (
                  <Link key={item.key} href={item.href}>{item.title} 보기</Link>
                ))}
              </div>
            </div>

            {active === 'home' && (
              <div className={styles.formGrid}>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>기본 정보</div>
                  <div className={styles.field}><label>인사 이름</label><input className={styles.input} value={content.home.greetingName} onChange={(e) => updateSection('home', { greetingName: e.target.value })} /></div>
                  <div className={styles.field}><label>상단 설명</label><input className={styles.input} value={content.home.subcopy} onChange={(e) => updateSection('home', { subcopy: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 제목</label><input className={styles.input} value={content.home.heroTitle} onChange={(e) => updateSection('home', { heroTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 설명</label><textarea className={styles.textarea} value={content.home.heroBody} onChange={(e) => updateSection('home', { heroBody: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 버튼들</label><textarea className={styles.textarea} value={content.home.heroActions.join('\n')} onChange={(e) => updateSection('home', { heroActions: linesToArray(e.target.value) })} /></div>
                </div>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>연결되는 참여자 화면 요소</div>
                  <div className={styles.field}><label>타임라인 (시간|제목|설명)</label><textarea className={styles.textarea} value={timelineToText(content.home.timeline)} onChange={(e) => updateSection('home', { timeline: textToTimeline(e.target.value) })} /></div>
                  <div className={styles.field}><label>추천 제목</label><input className={styles.input} value={content.home.recommendationTitle} onChange={(e) => updateSection('home', { recommendationTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>추천 설명</label><textarea className={styles.textarea} value={content.home.recommendationNote} onChange={(e) => updateSection('home', { recommendationNote: e.target.value })} /></div>
                  <div className={styles.field}><label>실시간 연결 수치</label><input className={styles.input} value={content.home.liveConnectionsValue} onChange={(e) => updateSection('home', { liveConnectionsValue: e.target.value })} /></div>
                  <div className={styles.field}><label>기록 통계 (값|라벨)</label><textarea className={styles.textarea} value={statsToText(content.home.recordStats)} onChange={(e) => updateSection('home', { recordStats: textToStats(e.target.value) })} /></div>
                </div>
              </div>
            )}

            {active === 'schedule' && (
              <div className={styles.formGrid}>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>상단 / Hero</div>
                  <div className={styles.field}><label>페이지 제목</label><input className={styles.input} value={content.schedule.title} onChange={(e) => updateSection('schedule', { title: e.target.value })} /></div>
                  <div className={styles.field}><label>상단 설명</label><input className={styles.input} value={content.schedule.subcopy} onChange={(e) => updateSection('schedule', { subcopy: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 제목</label><input className={styles.input} value={content.schedule.heroTitle} onChange={(e) => updateSection('schedule', { heroTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 설명</label><textarea className={styles.textarea} value={content.schedule.heroBody} onChange={(e) => updateSection('schedule', { heroBody: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 버튼들</label><textarea className={styles.textarea} value={content.schedule.heroActions.join('\n')} onChange={(e) => updateSection('schedule', { heroActions: linesToArray(e.target.value) })} /></div>
                </div>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>장소 / 이동 / 빠른실행</div>
                  <div className={styles.field}><label>방문 장소 (제목|부제)</label><textarea className={styles.textarea} value={placesToText(content.schedule.places)} onChange={(e) => updateSection('schedule', { places: textToPlaces(e.target.value) })} /></div>
                  <div className={styles.field}><label>장소 태그</label><textarea className={styles.textarea} value={content.schedule.placeTags.join('\n')} onChange={(e) => updateSection('schedule', { placeTags: linesToArray(e.target.value) })} /></div>
                  <div className={styles.field}><label>이동 정보 (아이콘|제목|설명)</label><textarea className={styles.textarea} value={movesToText(content.schedule.moves)} onChange={(e) => updateSection('schedule', { moves: textToMoves(e.target.value) })} /></div>
                  <div className={styles.field}><label>컨디션 모드 제목</label><input className={styles.input} value={content.schedule.conditionTitle} onChange={(e) => updateSection('schedule', { conditionTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>빠른 실행 버튼들</label><textarea className={styles.textarea} value={content.schedule.quickActions.join('\n')} onChange={(e) => updateSection('schedule', { quickActions: linesToArray(e.target.value) })} /></div>
                </div>
              </div>
            )}

            {active === 'connect' && (
              <div className={styles.formGrid}>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>커넥트 핵심 메시지</div>
                  <div className={styles.field}><label>상단 설명</label><input className={styles.input} value={content.connect.subcopy} onChange={(e) => updateSection('connect', { subcopy: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 제목</label><input className={styles.input} value={content.connect.heroTitle} onChange={(e) => updateSection('connect', { heroTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 설명</label><textarea className={styles.textarea} value={content.connect.heroBody} onChange={(e) => updateSection('connect', { heroBody: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 버튼들</label><textarea className={styles.textarea} value={content.connect.heroActions.join('\n')} onChange={(e) => updateSection('connect', { heroActions: linesToArray(e.target.value) })} /></div>
                  <div className={styles.field}><label>SOS 설명</label><textarea className={styles.textarea} value={content.connect.sosNote} onChange={(e) => updateSection('connect', { sosNote: e.target.value })} /></div>
                </div>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>현지인 / 레슨 / 소모임</div>
                  <div className={styles.field}><label>현지인 카드 (이름|요약|이모지)</label><textarea className={styles.textarea} value={peopleToText(content.connect.people)} onChange={(e) => updateSection('connect', { people: textToPeople(e.target.value, content.connect.people) })} /></div>
                  <div className={styles.field}><label>Quick Talk 주제</label><textarea className={styles.textarea} value={content.connect.quickTalkTopics.join('\n')} onChange={(e) => updateSection('connect', { quickTalkTopics: linesToArray(e.target.value) })} /></div>
                  <div className={styles.field}><label>SOS 버튼들</label><textarea className={styles.textarea} value={content.connect.sosTopics.join('\n')} onChange={(e) => updateSection('connect', { sosTopics: linesToArray(e.target.value) })} /></div>
                  <div className={styles.field}><label>소모임 제목</label><input className={styles.input} value={content.connect.meetupTitle} onChange={(e) => updateSection('connect', { meetupTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>소모임 설명</label><textarea className={styles.textarea} value={content.connect.meetupNote} onChange={(e) => updateSection('connect', { meetupNote: e.target.value })} /></div>
                </div>
              </div>
            )}

            {active === 'play' && (
              <div className={styles.formGrid}>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>미션 / 앨범</div>
                  <div className={styles.field}><label>상단 설명</label><input className={styles.input} value={content.play.subcopy} onChange={(e) => updateSection('play', { subcopy: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 제목</label><input className={styles.input} value={content.play.heroTitle} onChange={(e) => updateSection('play', { heroTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 설명</label><textarea className={styles.textarea} value={content.play.heroBody} onChange={(e) => updateSection('play', { heroBody: e.target.value })} /></div>
                  <div className={styles.field}><label>앨범 통계 (값|라벨)</label><textarea className={styles.textarea} value={statsToText(content.play.albumStats)} onChange={(e) => updateSection('play', { albumStats: textToStats(e.target.value) })} /></div>
                </div>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>인증 / 배지 / 리뷰전쟁</div>
                  <div className={styles.field}><label>지역 인증 (이모지|라벨)</label><textarea className={styles.textarea} value={emojiItemsToText(content.play.regionItems)} onChange={(e) => updateSection('play', { regionItems: textToEmojiItems(e.target.value) })} /></div>
                  <div className={styles.field}><label>새 배지 (이모지|라벨)</label><textarea className={styles.textarea} value={emojiItemsToText(content.play.badgeItems)} onChange={(e) => updateSection('play', { badgeItems: textToEmojiItems(e.target.value) })} /></div>
                  <div className={styles.field}><label>리뷰 왼쪽 제목</label><input className={styles.input} value={content.play.reviewLeftTitle} onChange={(e) => updateSection('play', { reviewLeftTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>리뷰 왼쪽 설명</label><input className={styles.input} value={content.play.reviewLeftNote} onChange={(e) => updateSection('play', { reviewLeftNote: e.target.value })} /></div>
                  <div className={styles.field}><label>리뷰 오른쪽 제목</label><input className={styles.input} value={content.play.reviewRightTitle} onChange={(e) => updateSection('play', { reviewRightTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>리뷰 오른쪽 설명</label><input className={styles.input} value={content.play.reviewRightNote} onChange={(e) => updateSection('play', { reviewRightNote: e.target.value })} /></div>
                </div>
              </div>
            )}

            {active === 'my' && (
              <div className={styles.formGrid}>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>기록 / QR</div>
                  <div className={styles.field}><label>상단 설명</label><input className={styles.input} value={content.my.subcopy} onChange={(e) => updateSection('my', { subcopy: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 제목</label><input className={styles.input} value={content.my.heroTitle} onChange={(e) => updateSection('my', { heroTitle: e.target.value })} /></div>
                  <div className={styles.field}><label>Hero 설명</label><textarea className={styles.textarea} value={content.my.heroBody} onChange={(e) => updateSection('my', { heroBody: e.target.value })} /></div>
                  <div className={styles.field}><label>방문 도시 수</label><input className={styles.input} value={content.my.cityCount} onChange={(e) => updateSection('my', { cityCount: e.target.value })} /></div>
                  <div className={styles.field}><label>방문 도시 설명</label><input className={styles.input} value={content.my.cityNames} onChange={(e) => updateSection('my', { cityNames: e.target.value })} /></div>
                  <div className={styles.field}><label>QR 설명</label><textarea className={styles.textarea} value={content.my.qrDescription} onChange={(e) => updateSection('my', { qrDescription: e.target.value })} /></div>
                </div>
                <div className={styles.panel}>
                  <div className={styles.panelTitle}>포스터 / 포토북 / 설정</div>
                  <div className={styles.field}><label>새 배지 수</label><input className={styles.input} value={content.my.badgeCount} onChange={(e) => updateSection('my', { badgeCount: e.target.value })} /></div>
                  <div className={styles.field}><label>새 배지 설명</label><input className={styles.input} value={content.my.badgeNames} onChange={(e) => updateSection('my', { badgeNames: e.target.value })} /></div>
                  <div className={styles.field}><label>포스터/포토북 (제목|부제)</label><textarea className={styles.textarea} value={posterItemsToText(content.my.posters)} onChange={(e) => updateSection('my', { posters: textToPosterItems(e.target.value) })} /></div>
                  <div className={styles.field}><label>설정 항목</label><textarea className={styles.textarea} value={content.my.settingItems.join('\n')} onChange={(e) => updateSection('my', { settingItems: linesToArray(e.target.value) })} /></div>
                </div>
              </div>
            )}

            <div className={styles.previewCard}>
              <strong>연동 체크 포인트</strong>
              <div className={styles.previewList}>
                <div>• 관리자 입력값은 현재 브라우저 기준으로 즉시 저장됩니다.</div>
                <div>• 참여자 페이지와 관리자 페이지가 같은 content store를 사용합니다.</div>
                <div>• 즉, 홈/일정/커넥트/플레이/MY에서 보이는 주요 문구와 리스트가 바로 반영됩니다.</div>
                <div>• 실제 운영용으로 가려면 다음 단계에서 이 store를 API/DB에 연결하면 됩니다.</div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
