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
      <nav className={styles.nav}>
        <a href="/about" className={pathname === '/about' ? styles.active : ''}>ОБО МНЕ</a>
        <a href="/services" className={pathname === '/services' ? styles.active : ''}>УСЛУГИ</a>
        <a href="/articles" className={pathname === '/articles' ? styles.active : ''}>СТАТЬИ</a>
        <a href="/faq" className={pathname === '/faq' ? styles.active : ''}>ВОПРОСЫ</a>
        <a href="/contact" className={pathname === '/contact' ? styles.active : ''}>ОСТАВИТЬ ЗАЯВКУ</a>
      </nav>
    </header>
  )
}
