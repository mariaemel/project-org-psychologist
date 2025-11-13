import Link from 'next/link'
import styles from './page.module.css'

export default function DiscTestPage() {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Главная</Link> → <Link href="/tests">Тесты</Link> → DISC
      </div>

      <div className={styles.hero}>
        <img src="/disc.png" alt="DISC тест" className={styles.image} />
        <div className={styles.content}>
          <h1 className={styles.title}>Тест DISC</h1>
          <div className={styles.meta}>
            <span className={styles.time}>10 минут на прохождение</span>
          </div>
          <p className={styles.description}>
            DISC — это методика оценки поведенческих стилей людей в различных ситуациях.
            Тест поможет вам понять свои сильные стороны, особенности коммуникации
            и стиль работы в команде.
          </p>

          <Link href="/tests/disc/start" className={styles.startButton}>
            Начать
          </Link>
        </div>
      </div>
    </div>
  )
}
