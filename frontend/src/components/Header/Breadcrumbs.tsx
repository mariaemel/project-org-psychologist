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
      case 'leadership-styles': return 'Стили руководства';
      case 'disc': return 'DISC';
      case 'career-anchors': return 'Якоря карьеры';
      case 'start': return 'Тест';
      default:
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
          return 'Результат';
        }
        return slug.charAt(0).toUpperCase() + slug.slice(1);
    }
  };

  if (segments.length === 0) return null;

  const breadcrumbs = [];
  let currentPath = '';

  breadcrumbs.push({
    name: 'Главная',
    href: '/',
    isLink: true
  });

  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    const pageName = getPageName(segments[i]);

    const isLink = i < segments.length - 1;
    const isDynamic = segments[i].startsWith('[') || /^[0-9a-f-]+$/.test(segments[i]);

    breadcrumbs.push({
      name: pageName,
      href: currentPath,
      isLink: isLink && !isDynamic
    });
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
      {breadcrumbs.map((crumb, index) => (
        <span key={index} className={styles.crumb}>
          {crumb.isLink ? (
            <Link href={crumb.href} className={styles.link}>
              {crumb.name}
            </Link>
          ) : (
            <span className={styles.current}>{crumb.name}</span>
          )}

          {index < breadcrumbs.length - 1 && (
            <span className={styles.separator}> {'>'} </span>
          )}
        </span>
      ))}
    </nav>
  );
}
