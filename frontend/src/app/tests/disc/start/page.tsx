'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef, TouchEvent } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'
import Link from 'next/link'
import { startTest, getQuestion, saveAnswer, finishTest, type Question } from '@/lib/api'

type DraggedItem = {
  index: number
  element: HTMLElement
  offsetY: number
}

export default function DISCtestPage() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1)
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [optionsOrder, setOptionsOrder] = useState<number[]>([])
  const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [touchStartY, setTouchStartY] = useState<number>(0)
  const [currentDragIndex, setCurrentDragIndex] = useState<number | null>(null)

  const router = useRouter()
  const listRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragItemRef = useRef<HTMLDivElement | null>(null)

  const initialOrder = [0, 1, 2, 3]

  useEffect(() => {
    const startTestSession = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await startTest('disc')

        setAttemptId(response.attempt_id)
        setCurrentQuestion(response.first_question)
        setCurrentQuestionIndex(response.first_question.order_index)
        setOptionsOrder(initialOrder)
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
        setOptionsOrder(initialOrder)
        setDraggedItem(null)
        setDragOverIndex(null)
        setIsDragging(false)
        setCurrentDragIndex(null)
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

  // Desktop drag handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    const item = e.currentTarget as HTMLElement
    setDraggedItem({
      index,
      element: item,
      offsetY: e.clientY - item.getBoundingClientRect().top
    })
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
    item.classList.add(styles.dragging)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'

    if (draggedItem && draggedItem.index !== index) {
      setDragOverIndex(index)

      const rect = e.currentTarget.getBoundingClientRect()
      const middleY = rect.top + rect.height / 2

      if (e.clientY < middleY) {
        e.currentTarget.classList.remove(styles.dropBottom)
        e.currentTarget.classList.add(styles.dropTop)
      } else {
        e.currentTarget.classList.remove(styles.dropTop)
        e.currentTarget.classList.add(styles.dropBottom)
      }
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove(styles.dropTop, styles.dropBottom)
    setDragOverIndex(null)
  }

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    e.currentTarget.classList.remove(styles.dropTop, styles.dropBottom)

    if (!draggedItem) return

    const dragIndex = draggedItem.index
    if (dragIndex === dropIndex) return

    const newOrder = [...optionsOrder]
    const draggedOptionIndex = optionsOrder[dragIndex]

    newOrder.splice(dragIndex, 1)
    newOrder.splice(dropIndex, 0, draggedOptionIndex)

    setOptionsOrder(newOrder)
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    if (draggedItem) {
      draggedItem.element.classList.remove(styles.dragging)
      setDraggedItem(null)
      setDragOverIndex(null)

      if (listRef.current) {
        const items = listRef.current.querySelectorAll(`.${styles.optionBlock}`)
        items.forEach(item => {
          item.classList.remove(styles.dropTop, styles.dropBottom)
        })
      }
    }
  }

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const item = e.currentTarget as HTMLDivElement
    const touch = e.touches[0]

    setCurrentDragIndex(index)
    setIsDragging(true)
    setTouchStartY(touch.clientY)
    dragItemRef.current = item

    item.classList.add(styles.dragging)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || currentDragIndex === null || !dragItemRef.current) return

    e.preventDefault()
    const touch = e.touches[0]
    const clientY = touch.clientY

    const elements = document.elementsFromPoint(touch.clientX, touch.clientY)
    const optionElement = elements.find(el =>
      el.classList.contains(styles.optionBlock) && el !== dragItemRef.current
    )

    if (optionElement) {
      const allOptions = Array.from(document.querySelectorAll(`.${styles.optionBlock}`))
      const hoverIndex = allOptions.indexOf(optionElement)

      if (hoverIndex !== -1 && hoverIndex !== currentDragIndex) {
        setDragOverIndex(hoverIndex)

        const rect = optionElement.getBoundingClientRect()
        const middleY = rect.top + rect.height / 2

        optionElement.classList.remove(styles.dropTop, styles.dropBottom)
        if (clientY < middleY) {
          optionElement.classList.add(styles.dropTop)
        } else {
          optionElement.classList.add(styles.dropBottom)
        }
      }
    } else {
      setDragOverIndex(null)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging || currentDragIndex === null || dragOverIndex === null) {
      setIsDragging(false)
      setCurrentDragIndex(null)
      setDragOverIndex(null)

      if (dragItemRef.current) {
        dragItemRef.current.classList.remove(styles.dragging)
      }

      const items = document.querySelectorAll(`.${styles.optionBlock}`)
      items.forEach(item => {
        item.classList.remove(styles.dropTop, styles.dropBottom)
      })

      return
    }

    const dragIndex = currentDragIndex
    const dropIndex = dragOverIndex

    if (dragIndex !== dropIndex) {
      const newOrder = [...optionsOrder]
      const draggedOptionIndex = optionsOrder[dragIndex]

      newOrder.splice(dragIndex, 1)
      newOrder.splice(dropIndex, 0, draggedOptionIndex)

      setOptionsOrder(newOrder)
    }

    setIsDragging(false)
    setCurrentDragIndex(null)
    setDragOverIndex(null)

    if (dragItemRef.current) {
      dragItemRef.current.classList.remove(styles.dragging)
    }

    const items = document.querySelectorAll(`.${styles.optionBlock}`)
    items.forEach(item => {
      item.classList.remove(styles.dropTop, styles.dropBottom)
    })
  }

  const handleNext = async () => {
    if (!currentQuestion || !attemptId || optionsOrder.length !== 4 || isTransitioning) return

    try {
      setIsTransitioning(true)

      for (let i = 0; i < optionsOrder.length; i++) {
        const optionIndex = optionsOrder[i]
        const position = i + 1

        const option = currentQuestion.options[optionIndex]
        await saveAnswer(attemptId, {
          question_id: currentQuestion.id,
          option_id: option.id,
          text_value: position.toString()
        })
      }

      const totalQuestions = currentQuestion.progress?.total || 40
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
    if (!currentQuestion || !attemptId || optionsOrder.length !== 4 || isTransitioning) return

    try {
      setIsTransitioning(true)

      for (let i = 0; i < optionsOrder.length; i++) {
        const optionIndex = optionsOrder[i]
        const position = i + 1

        const option = currentQuestion.options[optionIndex]
        await saveAnswer(attemptId, {
          question_id: currentQuestion.id,
          option_id: option.id,
          text_value: position.toString()
        })
      }

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
            <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/disc">DISC</Link>
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
            <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/disc">DISC</Link>
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
            <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/disc">DISC</Link>
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
    : (currentQuestionIndex / 40) * 100

  const totalQuestions = currentQuestion.progress?.total || 40
  const isLastQuestion = currentQuestionIndex === totalQuestions

  return (
    <div
      className={styles.container}
      ref={containerRef}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.header}>
        <div className={styles.breadcrumbs}>
          <Link href="/">Главная</Link> &gt; <Link href="/tests">Тесты</Link> &gt; <Link href="/tests/disc">DISC</Link>
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
                {currentQuestion.progress?.index || currentQuestionIndex} из {currentQuestion.progress?.total || 40}
              </div>
            </div>
          </div>

          <div className={styles.progressText}>
            {currentQuestion.progress?.index || currentQuestionIndex} из {currentQuestion.progress?.total || 40}
          </div>
        </div>

        <h2 className={styles.questionTitle}>
          {currentQuestion.text}
        </h2>

        <div className={styles.listHeader}>
          <span className={styles.mostLabel}>Наиболее</span>
        </div>

        <div className={styles.sortableList} ref={listRef}>
          {optionsOrder.map((optionIndex, position) => {
            const option = currentQuestion.options[optionIndex]
            return (
              <div
                key={optionIndex}
                className={styles.optionBlock}
                draggable
                onDragStart={(e) => handleDragStart(e, position)}
                onDragOver={(e) => handleDragOver(e, position)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, position)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, position)}
              >
                <div className={styles.optionContent}>
                  <div className={styles.optionText}>{option.text}</div>
                  <div className={styles.dragHandle}>
                    <img src='/disc.svg' className={styles.disc} alt="Перетащить" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className={styles.listFooter}>
          <span className={styles.leastLabel}>Наименее</span>
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
              disabled={isTransitioning}
              className={styles.finishButton}
            >
              Завершить
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={isTransitioning}
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
