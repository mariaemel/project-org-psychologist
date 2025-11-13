'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Breadcrumbs.module.css';

export default function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const getPageName = (slug: string) => {
    switch (slug) {
      case 'about': return 'Обо мне';
      case 'services': return 'Услуги';
      case 'articles': return 'Статьи';
      case 'questions': return 'Вопросы';
      case 'tests': return 'Тесты';
      case 'application': return 'Оставить заявку';

      default: return slug;
    }
  };

  if (segments.length === 0) return null;

  return (
    <nav className={styles.breadcrumbs}>
      <Link href="/">Главная</Link>
      {segments.map((slug, index) => (
        <span key={index}> {'->'} {getPageName(slug)}</span>
      ))}
    </nav>
  );
}
