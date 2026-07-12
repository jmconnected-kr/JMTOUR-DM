'use client';

import styles from './travel-demo.module.css';
import { MobileNav } from './mobile-nav';
import { HomeHeroArt, HomeRecoArt } from './illustrations';
import { useDemoContent } from './content-store';

export function HomePage() {
  const { content } = useDemoContent();
  const home = content.home;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.greeting}>안녕하세요, {home.greetingName}</div>
            <div className={styles.subcopy}>{home.subcopy}</div>
          </div>
          <button type="button" className={styles.iconButton} aria-label="알림 열기">
            🔔
          </button>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.heroEyebrow}>{home.heroEyebrow}</div>
              <div className={styles.heroTitle}>{home.heroTitle}</div>
              <p className={styles.heroBody}>{home.heroBody}</p>
              <div className={styles.heroActions}>
                {home.heroActions.map((action) => (
                  <span key={action} className={styles.heroPill}>{action}</span>
                ))}
              </div>
            </div>
            <div className={styles.heroArt}>
              <HomeHeroArt />
            </div>
          </div>
        </section>

        <div className={styles.sectionStack}>
          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>오늘의 일정</div>
              <div className={styles.sectionMeta}>{home.timeline.length}개 일정</div>
            </div>
            <div className={styles.timeline}>
              {home.timeline.map((item) => (
                <div key={item.time + item.title} className={styles.timelineItem}>
                  <div className={styles.timelineTime}>{item.time}</div>
                  <div className={styles.timelineContent}>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.twoCol}>
            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>오늘의 추천</div>
                <div className={styles.sectionMeta}>{home.recommendationMeta}</div>
              </div>
              <div className={styles.recoThumb}>
                <HomeRecoArt />
              </div>
              <div className={styles.captionText}>
                <strong>{home.recommendationTitle}</strong>
                <br />
                {home.recommendationNote}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>실시간 연결</div>
                <div className={styles.sectionMeta}>지금</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{home.liveConnectionsValue}</div>
              <div className={styles.captionText}>{home.liveConnectionsNote}</div>
              <div className={styles.pillRow} style={{ marginTop: 10 }}>
                {home.liveConnectionTags.map((tag) => (
                  <span key={tag} className={styles.softPill}>{tag}</span>
                ))}
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>오늘 기록</div>
              <div className={styles.sectionMeta}>자동 저장</div>
            </div>
            <div className={styles.threeCol}>
              {home.recordStats.map((item) => (
                <div key={item.label} className={styles.stat}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <MobileNav current="home" />
    </main>
  );
}
