'use client';

import styles from './travel-demo.module.css';
import { MobileNav } from './mobile-nav';
import {
  MapArt,
  PlaceArtVariantA,
  PlaceArtVariantB,
  PlaceArtVariantC,
  ScheduleHeroArt,
} from './illustrations';
import { useDemoContent } from './content-store';

const placeArt = [PlaceArtVariantA, PlaceArtVariantB, PlaceArtVariantC] as const;

export function SchedulePage() {
  const { content } = useDemoContent();
  const schedule = content.schedule;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.greeting}>{schedule.title}</div>
            <div className={styles.subcopy}>{schedule.subcopy}</div>
          </div>
          <button type="button" className={styles.iconButton} aria-label="달력 열기">
            🗓️
          </button>
        </header>

        <section className={`${styles.hero} ${styles.heroSchedule}`}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.heroEyebrow}>{schedule.heroEyebrow}</div>
              <div className={styles.heroTitle}>{schedule.heroTitle}</div>
              <p className={styles.heroBody}>{schedule.heroBody}</p>
              <div className={styles.heroActions}>
                {schedule.heroActions.map((action) => (
                  <span key={action} className={styles.heroPill}>{action}</span>
                ))}
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
              <div className={styles.sectionMeta}>{schedule.places.length}곳</div>
            </div>
            <div className={styles.threeCol}>
              {schedule.places.map((place, index) => {
                const Art = placeArt[index % placeArt.length];
                return (
                  <div key={place.title + index}>
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
              {schedule.placeTags.map((tag) => (
                <span key={tag} className={styles.softPill}>{tag}</span>
              ))}
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>나의 이동</div>
              <div className={styles.sectionMeta}>실시간</div>
            </div>
            <div className={styles.list}>
              {schedule.moves.map((move, index) => (
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
              <div className={styles.sectionMeta}>{schedule.mapMeta}</div>
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
              <div style={{ fontSize: 14, fontWeight: 800 }}>{schedule.conditionTitle}</div>
              <div className={styles.captionText}>{schedule.conditionNote}</div>
            </div>

            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>빠른 실행</div>
                <div className={styles.sectionMeta}>즉시</div>
              </div>
              <div className={styles.pillRow}>
                {schedule.quickActions.map((item) => (
                  <span key={item} className={styles.softPill}>{item}</span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <MobileNav current="schedule" />
    </main>
  );
}
