'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type TimelineItem = { time: string; title: string; description: string };
export type SimpleStat = { value: string; label: string };
export type PlaceItem = { title: string; subtitle: string };
export type MoveItem = { icon: string; title: string; description: string };
export type PersonItem = {
  name: string;
  summary: string;
  emoji: string;
  bgStart: string;
  bgEnd: string;
  shirtStart: string;
  shirtEnd: string;
};
export type EmojiItem = { emoji: string; label: string };
export type PosterItem = { title: string; subtitle: string };

export type DemoContent = {
  home: {
    greetingName: string;
    subcopy: string;
    heroEyebrow: string;
    heroTitle: string;
    heroBody: string;
    heroActions: string[];
    timeline: TimelineItem[];
    recommendationTitle: string;
    recommendationNote: string;
    recommendationMeta: string;
    liveConnectionsValue: string;
    liveConnectionsNote: string;
    liveConnectionTags: string[];
    recordStats: SimpleStat[];
  };
  schedule: {
    title: string;
    subcopy: string;
    heroEyebrow: string;
    heroTitle: string;
    heroBody: string;
    heroActions: string[];
    places: PlaceItem[];
    placeTags: string[];
    moves: MoveItem[];
    mapMeta: string;
    conditionTitle: string;
    conditionNote: string;
    quickActions: string[];
  };
  connect: {
    title: string;
    subcopy: string;
    heroEyebrow: string;
    heroTitle: string;
    heroBody: string;
    heroActions: string[];
    people: PersonItem[];
    quickTalkTopics: string[];
    sosTopics: string[];
    sosNote: string;
    meetupTitle: string;
    meetupNote: string;
  };
  play: {
    title: string;
    subcopy: string;
    heroEyebrow: string;
    heroTitle: string;
    heroBody: string;
    heroActions: string[];
    albumStats: SimpleStat[];
    regionItems: EmojiItem[];
    badgeItems: EmojiItem[];
    reviewLeftTitle: string;
    reviewLeftNote: string;
    reviewRightTitle: string;
    reviewRightNote: string;
  };
  my: {
    title: string;
    subcopy: string;
    heroEyebrow: string;
    heroTitle: string;
    heroBody: string;
    heroActions: string[];
    cityCount: string;
    cityNames: string;
    badgeCount: string;
    badgeNames: string;
    qrTitle: string;
    qrDescription: string;
    posters: PosterItem[];
    settingItems: string[];
  };
};

