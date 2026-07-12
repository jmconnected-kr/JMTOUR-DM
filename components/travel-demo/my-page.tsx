'use client';

import styles from './travel-demo.module.css';
import { MobileNav } from './mobile-nav';
import { HomeRecoArt, MyHeroArt, QRArt, ScheduleHeroArt } from './illustrations';
import { useDemoContent } from './content-store';

const posterArts = [ScheduleHeroArt, HomeRecoArt] as const;

export function MyPage() {
  const { content } = useDemoContent();
  const my = content.my;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.greeting}>{my.title}</div>
            <div className={styles.subcopy}>{my.subcopy}</div>
          </div>
          <button type="button" className={styles.iconButton} aria-label="설정 열기">
            ⚙️
          </button>
        </header>

        <section className={`${styles.hero} ${styles.heroMy}`}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.heroEyebrow}>{my.heroEyebrow}</div>
              <div className={styles.heroTitle}>{my.heroTitle}</div>
              <p className={styles.heroBody}>{my.heroBody}</p>
              <div className={styles.heroActions}>
                {my.heroActions.map((action) => (
                  <span key={action} className={styles.heroPill}>{action}</span>
                ))}
              </div>
            </div>
            <div className={styles.heroArt}>
              <MyHeroArt />
            </div>
          </div>
        </section>

        <div className={styles.sectionStack}>
          <section className={styles.twoCol}>
            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>방문 도시</div>
                <div className={styles.sectionMeta}>누적</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{my.cityCount}</div>
              <div className={styles.captionText}>{my.cityNames}</div>
            </div>
            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>새 배지</div>
                <div className={styles.sectionMeta}>이번 여행</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{my.badgeCount}</div>
              <div className={styles.captionText}>{my.badgeNames}</div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>내 QR</div>
              <div className={styles.sectionMeta}>체크인 · 인증</div>
            </div>
            <div className={styles.qrWrap}>
              <div className={styles.qrBox}>
                <QRArt />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800 }}>{my.qrTitle}</div>
                <div className={styles.captionText}>{my.qrDescription}</div>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>지도 포스터 · 포토북</div>
              <div className={styles.sectionMeta}>자동 생성</div>
            </div>
            <div className={styles.posterGrid}>
              {my.posters.map((item, index) => {
                const Art = posterArts[index % posterArts.length];
                return (
                  <div key={item.title + index}>
                    <div className={styles.poster}>
                      <Art />
                    </div>
                    <div className={styles.posterCaption} style={{ marginTop: 8 }}>
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.pillRow} style={{ marginTop: 10 }}>
              <span className={styles.softPill}>🗺 지도 포스터</span>
              <span className={styles.softPill}>📘 포토북</span>
              <span className={styles.softPill}>🎁 기념품 시안</span>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>설정</div>
              <div className={styles.sectionMeta}>기본</div>
            </div>
            <div className={styles.pillRow}>
              {my.settingItems.map((item) => (
                <span key={item} className={styles.softPill}>{item}</span>
              ))}
            </div>
          </section>
        </div>
      </div>

      <MobileNav current="my" />
    </main>
  );
}
