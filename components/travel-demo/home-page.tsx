import styles from './travel-demo.module.css';
import { MobileNav } from './mobile-nav';
import { HomeHeroArt, HomeRecoArt } from './illustrations';
import { homeTimeline } from './data';

export function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.greeting}>안녕하세요, Anna</div>
            <div className={styles.subcopy}>부산 여행 · Day 2 · 26°C · 가벼운 구름 · 추천 3개</div>
          </div>
          <button type="button" className={styles.iconButton} aria-label="알림 열기">
            🔔
          </button>
        </header>

        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.heroEyebrow}>오늘의 일정</div>
              <div className={styles.heroTitle}>08:30 호텔 로비 출발</div>
              <p className={styles.heroBody}>
                현지 가이드 체크인 후 해운대 컨벤션 센터로 이동합니다. 길 보기, 차량 확인, 도움 요청을 바로 실행할 수 있어요.
              </p>
              <div className={styles.heroActions}>
                <span className={styles.heroPill}>길 보기</span>
                <span className={styles.heroPill}>차량 확인</span>
                <span className={styles.heroPill}>도움 요청</span>
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
              <div className={styles.sectionMeta}>3개 일정</div>
            </div>
            <div className={styles.timeline}>
              {homeTimeline.map((item) => (
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
                <div className={styles.sectionMeta}>오디오 3분</div>
              </div>
              <div className={styles.recoThumb}>
                <HomeRecoArt />
              </div>
              <div className={styles.captionText}>
                <strong>광안리 저녁 루프탑</strong>
                <br />
                현지인이 남긴 짧은 팁과 포토 노트가 함께 표시됩니다.
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>실시간 연결</div>
                <div className={styles.sectionMeta}>지금</div>
              </div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>7명</div>
              <div className={styles.captionText}>현지인 4 · 언어 도움 3 · 평균 응답 2분</div>
              <div className={styles.pillRow} style={{ marginTop: 10 }}>
                <span className={styles.softPill}>🗣 5분 도움</span>
                <span className={styles.softPill}>📍 근처 추천</span>
              </div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>오늘 기록</div>
              <div className={styles.sectionMeta}>자동 저장</div>
            </div>
            <div className={styles.threeCol}>
              <div className={styles.stat}>
                <strong>18</strong>
                <span>사진</span>
              </div>
              <div className={styles.stat}>
                <strong>3</strong>
                <span>방문 장소</span>
              </div>
              <div className={styles.stat}>
                <strong>1</strong>
                <span>새 배지</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MobileNav current="home" />
    </main>
  );
}