export const defaultDemoContent: DemoContent = {
  home: {
    greetingName: 'Anna',
    subcopy: '부산 여행 · Day 2 · 26°C · 가벼운 구름 · 추천 3개',
    heroEyebrow: '오늘의 일정',
    heroTitle: '08:30 호텔 로비 출발',
    heroBody: '현지 가이드 체크인 후 해운대 컨벤션 센터로 이동합니다. 길 보기, 차량 확인, 도움 요청을 바로 실행할 수 있어요.',
    heroActions: ['길 보기', '차량 확인', '도움 요청'],
    timeline: [
      { time: '09:00', title: '바다 산책', description: '아침 컨디션 체크 · 짧은 이동 · 사진 스팟 추천 포함' },
      { time: '11:00', title: '현지 시장', description: '미션 사진 촬영 · 자유 탐방 40분 · Quick Talk 사용 가능' },
      { time: '15:00', title: '자유 시간', description: '커넥트 추천 · 카페 · 쇼핑 동선 · 비 올 때 대체 코스 제공' },
    ],
    recommendationTitle: '광안리 저녁 루프탑',
    recommendationNote: '현지인이 남긴 짧은 팁과 포토 노트가 함께 표시됩니다.',
    recommendationMeta: '오디오 3분',
    liveConnectionsValue: '7명',
    liveConnectionsNote: '현지인 4 · 언어 도움 3 · 평균 응답 2분',
    liveConnectionTags: ['🗣 5분 도움', '📍 근처 추천'],
    recordStats: [
      { value: '18', label: '사진' },
      { value: '3', label: '방문 장소' },
      { value: '1', label: '새 배지' },
    ],
  },
  schedule: {
    title: '나의 일정',
    subcopy: 'Day 2 · 7월 13일 화요일 · 부산 · 우천 시 실내 코스 자동 제안',
    heroEyebrow: '나의 일정',
    heroTitle: '오후 이동 2건',
    heroBody: '오전 미팅, 점심 자유 일정, 오후 해변 산책으로 이어집니다. 비 예보가 있으면 실내 카페와 아트센터 코스로 자동 전환됩니다.',
    heroActions: ['대체 코스', '이동 문의'],
    places: [
      { title: '컨벤션 센터', subtitle: '오전 미팅' },
      { title: '로컬 카페', subtitle: '점심 자유 일정' },
      { title: '해변 산책', subtitle: '오후 리프레시' },
    ],
    placeTags: ['🏛 컨벤션 센터', '☕ 로컬 카페', '🌊 해변 산책'],
    moves: [
      { icon: '🚌', title: '버스 A · 1층 동문', description: '픽업 12분 전 · 좌석 08:30 · 담당 가이드 연결 가능' },
      { icon: '🚶', title: '도보 이동 18분', description: '컨벤션 센터 → 해변 산책 구간 · 평지 위주 · 가족 이동 적합' },
    ],
    mapMeta: '현재 위치 포함',
    conditionTitle: '실내 카페 + 아트센터',
    conditionNote: '걷기 짧고 실내 비중 높은 코스를 우선 추천합니다.',
    quickActions: ['🧭 길 보기', '💬 이동 문의'],
  },
  connect: {
    title: '커넥트',
    subcopy: '현지인 7명 · 언어 도움 3명 · 평균 응답 2분',
    heroEyebrow: 'Local Connect',
    heroTitle: '현지인에게 바로 물어보기',
    heroBody: '5분 톡, 15분 소개 영상, 동네 산책, 짧은 Q&A까지 바로 연결됩니다. 언어 도움과 긴급 지원도 한 화면에서 접근할 수 있어요.',
    heroActions: ['현지인 연결', '5분 말하기', '도움 요청'],
    people: [
      { name: 'Mina', summary: '부산 맛집 · 한국어/영어 · 오후 가능', emoji: '☕', bgStart: '#5fb0ff', bgEnd: '#ffd56a', shirtStart: '#ffffff', shirtEnd: '#ff9d7f' },
      { name: 'Carlos', summary: '건축 산책 · 영어/스페인어 · 야간 산책', emoji: '📷', bgStart: '#61c792', bgEnd: '#6fbaff', shirtStart: '#ffffff', shirtEnd: '#8ddaff' },
    ],
    quickTalkTopics: ['택시', '호텔', '식당', '쇼핑'],
    sosTopics: ['🧳 분실', '🗺 길 잃음', '🆘 긴급', '🗣 언어'],
    sosNote: '지원 채팅, 번역 문장, 빠른 튜터링으로 바로 연결됩니다.',
    meetupTitle: '야간 산책 · 19:30',
    meetupNote: '현지인 1명 · 여행자 5명 · 해변 포토 스팟 포함 · 신고 기능 지원',
  },
  play: {
    title: '플레이',
    subcopy: '미션, 앨범, 리뷰 전쟁, 지역 인증으로 여행을 더 재밌게',
    heroEyebrow: '오늘의 미션',
    heroTitle: '부산에서 가장 마음에 드는 색 찾기',
    heroBody: '사진 1장 업로드 시 +10 포인트, 지역 조각 1개, 컬렉션 배지를 획득합니다. 재미와 기록이 함께 남는 플레이 허브예요.',
    heroActions: ['챌린지 시작', '사진 업로드'],
    albumStats: [
      { value: '8장', label: '새 사진' },
      { value: '3곳', label: '지역 인증' },
      { value: '2개', label: '새 배지' },
    ],
    regionItems: [
      { emoji: '📍', label: '3곳 완료' },
      { emoji: '🧩', label: '타일 2개' },
      { emoji: '🏁', label: '진행 62%' },
      { emoji: '✅', label: 'QR 인증' },
    ],
    badgeItems: [
      { emoji: '🏅', label: '해변 조각가' },
      { emoji: '🌊', label: '오션 러너' },
      { emoji: '📸', label: '포토 헌터' },
      { emoji: '🎨', label: '컬러 픽' },
    ],
    reviewLeftTitle: '🍲 현지 추천 국밥',
    reviewLeftNote: '62% · 깊은 맛 · 대기 12분',
    reviewRightTitle: '✨ 여행자 픽 브런치',
    reviewRightNote: '38% · 감성 공간 · 사진 맛집',
  },
  my: {
    title: 'MY',
    subcopy: 'QR, 기록, 보관함, 기념품까지 내 자산을 모으는 공간',
    heroEyebrow: '오늘의 기록',
    heroTitle: 'Anna’s Busan Journey',
    heroBody: '2026.07.12–07.15 · Haeundae · Yeongdo · Gijang · 사진 184장 · 방문 23곳',
    heroActions: ['기록 보기', '공유하기'],
    cityCount: '3곳',
    cityNames: '해운대 · 영도 · 기장',
    badgeCount: '2개',
    badgeNames: '컬러 픽 · 오션 러너',
    qrTitle: 'QR 열기',
    qrDescription: '버스 탑승, 현장 체크인, 지역 인증, 빠른 신원 확인에 사용합니다.',
    posters: [
      { title: '지도 포스터', subtitle: '방문 동선 시안' },
      { title: '포토북', subtitle: '사진 + 메모 자동 정리' },
    ],
    settingItems: ['언어', '알림', '프라이버시', '위치 공유'],
  },
};

type DemoContentContextValue = {
  content: DemoContent;
  setContent: React.Dispatch<React.SetStateAction<DemoContent>>;
  resetContent: () => void;
};

const DemoContentContext = createContext<DemoContentContextValue | null>(null);
const STORAGE_KEY = 'travel-demo-admin-content-v1';

export function DemoContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<DemoContent>(defaultDemoContent);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as DemoContent;
      setContent(parsed);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  }, [content]);

  const value = useMemo(
    () => ({
      content,
      setContent,
      resetContent: () => setContent(defaultDemoContent),
    }),
    [content],
  );

  return <DemoContentContext.Provider value={value}>{children}</DemoContentContext.Provider>;
}

export function useDemoContent() {
  const value = useContext(DemoContentContext);
  if (!value) throw new Error('useDemoContent must be used within DemoContentProvider');
  return value;
}
