import React from 'react';

type SvgProps = React.SVGProps<SVGSVGElement>;

export function HomeHeroArt(props: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" {...props}>
      <rect width="120" height="120" rx="20" fill="rgba(255,255,255,0.14)" />
      <rect x="0" y="78" width="120" height="42" fill="rgba(255,219,122,0.78)" />
      <rect x="0" y="52" width="120" height="28" fill="rgba(110,189,255,0.46)" />
      <circle cx="95" cy="24" r="12" fill="rgba(255,219,122,0.95)" />
      <rect x="16" y="54" width="26" height="26" fill="rgba(255,132,108,0.88)" />
      <rect x="28" y="42" width="26" height="38" fill="rgba(255,246,228,0.96)" />
      <rect x="58" y="56" width="24" height="24" fill="rgba(255,246,228,0.96)" />
      <rect x="76" y="44" width="18" height="36" fill="rgba(35,98,180,0.88)" />
      <path d="M10 85 C30 70, 40 92, 64 76 S104 70, 118 86" stroke="rgba(255,255,255,0.8)" strokeWidth="4" fill="none" />
    </svg>
  );
}

export function HomeRecoArt(props: SvgProps) {
  return (
    <svg viewBox="0 0 320 180" aria-hidden="true" {...props}>
      <rect width="320" height="180" fill="#fff8ef" />
      <rect y="112" width="320" height="68" fill="#ffd65c" />
      <rect y="84" width="320" height="30" fill="#87cbff" />
      <circle cx="258" cy="40" r="22" fill="#ffd65c" />
      <rect x="34" y="84" width="72" height="58" fill="#ff7d5c" />
      <rect x="68" y="58" width="70" height="84" fill="#fff8ef" />
      <rect x="150" y="88" width="78" height="54" fill="#fff8ef" />
      <rect x="230" y="64" width="38" height="78" fill="#3b91ff" />
      <path d="M16 128 C62 96, 112 146, 168 118 S274 96, 308 126" stroke="#ffffff" strokeWidth="8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function ScheduleHeroArt(props: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" {...props}>
      <rect width="120" height="120" rx="20" fill="rgba(255,255,255,0.14)" />
      <rect x="0" y="72" width="120" height="48" fill="rgba(255,255,255,0.18)" />
      <path d="M8 96 C26 78, 44 88, 58 70 S94 54, 112 40" stroke="rgba(255,255,255,0.9)" strokeWidth="7" fill="none" strokeLinecap="round" />
      <circle cx="18" cy="95" r="8" fill="rgba(255,214,92,0.95)" />
      <circle cx="111" cy="40" r="8" fill="rgba(255,125,92,0.95)" />
      <rect x="16" y="20" width="28" height="20" rx="6" fill="rgba(255,255,255,0.9)" />
      <rect x="52" y="18" width="50" height="24" rx="8" fill="rgba(255,255,255,0.22)" />
    </svg>
  );
}

export function MapArt(props: SvgProps) {
  return (
    <svg viewBox="0 0 320 180" aria-hidden="true" {...props}>
      <defs>
        <linearGradient id="mapBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d8f1ff" />
          <stop offset="100%" stopColor="#dcf4df" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#mapBg)" />
      <path d="M36 146 C84 102, 102 98, 132 76 S200 42, 282 52" stroke="#ffffff" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M38 146 C84 102, 102 98, 132 76 S200 42, 282 52" stroke="#4a95ff" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="6 8" />
      <circle cx="42" cy="146" r="10" fill="#ffd65c" />
      <circle cx="282" cy="52" r="10" fill="#ff7d5c" />
      <circle cx="164" cy="88" r="9" fill="#3b91ff" />
      <rect x="18" y="18" width="82" height="22" rx="11" fill="rgba(255,255,255,0.86)" />
      <rect x="214" y="132" width="76" height="24" rx="12" fill="rgba(255,255,255,0.86)" />
      <text x="34" y="33" fontSize="11" fill="#17324d">현재 위치</text>
      <text x="226" y="148" fontSize="11" fill="#17324d">도착 예정</text>
    </svg>
  );
}

export function PlaceArtVariantA(props: SvgProps) {
  return (
    <svg viewBox="0 0 120 90" aria-hidden="true" {...props}>
      <rect width="120" height="90" fill="#fff8ef" />
      <rect y="60" width="120" height="30" fill="#ffd65c" />
      <rect y="42" width="120" height="18" fill="#7dc2ff" />
      <rect x="12" y="42" width="34" height="28" fill="#ff7d5c" />
      <rect x="26" y="28" width="32" height="42" fill="#fff8ef" />
      <circle cx="96" cy="20" r="10" fill="#ffd65c" />
    </svg>
  );
}

export function PlaceArtVariantB(props: SvgProps) {
  return (
    <svg viewBox="0 0 120 90" aria-hidden="true" {...props}>
      <rect width="120" height="90" fill="#fff8ef" />
      <rect y="62" width="120" height="28" fill="#ffb366" />
      <rect y="46" width="120" height="16" fill="#87cbff" />
      <rect x="16" y="36" width="52" height="34" fill="#fff8ef" />
      <rect x="22" y="44" width="14" height="26" fill="#3b91ff" />
      <rect x="78" y="30" width="22" height="40" fill="#ff7d5c" />
      <circle cx="90" cy="18" r="10" fill="#ffd65c" />
    </svg>
  );
}

