'use client'
import { useState } from 'react'
import styles from './Services.module.css'
import Link from 'next/link'

export default function Services() {
  const [type, setType] = useState<'individuals' | 'businesses'>('individuals')
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const isIndividuals = type === 'individuals'
  const data = isIndividuals ? individualServices : businessServices

  const toggleCard = (index: number) => {
    setExpandedCard(prev => (prev === index ? null : index))
  }

  return (
    <section className={styles.servicesSection} id="services">
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${isIndividuals ? styles.active : ''}`}
          onClick={() => setType('individuals')}
        >
          ДЛЯ ФИЗИЧЕСКИХ ЛИЦ
        </button>
        <button
          className={`${styles.tab} ${!isIndividuals ? styles.active : ''}`}
          onClick={() => setType('businesses')}
        >
          ДЛЯ ЮРИДИЧЕСКИХ ЛИЦ
        </button>
      </div>

      <div className={styles.cardsWrapper}>
        <div className={styles.cards}>
          {data.map((item, i) => {
            const isExpanded = expandedCard === i
            return (
              <div className={styles.card} key={i}>
                <div className={styles.cardTitle}>{item.title}</div>
                <div className={styles.cardDescription}>{item.description}</div>
                <div className={styles.cardDuration}>
                  <strong>Продолжительность:</strong> {item.duration}
                </div>

                {isExpanded && (
                  <div className={styles.cardPrice}>
                    <strong>Стоимость:</strong> {item.price}
                  </div>
                )}

                <div className={styles.priceButton} onClick={() => toggleCard(i)}>
                  {isExpanded ? 'Скрыть' : 'Подробнее'}
                </div>
              </div>
            )
          })}
        </div>
        <Link
          href={{ pathname: '/services', query: { type: isIndividuals ? 'individual' : 'business' } }}
          className={styles.moreLink}
        >
          Больше услуг →
        </Link>
      </div>
    </section>
  )
}




const individualServices = [
  {
    title: 'Консультирование',
    description: 'Встреча, на которой обсуждается и анализируется запрос клиента и вырабатываются шаги по изменению ситуации и достижению требуемых результатов. Проводится в формате онлайн в любом удобном для клиента приложении.',
    duration: '1–1.5 ч.',
    price: 'от 4 000 до 5 000 ₽ в зависимости от продолжительности (при покупке более 10 консультаций предоставляется скидка)',
  },
  {
    title: 'Работа с негативным состоянием',
    description: 'Выявляем причины возникновения негативного состояния путём интервью, проведения специальных тестов и фиксации состояния в течение недели, анализируем полученные результаты и вырабатываем стратегию.',
    duration: '4 часовых сеанса (1 месяц)',
    price: '20 000 ₽',
  },
  {
    title: 'Коучинг, наставничество, эффективность',
    description: 'Определение целей, проверка на значимость, составление плана и сопровождение. Сеансы можно заменить звонками или сообщениями.',
    duration: '1–1.5 ч.',
    price: '20 000 ₽',
  },
]

const businessServices = [
  {
    title: 'Консультирование',
    description: 'Консультации организационного психолога для сотрудников вашей компании по разрешению рабочих ситуаций, состоянию, мотивации, планам роста и другим.',
    duration: '1 час',
    price: '4 000 ₽ в час, при покупке более 40 часов скидки',
  },
  {
    title: 'Комплексная диагностика компании',
    description: 'Вводные встречи с руководством, план диагностики, анализ результатов, отчёт и рекомендации. Требуется участие персонала.',
    duration: '1 месяц',
    price: 'от 100 000 ₽ для малого бизнеса',
  },
  {
    title: 'Разработка стратегии компании для привлечения клиентов и сотрудников',
    description: 'Анализ целевой аудитории, имиджа и ассоциаций. Психологический подход. Предоставление отчета и презентация.',
    duration: 'от 2 недель (включая не менее 2 встреч)',
    price: 'от 50 000 ₽',
  },
]
