'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './pageStart.module.css'
import Link from 'next/link'

const questions = [
  {
    id: 1,
    text: "В конфликтной ситуации я обычно...",
    options: [
      "Стараюсь избежать конфликта",
      "Ищу компромисс",
      "Настаиваю на своем",
      "Анализирую ситуацию хладнокровно"
    ]
  },
  {
    id: 2,
    text: "При работе в команде я...",
    options: [
      "Стараюсь всех поддержать и создать дружескую атмосферу",
      "Беру на себя лидерство и организацию процесса",
      "Выполняю свою часть работы качественно и надежно",
      "Анализирую процесс и предлагаю улучшения"
    ]
  },
  {
    id: 3,
    text: "Когда передо мной стоит сложная задача...",
    options: [
      "Ищу поддержки у коллег",
      "Берусь за нее с энтузиазмом",
      "Составляю подробный план действий",
      "Анализирую все возможные риски"
    ]
  },
    {
    id: 4,
    text: "В конфликтной ситуации я обычно...",
    options: [
      "Стараюсь избежать конфликта",
      "Ищу компромисс",
      "Настаиваю на своем",
      "Анализирую ситуацию хладнокровно"
    ]
  },
  {
    id: 5,
    text: "При работе в команде я...",
    options: [
      "Стараюсь всех поддержать и создать дружескую атмосферу",
      "Беру на себя лидерство и организацию процесса",
      "Выполняю свою часть работы качественно и надежно",
      "Анализирую процесс и предлагаю улучшения"
    ]
  },
  {
    id: 6,
    text: "Когда передо мной стоит сложная задача...",
    options: [
      "Ищу поддержки у коллег",
      "Берусь за нее с энтузиазмом",
      "Составляю подробный план действий",
      "Анализирую все возможные риски"
    ]
  }
]

export default function DiscStartPage() {
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
      const resultId = 'disc-' + Date.now()
      localStorage.setItem(resultId, JSON.stringify({
        testType: 'disc',
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
          <Link href="/">Главная</Link> → <Link href="/tests">Тесты</Link> → <Link href="/tests/disc/">DISC</Link> → Прохождение
        </div>
        <h1 className={styles.title}>Тест DISC</h1>
      </div>

      <div className={styles.progressSection}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          >
            <div style={{marginLeft: '10px'}}>Вопрос {currentQuestion + 1} из {questions.length}</div>
          </div>
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
          Назад
        </button>
      )}
    </div>
  )
}
