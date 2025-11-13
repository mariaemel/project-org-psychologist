import Link from 'next/link'
import styles from './page.module.css'
import { fetchTestDetail } from '@/lib/api'

export default async function LeadershipTestPage() {
  const testData = await fetchTestDetail('leadership-styles')

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <Link href="/" className={styles.breadcrumbLink}>Главная</Link> &gt;
        <Link href="/tests" className={styles.breadcrumbLink}> Тесты</Link> &gt; {testData.title}
      </div>

      <div className={styles.content}>
        <img
          src={testData.hero_image_url || '/leadership.png'}
          alt={testData.title}
          className={styles.image}
        />

        <div className={styles.textContent}>
          <h1 className={styles.title}>{testData.title}</h1>
          <div className={styles.meta}>
            <span className={styles.timeBadge}>
              {testData.est_minutes} минут на прохождение
            </span>
          </div>

          <p className={styles.description}>
            {testData.short_description}
          </p>

          <p className={styles.description}>
            {testData.instructions_md}
          </p>

          <Link href={`/tests/${testData.slug}/start`} className={styles.startButton}>
            Начать
          </Link>
        </div>
      </div>
    </div>
  )
}
