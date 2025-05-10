'use client'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'
import { useEffect, useState } from 'react';

export default function Header() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <nav className={styles.nav}>
            <a href="/">Главная</a>
            <a href="/about" className={pathname === '/about' ? styles.active : ''}>Обо мне</a>
            <a href="/services" className={pathname === '/services' ? styles.active : ''}>Услуги</a>
            <a href="/articles" className={pathname === '/articles' ? styles.active : ''}>Статьи</a>
            <a href="/faq" className={pathname === '/faq' ? styles.active : ''}>Вопросы</a>
          </nav>
        </div>
        <button className={styles.cta}>Оставить заявку</button>
      </div>
    </header>
  )
}
