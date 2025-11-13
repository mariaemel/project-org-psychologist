'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'

const questions = [
  {
    id: 1,
    text: "Для меня в работе...",
    options: [
      "Стабильность и надежность положения",
      "Возможность руководить и влиять",
      "Свобода самостоятельно планировать работу",
      "Профессиональный рост и экспертиза"
    ]
  },
  {
    id: 2,
    text: "Я бы предпочел работу, которая...",
    options: [
      "Позволяет помогать другим и приносить пользу обществу",
      "Дает возможность постоянно решать новые сложные задачи",
      "Оставляет время для личной жизни и хобби",
      "Позволяет создать собственный бизнес или проект"
    ]
  },
  {
    id: 3,
    text: "В карьере для меня главное...",
    options: [
      "Стать настоящим экспертом в своей области",
      "Занять руководящую позицию",
      "Иметь гибкий график и свободу",
      "Иметь гарантии и стабильный доход"
    ]
  }
]

export default function CareerStartPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{questionId: number, answer: string}[]>([])
  const router = useRouter()

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, {
      questionId: questions[currentQuestion].id,
      answer: answer
    }]

    setAnswers(newAnswers)

    if (currentQuestion === questions.length - 1) {
      const resultId = 'career-' + Date.now()
      localStorage.setItem(resultId, JSON.stringify({
        testType: 'career-anchors',
        answers: newAnswers,
        completedAt: new Date().toISOString()
      }))
      router.push(`/tests/results/${resultId}`)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.breadcrumbs}>
          <Link href="/" className={styles.breadcrumbLink}>Главная</Link> →
          <Link href="/tests" className={styles.breadcrumbLink}> Тесты</Link> →
          <Link href="/tests/career-anchors" className={styles.breadcrumbLink}> Якоря карьеры</Link> → Прохождение
        </div>
        <h1 className={styles.title}>Якоря карьеры</h1>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className={styles.progressText}>
          Вопрос {currentQuestion + 1} из {questions.length}
        </div>
      </div>

      <div className={styles.questionCard}>
        <h2 className={styles.questionText}>
          {questions[currentQuestion].text}
        </h2>

        <div className={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className={styles.optionButton}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {currentQuestion > 0 && (
        <button
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          className={styles.backButton}
        >
          ← Назад
        </button>
      )}
    </div>
  )
}
