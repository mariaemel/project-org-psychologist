import Link from 'next/link'
import styles from './page.module.css'
import { fetchTestDetailCareer } from '@/lib/api'

export default async function CareerTestPage() {
  const testData = await fetchTestDetailCareer('career-anchors')

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumbs}>
        <Link href="/" className={styles.breadcrumbLink}>Главная</Link> &gt;
        <Link href="/tests" className={styles.breadcrumbLink}> Тесты</Link> &gt; {testData.title}
      </div>

      <div className={styles.content}>
        <img
          src={testData.hero_image_url || '/gray.png'}
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
            Опросник, который вы сейчас проходите, направлен на выявление ваших предпочтений в выборе профессионального пути и построении карьеры.
          </p>

          <p className={styles.description}>
            Вам будет предложено 41 утверждение. В каждом вопросе выберите одну цифру от 1 до 10 на электронной шкале:
          </p>

          <ul className={styles.instructionsList}>
            <li>
              <strong>Утверждения 1–21</strong> — оцените, насколько это утверждение важно для вас лично.
              <ul className={styles.sublist}>
                1 балл — утверждение совершенно не важно,<br/>
                10 баллов — исключительно важно. Чем более важным для вас является утверждение, тем большую цифру выбирайте.
              </ul>
            </li>
            <li>
              <strong>Утверждения 22–41</strong> — оцените, насколько вы согласны с этим утверждением.
              <ul className={styles.sublist}>
                1 балл — вы совсем не согласны,<br/>
                10 баллов — полностью согласны. Чем сильнее вы согласны с утверждением, тем большую цифру выбирайте.
              </ul>
            </li>
          </ul>

          <p className={styles.description}>
            Отвечайте быстро, опираясь на первое впечатление, не пропускайте ни одного утверждения и старайтесь быть максимально искренними.
          </p>

          <Link href={`/tests/${testData.slug}/start`} className={styles.startButton}>
            Начать
          </Link>
        </div>
      </div>
    </div>
  )
}
