'use client'
import { useState } from 'react';
import styles from './MobileMenu.module.css';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
const RequestForm = dynamic(() => import('@/components/RequestForm/RequestForm'), { ssr: false });

export default function MobileMenu() {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const handleRequestClick = () => {
    setShowRequestForm(true);
  };

  const closeRequestForm = () => {
    setShowRequestForm(false);
  };

  return (
    <>
      <a
        href="#menu"
        className={`${styles.burgerButton} ${isHomePage ? styles.whiteIcon : styles.blackIcon}`}
        aria-label="Открыть меню"
      ></a>

      <div id="menu" className={styles.mobileMenu}>
        <a href="#" className={styles.closeMenu} aria-label="Закрыть меню">×</a>
        <ul className={styles.menuList}>
          <li className={styles.menuItem}><a href="/">Главная</a></li>
          <li className={styles.menuItem}><a href="/about">Обо мне</a></li>
          <li className={styles.menuItem}><a href="/services">Услуги</a></li>
          <li className={styles.menuItem}><a href="/articles">Статьи</a></li>
          <li className={styles.menuItem}><a href="/questions">Вопросы</a></li>
          <li className={styles.menuItem}><a href="#" onClick={handleRequestClick}>Оставить заявку</a></li>
        </ul>
      </div>

      {showRequestForm && (
        <RequestForm onClose={closeRequestForm} />
      )}
    </>
  );
}
