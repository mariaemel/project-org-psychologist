'use client'
import { useState } from 'react'
import styles from './Services.module.css'
import Link from 'next/link'

export default function Services() {
  const [type, setType] = useState<'individuals' | 'businesses'>('individuals')
  const isIndividuals = type === 'individuals'
  const data = isIndividuals ? individualServices : businessServices

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
          {data.map((item, i) => (
            <div className={styles.card} key={i}>
              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardDescription}>{item.description}</div>
              <div className={styles.cardDuration}>
                <strong>Продолжительность:</strong> {item.duration}
              </div>
              <div className={styles.priceButton}>Подробнее</div>
            </div>
          ))}
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
  },
  {
    title: 'Работа с негативным состоянием',
    description: 'Выявляем причины возникновения негативного состояния путем интервью, проведения специальных тестов и фиксации своего состояния в течение недели, анализируем полученные результат, вырабатываем эффективную стратегию улучшения состояни и недопущения повторения текущей ситуации в дальнейшем. Улучшения обычно наступают после первого сеанса, но для того, чтобы всё не вернулось нужно разобраться со всеми причинами.',
    duration: '4 часовых сеанса (1 месяц)',
  },
  {
    title: 'Коучинг, наставничество, эффективность',
    description: 'Определение целей, проверка их на значимость для клиента (не всегда то, что мы хотим, это то, что соответствует нашим ценностям, планам и долгосрочным целям, иногда это навязано другими), составление плана по их достижению, контроль и мотивация в процессе. По желанию клиента сеансы могут быть разбиты на более короткие или заменены на звонки либо общение в мессенджере.',
    duration: '1–1.5 ч.',
  },
]

const businessServices = [
  {
    title: 'Консультирование',
    description: 'Консультации организационного психолога для сотрудников вашей компании по разрешению рабочих ситуаций, состоянию, мотивации, планам роста и другим.',
    duration: '1 час',
  },
  {
    title: 'Комплексная диагностика компании',
    description: 'Одна или несколько вводных встреч с руководством или собственником для составления списка проблем. Составления детального плана по диагностике организации и его реализация. Анализ полученных результатов, составления отчета и презентации по выявленным проблемам и их причинам и включающий рекомендации по изменению ситуации. Руководитель организации должен обеспечить участие персонала в проведении диагностики.',
    duration: '1 месяц',
  },
  {
    title: 'Разработка стратегии компании для привлечения клиентов и сотрудников',
    description: 'Услуга чем-то похожа на маркетинговое продвижение, но предполагает в первую очередь психологический подход к анализу целевой аудитории, имиджа, который компаний хочет иметь в её глазах, и ассоции, которые хочет вызывать. По результатам работы предоставляется отчет с рекомендациями и проводится презентация.',
    duration: 'от 2 недель (включая не менее 2 встреч)',
  },
]
