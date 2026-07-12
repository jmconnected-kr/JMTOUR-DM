import styles from './travel-demo.module.css';
import { MobileNav } from './mobile-nav';
import { PlaceArtVariantA, PlaceArtVariantB, PlaceArtVariantC, PlayHeroArt } from './illustrations';
import { playAlbumStats, playBadgeItems } from './data';

const albumArts = [PlaceArtVariantA, PlaceArtVariantB, PlaceArtVariantC, PlaceArtVariantB, PlaceArtVariantC, PlaceArtVariantA] as const;

export function PlayPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.greeting}>플레이</div>
            <div className={styles.subcopy}>미션, 앨범, 리뷰 전쟁, 지역 인증으로 여행을 더 재밌게</div>
          </div>
          <button type="button" className={styles.iconButton} aria-label="플레이 알림 열기">
            🎯
          </button>
        </header>

        <section className={`${styles.hero} ${styles.heroPlay}`}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.heroEyebrow}>오늘의 미션</div>
              <div className={styles.heroTitle}>부산에서 가장 마음에 드는 색 찾기</div>
              <p className={styles.heroBody}>
                사진 1장 업로드 시 +10 포인트, 지역 조각 1개, 컬렉션 배지를 획득합니다. 재미와 기록이 함께 남는 플레이 허브예요.
              </p>
              <div className={styles.heroActions}>
                <span className={styles.heroPill}>챌린지 시작</span>
                <span className={styles.heroPill}>사진 업로드</span>
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
              {playAlbumStats.map((item) => (
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
                {[
                  ['📍', '3곳 완료'],
                  ['🧩', '타일 2개'],
                  ['🏁', '진행 62%'],
                  ['✅', 'QR 인증'],
                ].map(([emoji, label]) => (
                  <div key={label} className={styles.iconBadge}>
                    <span className={styles.iconBadgeEmoji}>{emoji}</span>
                    <span className={styles.iconBadgeLabel}>{label}</span>
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
                {playBadgeItems.map((item) => (
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
                  <strong>🍲 현지 추천 국밥</strong>
                  <span>62% · 깊은 맛 · 대기 12분</span>
                </div>
                <div className={styles.reviewVsMark}>VS</div>
                <div className={styles.reviewVote}>
                  <strong>✨ 여행자 픽 브런치</strong>
                  <span>38% · 감성 공간 · 사진 맛집</span>
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
