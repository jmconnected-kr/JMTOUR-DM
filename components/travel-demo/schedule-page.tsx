import styles from './travel-demo.module.css';
import { MobileNav } from './mobile-nav';
import {
  MapArt,
  PlaceArtVariantA,
  PlaceArtVariantB,
  PlaceArtVariantC,
  ScheduleHeroArt,
} from './illustrations';
import { scheduleMoves, schedulePlaces } from './data';

const placeArt = [PlaceArtVariantA, PlaceArtVariantB, PlaceArtVariantC] as const;

export function SchedulePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.greeting}>나의 일정</div>
            <div className={styles.subcopy}>Day 2 · 7월 13일 화요일 · 부산 · 우천 시 실내 코스 자동 제안</div>
          </div>
          <button type="button" className={styles.iconButton} aria-label="달력 열기">
            🗓️
          </button>
        </header>

        <section className={`${styles.hero} ${styles.heroSchedule}`}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.heroEyebrow}>나의 일정</div>
              <div className={styles.heroTitle}>오후 이동 2건</div>
              <p className={styles.heroBody}>
                오전 미팅, 점심 자유 일정, 오후 해변 산책으로 이어집니다. 비 예보가 있으면 실내 카페와 아트센터 코스로 자동 전환됩니다.
              </p>
              <div className={styles.heroActions}>
                <span className={styles.heroPill}>대체 코스</span>
                <span className={styles.heroPill}>이동 문의</span>
              </div>
            </div>
            <div className={styles.heroArt}>
              <ScheduleHeroArt />
            </div>
          </div>
        </section>

        <div className={styles.sectionStack}>
          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>오늘 갈 곳</div>
              <div className={styles.sectionMeta}>3곳</div>
            </div>
            <div className={styles.threeCol}>
              {schedulePlaces.map((place, index) => {
                const Art = placeArt[index];
                return (
                  <div key={place.title}>
                    <div className={styles.galleryThumb}>
                      <Art />
                    </div>
                    <div className={styles.captionText}>
                      <strong>{place.title}</strong>
                      <br />
                      {place.subtitle}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.pillRow} style={{ marginTop: 10 }}>
              <span className={styles.softPill}>🏛 컨벤션 센터</span>
              <span className={styles.softPill}>☕ 로컬 카페</span>
              <span className={styles.softPill}>🌊 해변 산책</span>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>나의 이동</div>
              <div className={styles.sectionMeta}>실시간</div>
            </div>
            <div className={styles.list}>
              {scheduleMoves.map((move, index) => (
                <div key={move.title} className={styles.listItem}>
                  <div className={`${styles.listIcon} ${index === 0 ? styles.listIconWarm : ''}`}>{move.icon}</div>
                  <div className={styles.listBody}>
                    <strong>{move.title}</strong>
                    <span>{move.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>지도 & 동선</div>
              <div className={styles.sectionMeta}>현재 위치 포함</div>
            </div>
            <div className={styles.mapThumb}>
              <MapArt />
            </div>
          </section>

          <section className={styles.twoCol}>
            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>컨디션 모드</div>
                <div className={styles.sectionMeta}>우천</div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>실내 카페 + 아트센터</div>
              <div className={styles.captionText}>걷기 짧고 실내 비중 높은 코스를 우선 추천합니다.</div>
            </div>

            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>빠른 실행</div>
                <div className={styles.sectionMeta}>즉시</div>
              </div>
              <div className={styles.pillRow}>
                <span className={styles.softPill}>🧭 길 보기</span>
                <span className={styles.softPill}>💬 이동 문의</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MobileNav current="schedule" />
    </main>
  );
}
