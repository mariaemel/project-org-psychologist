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
            Узнайте, какой стиль управления вам ближе: директивный, обучающий, поддерживающий или делегирующий.<br/><br/>
            Тест основан на модели ситуационного лидерства Херси и Бланшара и поможет понять, как вы взаимодействуете с подчинёнными в разных ситуациях.
          </p>

          <p className={styles.description}>
            {testData.instructions_md}<br/><br/>
            Не существует «правильных» или «неправильных» ответов — важно ответить так, как вы поступаете на самом деле, а не как «следовало бы».
          </p>

          <Link href={`/tests/${testData.slug}/start`} className={styles.startButton}>
            Начать
          </Link>
        </div>
      </div>
    </div>
  )
}
