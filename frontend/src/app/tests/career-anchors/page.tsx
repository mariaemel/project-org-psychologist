import Link from 'next/link'
import styles from './page.module.css'

export default function CareerTestPage() {
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <Link href="/">Главная</Link> → <Link href="/tests">Тесты</Link> → Якоря карьеры
      </div>

      <div className={styles.hero}>
        <img src="/career.png" alt="Якоря карьеры тест" className={styles.image} />
        <div className={styles.content}>
          <h1 className={styles.title}>Якоря карьеры</h1>
          <div className={styles.meta}>
            <span className={styles.time}>10 минут на прохождение</span>
          </div>
          <p className={styles.description}>
            Определите ваши главные карьерные ценности и мотиваторы. Узнайте, что для вас действительно важно
            в профессиональной деятельности и куда двигаться для достижения карьерного удовлетворения.
          </p>

          <Link href="/tests/career-anchors/start" className={styles.startButton}>
            Начать
          </Link>
        </div>
      </div>
    </div>
  )
}
