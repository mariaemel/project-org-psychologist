'use client'
import { usePathname } from 'next/navigation'
import styles from './Header.module.css'
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const RequestForm = dynamic(() => import('@/components/RequestForm/RequestForm'), { ssr: false });

export default function Header() {
  const [showForm, setShowForm] = useState(false);
  const pathname = usePathname()
  const [visible, setVisible] = useState(true);
  const isHomePage = pathname === '/';

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
    <header className={`${styles.header} ${isHomePage ? styles.lightHeader : styles.darkHeader}`}>
      <div className={styles.container}>
        <div className={styles.left}>
          <nav className={styles.nav}>
            <a href="/">Главная</a>
            <a href="/about" className={pathname === '/about' ? styles.active : ''}>Обо мне</a>
            <a href="/services" className={pathname === '/services' ? styles.active : ''}>Услуги</a>
            <a href="/articles" className={pathname === '/articles' ? styles.active : ''}>Статьи</a>
            <a href="/questions" className={pathname === '/questions' ? styles.active : ''}>Вопросы</a>
            <a href="/tests" className={pathname.startsWith('/tests') ? styles.active : ''}>Тесты</a>
          </nav>
        </div>
        <button className={styles.cta} onClick={() => setShowForm(true)}>Оставить заявку</button>
      </div>
      {showForm && <RequestForm onClose={() => setShowForm(false)} />}
    </header>
  )
}
