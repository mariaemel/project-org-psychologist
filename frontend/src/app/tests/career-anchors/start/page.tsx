'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import Link from 'next/link'
import { startTest, getQuestion, saveAnswer, finishTest, type Question } from '@/lib/api'

export default function CareerAnchorsTestPage() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const startTestSession = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await startTest('career-anchors')

        setAttemptId(response.attempt_id)
        setCurrentQuestion(response.first_question)
        setCurrentQuestionIndex(response.first_question.order_index)
      } catch (err: any) {
        setError('Не удалось подключиться к серверу. Пожалуйста, проверьте подключение.')
      } finally {
        setIsLoading(false)
      }
    }

    startTestSession()
  }, [])

  useEffect(() => {
    if (!attemptId) return

    const loadQuestion = async () => {
      try {
        setIsLoading(true)
        const response = await getQuestion(attemptId, currentQuestionIndex)
        setCurrentQuestion(response.question)
        setScore(null)
      } catch (err: any) {
        setError('Ошибка загрузки вопроса')
      } finally {
        setIsLoading(false)
      }
    }

    if (currentQuestionIndex > 1) {
      loadQuestion()
    }
  }, [attemptId, currentQuestionIndex])

  const handleScaleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const scaleElement = event.currentTarget
    const rect = scaleElement.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const scaleWidth = rect.width
    const percentage = clickX / scaleWidth

    const newScore = Math.min(10, Math.max(1, Math.round(percentage * 10)))
    setScore(newScore)
  }

  const handleNext = async () => {
    if (!currentQuestion || !attemptId || !score || isTransitioning) return

    try {
      setIsTransitioning(true)

      const option = currentQuestion.options[0]
      const result = await saveAnswer(attemptId, {
        question_id: currentQuestion.id,
        option_id: option.id,
        text_value: score.toString()
      })

      const totalQuestions = currentQuestion.progress?.total || 41
      if (currentQuestionIndex < totalQuestions) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      }
    } catch (err: any) {
      console.error('Error saving answer:', err)
      setError(`Ошибка сохранения ответа: ${err.message || 'Неизвестная ошибка'}`)
    } finally {
      setIsTransitioning(false)
    }
  }

  const handleFinish = async () => {
    if (!currentQuestion || !attemptId || !score || isTransitioning) return

    try {
      setIsTransitioning(true)

      const option = currentQuestion.options[0]
      await saveAnswer(attemptId, {
        question_id: currentQuestion.id,
        option_id: option.id,
        text_value: score.toString()
      })

      const result = await finishTest(attemptId)

      router.push(result.result_url)

    } catch (err: any) {
      console.error('Error finishing test:', err)
      setError(`Ошибка завершения теста: ${err.message || 'Неизвестная ошибка'}`)
      setIsTransitioning(false)
    }
  }

  const handleBack = async () => {
    if (currentQuestionIndex > 1 && !isTransitioning) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (isLoading && !currentQuestion) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/career-anchors">Опросник карьерных ориентаций (Якоря карьеры)</Link>
          </div>
        </div>
        <div className={styles.questionCard}>
          <div style={{textAlign: 'center', padding: '40px'}}>
            Загрузка вопроса...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/career-anchors">Опросник карьерных ориентаций (Якоря карьеры)</Link>
          </div>
        </div>
        <div className={styles.questionCard}>
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#d32f2f',
            background: '#ffebee',
            borderRadius: '5px'
          }}>
            <h3>Ошибка</h3>
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                background: '#9D9DCC',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/career-anchors">Опросник карьерных ориентаций (Якоря карьеры)</Link>
          </div>
        </div>
        <div className={styles.questionCard}>
          <div style={{textAlign: 'center', padding: '40px'}}>
            Вопрос не найден
          </div>
        </div>
      </div>
    )
  }

  const progress = currentQuestion.progress
    ? (currentQuestion.progress.index / currentQuestion.progress.total) * 100
    : (currentQuestionIndex / 41) * 100

  const totalQuestions = currentQuestion.progress?.total || 41
  const isLastQuestion = currentQuestionIndex === totalQuestions

  const isImportanceQuestion = currentQuestionIndex <= 21
  const questionTypeText = isImportanceQuestion
    ? "Насколько это важно для вас?"
    : "Насколько вы согласны с этим утверждением?"

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/career-anchors">Опросник карьерных ориентаций (Якоря карьеры)</Link>
        </div>
      </div>

      <div className={styles.questionCard}>
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            >
              <div style={{marginLeft: '8px', paddingTop: '2px', color: 'white'}}>
              {currentQuestion.progress?.index || currentQuestionIndex} из {currentQuestion.progress?.total || 41}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.questionHeader}>
          <p className={styles.questionType}>
            {questionTypeText}
          </p>
          <h2 className={styles.questionText}>
            {currentQuestion.text}
          </h2>
        </div>

        <div className={styles.scaleNumber}>
          <span className={styles.scaleDescription}>
            {'1'}
          </span>
          <span className={styles.scaleDescription}>
            {'10'}
          </span>
        </div>

        <div className={styles.scaleSection}>
          <div className={styles.scaleContainer}>
            <div
              className={styles.gradientScale}
              onClick={handleScaleClick}
            >
              <div className={styles.scaleBackground}></div>
              {score !== null && (
              <div
                className={styles.scoreIndicator}
                style={{ left: `${((score - 1) / 9) * 100}%` }}
              >
                <div className={styles.scoreCircle}>
                  {score}
                </div>
              </div>
              )}
            </div>

            <div className={styles.scaleDescriptions}>
              <span className={styles.scaleDescription}>
                {isImportanceQuestion ? 'Совершенно неважно' : 'Совсем не согласен'}
              </span>
              <span className={styles.scaleDescription}>
                {isImportanceQuestion ? 'Исключительно важно' : 'Полностью согласен'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.navigation}>
          {currentQuestionIndex > 1 && (
            <button
              onClick={handleBack}
              disabled={isTransitioning}
              className={styles.backButton}
            >
              Назад
            </button>
          )}

          <div style={{ flex: 1 }}></div>

          {isLastQuestion ? (
            <button
              onClick={handleFinish}
              disabled={score === null || isTransitioning}
              className={styles.finishButton}
            >
              Завершить
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={score === null || isTransitioning}
              className={styles.nextButton}
            >
              Далее
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
