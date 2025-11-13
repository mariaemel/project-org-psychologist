'use client'
import Link from 'next/link'
import styles from './page.module.css'
import Breadcrumbs from '@/components/Header/Breadcrumbs';

const tests = [
  {
    slug: 'leadership-styles',
    title: 'Стили руководства',
    description: 'Тест позволяет определить, какой стиль управления вам ближе — информирование, обучение, поддержка или делегирование.',
    time: '15 минут на прохождение',
    color: '#D9D9D9',
    image: '/leadership.png'
  },
  {
    slug: 'disc',
    title: 'DISC',
    description: 'Тест помогает определить ваш стиль поведения и коммуникации — доминирование, влияние, стабильность или добросовестность.',
    time: '15 минут на прохождение',
    color: '#D9D9D9',
    image: '/disc.png'
  },
  {
    slug: 'career-anchors',
    title: 'Якоря карьеры',
    description: 'Тест выявляет ваши внутренние мотивы и приоритеты в профессиональной сфере',
    time: '15 минут на прохождение',
    color: '#D9D9D9',
    image: '/career.png'
  }
]

export default function TestsPage() {
  return (
    <>
    <Breadcrumbs />
    <div className={styles.pageBackground}>
      <div className={styles.testsContainer}>
        <div className={styles.text}>
          <h1 className={styles.testsTitle}>
            тесты и диагностические методики
          </h1>
          <div className={styles.tests}>
            <div className={styles.vectorBackground}></div>
            <p className={styles.testsSubtitle}>
              Пройдите один из коротких психологических тестов и узнайте больше о своих сильных сторонах, стиле общения и эмоциональном состоянии.
            </p>
          </div>
        </div>
        <div className={styles.testsGrid}>
          {tests.map(test => (
            <Link
              key={test.slug}
              href={`/tests/${test.slug}`}
              className={styles.testLink}
            >
              <div className={styles.testCard}>
                <div
                  className={styles.testImage}
                  style={{ backgroundImage: `url('${test.image}')` }}
                >
                </div>
                <div className={styles.testContent}>
                  <h3 className={styles.testTitle}>{test.title}</h3>
                  <p className={styles.testDescription}>{test.description}</p>
                  <div className={styles.testMeta}>
                    <span className={styles.testTime}>
                      {test.time}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}
