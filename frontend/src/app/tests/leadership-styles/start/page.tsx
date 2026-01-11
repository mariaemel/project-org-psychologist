'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import Link from 'next/link'
import { startTest, getQuestion, saveAnswer, finishTest, type Question } from '@/lib/api'
import Breadcrumbs from '@/components/Header/Breadcrumbs';

export default function LeadershipStartPage() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [scores, setScores] = useState<{[key: number]: number}>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const startTestSession = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log('Starting leadership styles test...')

        const response = await startTest('leadership-styles')
        console.log('Test started:', response)

        setAttemptId(response.attempt_id)
        setCurrentQuestion(response.first_question)
        setCurrentQuestionIndex(response.first_question.order_index)
      } catch (err: any) {
        console.error('Error starting test:', err)
        setError('Не удалось подключиться к серверу. Пожалуйста, проверьте подключение.')
      } finally {
        setIsLoading(false)
      }
    }

    startTestSession()
  }, [])

  useEffect(() => {
    if (!attemptId || currentQuestionIndex === 1) return

    const loadQuestion = async () => {
      try {
        setIsLoading(true)
        const response = await getQuestion(attemptId, currentQuestionIndex)
        setCurrentQuestion(response.question)
        setScores({})
      } catch (err: any) {
        console.error('Error loading question:', err)
        setError('Ошибка загрузки вопроса')
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestion()
  }, [attemptId, currentQuestionIndex])

  const handleScaleClick = (optionId: number, event: React.MouseEvent<HTMLDivElement>) => {
    const scaleElement = event.currentTarget
    const rect = scaleElement.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const scaleWidth = rect.width
    const percentage = clickX / scaleWidth

    const score = Math.min(9, Math.max(0, Math.round(percentage * 9)))

    setScores(prev => ({
      ...prev,
      [optionId]: score
    }))
  }

  const handleNext = async () => {
    if (!currentQuestion || !attemptId || isTransitioning) return;

    const allOptionsScored = currentQuestion.options.every(option =>
      scores[option.id] !== undefined
    );

    if (!allOptionsScored) {
      alert('Пожалуйста, оцените все варианты ответов');
      return;
    }

    try {
      setIsTransitioning(true);

      for (const option of currentQuestion.options) {
        console.log(`Saving answer for option ${option.id}:`, scores[option.id]);

        const result = await saveAnswer(attemptId, {
          question_id: currentQuestion.id,
          option_id: option.id,
          text_value: scores[option.id].toString()
        });

        console.log('Save result:', result);
      }

      const totalQuestions = currentQuestion.progress?.total || 12
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
    if (!currentQuestion || !attemptId || isTransitioning) return

    const allOptionsScored = currentQuestion.options.every(option =>
      scores[option.id] !== undefined
    )

    if (!allOptionsScored) {
      alert('Пожалуйста, оцените все варианты ответов')
      return
    }

    try {
      setIsTransitioning(true)

      for (const option of currentQuestion.options) {
        await saveAnswer(attemptId, {
          question_id: currentQuestion.id,
          option_id: option.id,
          text_value: scores[option.id].toString()
        })
      }

      const result = await finishTest(attemptId)
      console.log('Test completed:', result)

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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.breadcrumbs}>
            <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/leadership-styles">Стили руководства</Link>
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
            <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/leadership-styles">Стили руководства</Link>
          </div>
        </div>
        <div className={styles.questionCard}>
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: '#d32f2f',
            background: '#ffebee',
            borderRadius: '8px'
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
                borderRadius: '6px',
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
            <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/leadership-styles">Стили руководства</Link>
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
    : (currentQuestionIndex / 12) * 100

  const allOptionsScored = currentQuestion.options.every(option =>
    scores[option.id] !== undefined
  )

  const totalQuestions = currentQuestion.progress?.total || 12
  const isLastQuestion = currentQuestionIndex === totalQuestions

  return (
    <>
    <Breadcrumbs />
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/leadership-styles">Стили руководства</Link>
        </div>
      </div>

      <div className={styles.questionCard}>
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress}%` }}
            >
              <div style={{marginLeft: '15px', paddingTop: '2px', color: 'white'}}>
                {currentQuestionIndex} из {currentQuestion.progress?.total || 12}
              </div>
            </div>
          </div>

          <div className={styles.progressText}>
            {currentQuestionIndex} из {currentQuestion.progress?.total || 12}
          </div>
        </div>

        <h2 className={styles.questionText}>
          {currentQuestion.text}
        </h2>

        <div className={styles.optionsContainer}>
          {currentQuestion.options.map((option) => (
            <div key={option.id} className={styles.optionWithScale}>
              <div className={styles.optionText}>{option.text}</div>

              <div className={styles.scaleNumber}>
                <span className={styles.scaleDescription}>
                  {'0'}
                </span>
                <span className={styles.scaleDescription}>
                  {'9'}
                </span>
              </div>

              <div className={styles.scaleContainer}>
                <div
                  className={styles.gradientScale}
                  onClick={(e) => handleScaleClick(option.id, e)}
                >
                  <div className={styles.scaleBackground}></div>
                  {scores[option.id] !== undefined && (
                    <div
                      className={styles.scoreIndicator}
                      style={{ left: `${(scores[option.id] / 9) * 100}%` }}
                    >
                      <div className={styles.scoreCircle}>
                        {scores[option.id]}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
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

          {isLastQuestion ? (
            <button
              onClick={handleFinish}
              disabled={!allOptionsScored || isTransitioning}
              className={styles.finishButton}
            >
              Завершить
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!allOptionsScored || isTransitioning}
              className={styles.nextButton}
            >
              Далее
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  )
}
