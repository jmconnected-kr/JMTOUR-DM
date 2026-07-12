'use client';

import styles from './travel-demo.module.css';
import { MobileNav } from './mobile-nav';
import { ConnectHeroArt, PersonArt } from './illustrations';
import { useDemoContent } from './content-store';

const quickTalkIcons = ['🚕', '🏨', '🍽️', '🛍️'];

export function ConnectPage() {
  const { content } = useDemoContent();
  const connect = content.connect;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.greeting}>{connect.title}</div>
            <div className={styles.subcopy}>{connect.subcopy}</div>
          </div>
          <button type="button" className={styles.iconButton} aria-label="커넥트 알림 열기">
            💬
          </button>
        </header>

        <section className={`${styles.hero} ${styles.heroConnect}`}>
          <div className={styles.heroGrid}>
            <div>
              <div className={styles.heroEyebrow}>{connect.heroEyebrow}</div>
              <div className={styles.heroTitle}>{connect.heroTitle}</div>
              <p className={styles.heroBody}>{connect.heroBody}</p>
              <div className={styles.heroActions}>
                {connect.heroActions.map((action) => (
                  <span key={action} className={styles.heroPill}>{action}</span>
                ))}
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
              {connect.people.map((person) => (
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
                {connect.quickTalkTopics.map((topic, index) => (
                  <div key={topic + index} className={styles.iconBadge}>
                    <span className={styles.iconBadgeEmoji}>{quickTalkIcons[index] ?? '🗣️'}</span>
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
                {connect.sosTopics.map((topic) => (
                  <span key={topic} className={styles.softPill}>{topic}</span>
                ))}
              </div>
              <div className={styles.actionNote}>{connect.sosNote}</div>
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
                  <strong>{connect.meetupTitle}</strong>
                  <span>{connect.meetupNote}</span>
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
