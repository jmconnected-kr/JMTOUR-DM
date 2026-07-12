export const homeTimeline = [
  {
    time: '09:00',
    title: '바다 산책',
    description: '아침 컨디션 체크 · 짧은 이동 · 사진 스팟 추천 포함',
  },
  {
    time: '11:00',
    title: '현지 시장',
    description: '미션 사진 촬영 · 자유 탐방 40분 · Quick Talk 사용 가능',
  },
  {
    time: '15:00',
    title: '자유 시간',
    description: '커넥트 추천 · 카페 · 쇼핑 동선 · 비 올 때 대체 코스 제공',
  },
] as const;

export const scheduleMoves = [
  {
    icon: '🚌',
    title: '버스 A · 1층 동문',
    description: '픽업 12분 전 · 좌석 08:30 · 담당 가이드 연결 가능',
  },
  {
    icon: '🚶',
    title: '도보 이동 18분',
    description: '컨벤션 센터 → 해변 산책 구간 · 평지 위주 · 가족 이동 적합',
  },
] as const;

export const schedulePlaces = [
  {
    title: '컨벤션 센터',
    subtitle: '오전 미팅',
  },
  {
    title: '로컬 카페',
    subtitle: '점심 자유 일정',
  },
  {
    title: '해변 산책',
    subtitle: '오후 리프레시',
  },
] as const;

export const connectPeople = [
  {
    name: 'Mina',
    summary: '부산 맛집 · 한국어/영어 · 오후 가능',
    emoji: '☕',
    bgStart: '#5fb0ff',
    bgEnd: '#ffd56a',
    shirtStart: '#ffffff',
    shirtEnd: '#ff9d7f',
  },
  {
    name: 'Carlos',
    summary: '건축 산책 · 영어/스페인어 · 야간 산책',
    emoji: '📷',
    bgStart: '#61c792',
    bgEnd: '#6fbaff',
    shirtStart: '#ffffff',
    shirtEnd: '#8ddaff',
  },
] as const;

export const quickTalkTopics = ['택시', '호텔', '식당', '쇼핑'] as const;

export const sosTopics = ['🧳 분실', '🗺 길 잃음', '🆘 긴급', '🗣 언어'] as const;

export const playAlbumStats = [
  { value: '8장', label: '새 사진' },
  { value: '3곳', label: '지역 인증' },
  { value: '2개', label: '새 배지' },
] as const;

export const playBadgeItems = [
  { emoji: '🏅', label: '해변 조각가' },
  { emoji: '🌊', label: '오션 러너' },
  { emoji: '📸', label: '포토 헌터' },
  { emoji: '🎨', label: '컬러 픽' },
] as const;

export const mySettingItems = ['언어', '알림', '프라이버시', '위치 공유'] as const;

export const myPosterItems = [
  {
    title: '지도 포스터',
    subtitle: '방문 동선 시안',
  },
  {
    title: '포토북',
    subtitle: '사진 + 메모 자동 정리',
  },
] as const;
