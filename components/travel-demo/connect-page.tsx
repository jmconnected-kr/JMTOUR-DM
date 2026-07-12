import styles from './travel-demo.module.css';
import { MobileNav } from './mobile-nav';
import { ConnectHeroArt, PersonArt } from './illustrations';
import { connectPeople, quickTalkTopics, sosTopics } from './data';

export function ConnectPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.greeting}>커넥트</div>
            <div className={styles.subcopy}>현지인 7명 · 언어 도움 3명 · 평균 응답 2분</div>
          </div>
          <button type="button" className={styles.iconButton} aria-label="커넥트 알림 열기">
            💬
          </button>
        </header>

        <section className={`${styles.hero} ${styles.heroConnect}`}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.heroEyebrow}>Local Connect</div>
              <div className={styles.heroTitle}>현지인에게 바로 물어보기</div>
              <p className={styles.heroBody}>
                5분 톡, 15분 소개 영상, 동네 산책, 짧은 Q&A까지 바로 연결됩니다. 언어 도움과 긴급 지원도 한 화면에서 접근할 수 있어요.
              </p>
              <div className={styles.heroActions}>
                <span className={styles.heroPill}>현지인 연결</span>
                <span className={styles.heroPill}>5분 말하기</span>
                <span className={styles.heroPill}>도움 요청</span>
              </div>
            </div>
            <div className={styles.heroArt}>
              <ConnectHeroArt />
            </div>
          </div>
        </section>

        <div className={styles.sectionStack}>
          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>연결 가능한 현지인</div>
              <div className={styles.sectionMeta}>호크니 인포그래픽</div>
            </div>
            <div className={styles.personGrid}>
              {connectPeople.map((person) => (
                <div key={person.name} className={styles.personCard}>
                  <div className={styles.personFigure}>
                    <PersonArt
                      emoji={person.emoji}
                      bgStart={person.bgStart}
                      bgEnd={person.bgEnd}
                      shirtStart={person.shirtStart}
                      shirtEnd={person.shirtEnd}
                    />
                  </div>
                  <div className={styles.personCaption}>
                    <strong>{person.name}</strong>
                    <span>{person.summary}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.twoCol}>
            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>Quick Talk</div>
                <div className={styles.sectionMeta}>5분 레슨</div>
              </div>
              <div className={styles.iconGrid}>
                {quickTalkTopics.map((topic, index) => (
                  <div key={topic} className={styles.iconBadge}>
                    <span className={styles.iconBadgeEmoji}>{['🚕', '🏨', '🍽️', '🛍️'][index]}</span>
                    <span className={styles.iconBadgeLabel}>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.sectionTitleRow}>
                <div className={styles.sectionTitle}>Travel SOS</div>
                <div className={styles.sectionMeta}>즉시</div>
              </div>
              <div className={styles.pillRow}>
                {sosTopics.map((topic) => (
                  <span key={topic} className={styles.softPill}>
                    {topic}
                  </span>
                ))}
              </div>
              <div className={styles.actionNote}>지원 채팅, 번역 문장, 빠른 튜터링으로 바로 연결됩니다.</div>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.sectionTitleRow}>
              <div className={styles.sectionTitle}>오늘의 소모임</div>
              <div className={styles.sectionMeta}>안전 체크</div>
            </div>
            <div className={styles.list}>
              <div className={styles.listItem}>
                <div className={`${styles.listIcon} ${styles.listIconWarm}`}>🌙</div>
                <div className={styles.listBody}>
                  <strong>야간 산책 · 19:30</strong>
                  <span>현지인 1명 · 여행자 5명 · 해변 포토 스팟 포함 · 신고 기능 지원</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <MobileNav current="connect" />
    </main>
  );
}