export function PlaceArtVariantC(props: SvgProps) {
  return (
    <svg viewBox="0 0 120 90" aria-hidden="true" {...props}>
      <rect width="120" height="90" fill="#eef9ff" />
      <rect y="62" width="120" height="28" fill="#74c282" />
      <rect y="46" width="120" height="16" fill="#7dc2ff" />
      <path d="M18 68 L42 34 L66 68 Z" fill="#fff8ef" />
      <rect x="72" y="36" width="28" height="32" fill="#fff8ef" />
      <circle cx="92" cy="18" r="10" fill="#ffd65c" />
    </svg>
  );
}

export function ConnectHeroArt(props: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" {...props}>
      <rect width="120" height="120" rx="20" fill="rgba(255,255,255,0.14)" />
      <circle cx="34" cy="44" r="16" fill="rgba(255,219,122,0.95)" />
      <rect x="18" y="60" width="34" height="30" rx="15" fill="rgba(255,255,255,0.86)" />
      <circle cx="82" cy="36" r="12" fill="rgba(255,174,174,0.96)" />
      <rect x="70" y="48" width="24" height="28" rx="12" fill="rgba(255,255,255,0.86)" />
      <path d="M54 86 C66 68, 92 70, 102 56" stroke="rgba(255,255,255,0.92)" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="54" cy="86" r="7" fill="rgba(255,255,255,0.96)" />
      <circle cx="102" cy="56" r="7" fill="rgba(255,255,255,0.96)" />
    </svg>
  );
}

export function PlayHeroArt(props: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" {...props}>
      <rect width="120" height="120" rx="20" fill="rgba(255,255,255,0.14)" />
      <circle cx="92" cy="26" r="12" fill="rgba(255,219,122,0.95)" />
      <rect x="18" y="64" width="18" height="34" fill="rgba(255,255,255,0.88)" />
      <rect x="40" y="52" width="18" height="46" fill="rgba(255,255,255,0.78)" />
      <rect x="62" y="34" width="18" height="64" fill="rgba(255,255,255,0.92)" />
      <rect x="84" y="46" width="18" height="52" fill="rgba(59,145,255,0.9)" />
      <path d="M12 102 C28 94, 40 78, 54 82 S82 98, 108 70" stroke="rgba(255,125,92,0.95)" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function MyHeroArt(props: SvgProps) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden="true" {...props}>
      <rect width="120" height="120" rx="20" fill="rgba(255,255,255,0.14)" />
      <rect x="14" y="18" width="44" height="58" rx="10" fill="rgba(255,255,255,0.92)" />
      <rect x="20" y="26" width="32" height="24" rx="6" fill="#67b7ff" />
      <rect x="20" y="56" width="20" height="8" rx="4" fill="#ffd65c" />
      <rect x="44" y="56" width="8" height="8" rx="4" fill="#ff7d5c" />
      <rect x="68" y="34" width="36" height="48" rx="10" fill="rgba(255,255,255,0.84)" />
      <path d="M74 72 L82 60 L90 66 L96 52 L104 72 Z" fill="#ffd65c" />
      <circle cx="94" cy="46" r="5" fill="#ff7d5c" />
    </svg>
  );
}

export function PersonArt(props: SvgProps & { emoji?: string; bgStart?: string; bgEnd?: string; shirtStart?: string; shirtEnd?: string }) {
  const {
    emoji = '☕',
    bgStart = '#5fb0ff',
    bgEnd = '#ffd56a',
    shirtStart = '#ffffff',
    shirtEnd = '#ff9d7f',
    ...rest
  } = props;

  return (
    <svg viewBox="0 0 120 92" aria-hidden="true" {...rest}>
      <defs>
        <linearGradient id={`bg-${emoji}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bgStart} />
          <stop offset="100%" stopColor={bgEnd} />
        </linearGradient>
        <linearGradient id={`shirt-${emoji}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={shirtStart} />
          <stop offset="100%" stopColor={shirtEnd} />
        </linearGradient>
      </defs>
      <rect width="120" height="92" rx="14" fill={`url(#bg-${emoji})`} />
      <circle cx="60" cy="30" r="16" fill="rgba(255,235,205,0.96)" />
      <path d="M35 86 C39 58, 81 58, 85 86 Z" fill={`url(#shirt-${emoji})`} />
      <rect x="43" y="14" width="34" height="8" rx="4" fill="rgba(31,49,76,0.85)" />
      <text x="92" y="22" fontSize="16">{emoji}</text>
      <circle cx="54" cy="30" r="2" fill="rgba(31,49,76,0.85)" />
      <circle cx="66" cy="30" r="2" fill="rgba(31,49,76,0.85)" />
      <path d="M54 38 C58 41, 62 41, 66 38" stroke="rgba(31,49,76,0.8)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function QRArt(props: SvgProps) {
  const on = new Set([0,1,2,6,7,8,9,11,15,17,18,19,20,24,26,28,30,31,33,35,36,38,40,41,42,44,45,47,51,53,54,56,57,58,62,64,66,68,70,72,73,74,78,80]);
  return (
    <svg viewBox="0 0 90 90" aria-hidden="true" {...props}>
      <rect width="90" height="90" rx="10" fill="#ffffff" />
      {Array.from({ length: 81 }).map((_, i) => {
        const x = i % 9;
        const y = Math.floor(i / 9);
        return (
          <rect
            key={i}
            x={6 + x * 8.5}
            y={6 + y * 8.5}
            width="6.5"
            height="6.5"
            rx="1.2"
            fill={on.has(i) ? '#17324d' : 'transparent'}
          />
        );
      })}
    </svg>
  );
}
