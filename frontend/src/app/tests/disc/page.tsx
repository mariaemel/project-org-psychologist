export const dynamic = 'force-dynamic'

import Link from 'next/link'
import styles from './page.module.css'
import { fetchTestDisc } from '@/lib/api'

export default async function CareerTestPage() {
  const testData = await fetchTestDisc('disc')

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
            Этот тест помогает лучше понять ваши поведенческие предпочтения в рабочей среде и в ситуациях стресса: как вы принимаете решения, взаимодействуете с людьми и реагируете на давление.
          </p>

          <p className={styles.description}>
            Как проходить тест:
          </p>

          <ul className={styles.instructionsList}>
            <li>Тест состоит из 40 вопросов.</li>
            <li>В каждом вопросе вы увидите 4 утверждения.</li>
            <li>
              Ваша задача - расположить утверждения в порядке от наиболее про вас к наименее про вас:
              <ul className={styles.sublist}>
                верхняя позиция - «наиболее про меня»<br/>
                нижняя позиция - «наименее про меня»<br/>
              </ul>
            </li>
            <li>Для каждого вопроса необходимо задать полный порядок от 1 до 4.</li>
            <li>Вы можете возвращаться к предыдущим вопросам и менять ответы, пока не завершите тест.</li>
          </ul>

          <p className={styles.description}>В тесте нет правильных или неправильных ответов. Важно выбирать варианты так, как вы обычно ведете себя на практике, а не так, как «должно быть» или «ожидается».</p>

          <p className={styles.description}>
            <strong>Важно:</strong>
          </p>

          <p className={styles.description}>Этот тест является инструментом самооценки и не является медицинской или клинической диагностикой.<br/>Результаты зависят от текущего контекста и состояния и предназначены для самопонимания и обсуждения на консультации.</p>


          <Link href={`/tests/${testData.slug}/start`} className={styles.startButton}>
            Начать
          </Link>
        </div>
      </div>
    </div>
  )
}
