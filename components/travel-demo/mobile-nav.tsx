import Link from 'next/link';
import styles from './travel-demo.module.css';

type NavKey = 'home' | 'schedule' | 'connect' | 'play' | 'my';

const navItems: Array<{ key: NavKey; label: string; href: string; icon: string }> = [
  { key: 'home', label: '홈', href: '/home', icon: '🏠' },
  { key: 'schedule', label: '일정', href: '/schedule', icon: '🗓️' },
  { key: 'connect', label: '커넥트', href: '/connect', icon: '🤝' },
  { key: 'play', label: '플레이', href: '/play', icon: '🎯' },
  { key: 'my', label: 'MY', href: '/my', icon: '👤' },
];

export function MobileNav({ current }: { current: NavKey }) {
  return (
    <nav className={styles.bottomNav} aria-label="메인 하단 메뉴">
      {navItems.map((item) => {
        const isActive = item.key === current;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
          >
            <span aria-hidden>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
