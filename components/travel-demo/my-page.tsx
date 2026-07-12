import styles from './travel-demo.module.css';
import { MobileNav } from './mobile-nav';
import { HomeRecoArt, MyHeroArt, QRArt, ScheduleHeroArt } from './illustrations';
import { myPosterItems, mySettingItems } from './data';

const posterArts = [ScheduleHeroArt, HomeRecoArt] as const;

export function MyPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.greeting}>MY</div>
            <div className={styles.subcopy}>QR, 기록, 보관함, 기념품까지 내 자산을 모으는 공간</div>
          </div>
          <button type="button" className={styles.iconButton} aria-label="설정 열기">
            ⚙️
          </button>
        </header>

        <section className={`${styles.hero} ${styles.heroMy}`}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.heroEyebrow}>오늘의 기록</div>
              <div className={styles.heroTitle}>Anna’s Busan Journey</div>
              <p className={styles.heroBody}>2026.07.12–07.15 · Haeundae · Yeongdo · Gijang · 사진 184장 · 방문 23곳</p>
              <div className={styles.heroActions}>
                <span className={styles.heroPill}>기록 보기</span>
                <span className={styles.heroPill}>공유하기</span>
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
              <div style={{ fontSize: 24, fontWeight: 800 }}>3곳</div>
              <div className={styles.captionText}>해운대 · 영도 · 기장</div>
            </div>
            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>새 배지</div>
                <div className={styles.sectionMeta}>이번 여행</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>2개</div>
              <div className={styles.captionText}>컬러 픽 · 오션 러너</div>
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
                <div style={{ fontSize: 14, fontWeight: 800 }}>QR 열기</div>
                <div className={styles.captionText}>버스 탑승, 현장 체크인, 지역 인증, 빠른 신원 확인에 사용합니다.</div>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>지도 포스터 · 포토북</div>
              <div className={styles.sectionMeta}>자동 생성</div>
            </div>
            <div className={styles.posterGrid}>
              {myPosterItems.map((item, index) => {
                const Art = posterArts[index];
                return (
                  <div key={item.title}>
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
              {mySettingItems.map((item) => (
                <span key={item} className={styles.softPill}>
                  {item}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>

      <MobileNav current="my" />
    </main>
  );
}
