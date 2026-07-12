'use client';

import styles from './travel-demo.module.css';
import { MobileNav } from './mobile-nav';
import { PlaceArtVariantA, PlaceArtVariantB, PlaceArtVariantC, PlayHeroArt } from './illustrations';
import { useDemoContent } from './content-store';

const albumArts = [PlaceArtVariantA, PlaceArtVariantB, PlaceArtVariantC, PlaceArtVariantB, PlaceArtVariantC, PlaceArtVariantA] as const;

export function PlayPage() {
  const { content } = useDemoContent();
  const play = content.play;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.greeting}>{play.title}</div>
            <div className={styles.subcopy}>{play.subcopy}</div>
          </div>
          <button type="button" className={styles.iconButton} aria-label="플레이 알림 열기">
            🎯
          </button>
        </header>

        <section className={`${styles.hero} ${styles.heroPlay}`}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.heroEyebrow}>{play.heroEyebrow}</div>
              <div className={styles.heroTitle}>{play.heroTitle}</div>
              <p className={styles.heroBody}>{play.heroBody}</p>
              <div className={styles.heroActions}>
                {play.heroActions.map((action) => (
                  <span key={action} className={styles.heroPill}>{action}</span>
                ))}
              </div>
            </div>
            <div className={styles.heroArt}>
              <PlayHeroArt />
            </div>
          </div>
        </section>

        <div className={styles.sectionStack}>
          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>사진 앨범</div>
              <div className={styles.sectionMeta}>새 사진 8장</div>
            </div>
            <div className={styles.threeCol}>
              {albumArts.map((Art, index) => (
                <div key={index} className={styles.galleryThumb}>
                  <Art />
                </div>
              ))}
            </div>
            <div className={styles.threeCol} style={{ marginTop: 10 }}>
              {play.albumStats.map((item) => (
                <div key={item.label} className={styles.stat}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.twoCol}>
            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>지역 인증</div>
                <div className={styles.sectionMeta}>오늘</div>
              </div>
              <div className={styles.iconGrid}>
                {play.regionItems.map((item) => (
                  <div key={item.label} className={styles.iconBadge}>
                    <span className={styles.iconBadgeEmoji}>{item.emoji}</span>
                    <span className={styles.iconBadgeLabel}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>새 배지</div>
                <div className={styles.sectionMeta}>획득</div>
              </div>
              <div className={styles.iconGrid}>
                {play.badgeItems.map((item) => (
                  <div key={item.label} className={styles.iconBadge}>
                    <span className={styles.iconBadgeEmoji}>{item.emoji}</span>
                    <span className={styles.iconBadgeLabel}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>리뷰 전쟁</div>
              <div className={styles.sectionMeta}>투표 진행 중</div>
            </div>
            <div className={styles.reviewGrid}>
              <div className={styles.reviewVs}>
                <div className={styles.reviewVote}>
                  <strong>{play.reviewLeftTitle}</strong>
                  <span>{play.reviewLeftNote}</span>
                </div>
                <div className={styles.reviewVsMark}>VS</div>
                <div className={styles.reviewVote}>
                  <strong>{play.reviewRightTitle}</strong>
                  <span>{play.reviewRightNote}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MobileNav current="play" />
    </main>
  );
}
