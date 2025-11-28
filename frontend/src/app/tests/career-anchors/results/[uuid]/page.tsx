'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import styles from './page.module.css'
const API_BASE_URL = 'http://127.0.0.1:8000';

interface Dimension {
  code: string
  title: string
  score: number
  level: string
  explanation_md: string
}

interface ResultData {
  test: {
    slug: string
    title: string
  }
  computed_at: string
  dimensions: Dimension[]
  summary_md: string
  viz: {
    type: string
    data: {
      labels: string[]
      values: number[]
    }
  }
  actions: {
    can_copy_link: boolean
    restart_url: string
  }
}

interface TopAnchors {
  primary: Dimension | null
  secondary: Dimension | null
}

const ANCHOR_DESCRIPTIONS: { [key: string]: string } = {
  "ПРОФКОМПЕТЕНТНОСТЬ": `Эта ориентация связана с вашими способностями и талантами в определенной области (научные исследования, техническое проектирование, финансовый анализ и т. д.). Вы стремитесь быть мастером своего дела и особенно удовлетворены, когда достигаете успехов в профессиональной сфере. Однако вы быстро теряете интерес к работе, которая не позволяет вам развивать свои способности. Одновременно вы ищете признания своих талантов, ожидая, что ваш статус будет соответствовать уровню мастерства. Вы готовы управлять другими в пределах своей компетентности, но само управление не является для вас самоцелью. Поэтому многие люди с подобной ориентацией избегают менеджерских ролей, воспринимая их как вынужденный шаг ради профессионального роста. Это одна из самых распространённых карьерных ориентаций в организацих, обеспечивающая принятие компетентных решений.`,

  "МЕНЕДЖМЕНТ": `В этом случае ключевое значение для вас имеет способность объединять усилия других людей, нести ответственность за итоговый результат и интегрировать различные функции организации. С возрастом и накоплением опыта эта ориентация становится выраженнее. Такая карьерная линия требует навыков межличностного и группового взаимодействия, эмоциональной устойчивости и готовности нести бремя власти и ответственности. Вы можете ощущать, что не реализовали карьерные цели, пока не займете позицию, позволяющую руководить разными направлениями деятельности предприятия: финансами, маркетингом, производством, разработками или продажами.`,

  "АВТОНОМИЯ": `Вашей первоочередной заботой является освобождение от организационных правил, предписаний и ограничений. У вас ярко выражено стремление всё делать по-своему: самостоятельно решать, когда, над чем и сколько работать. Вы не хотите подчиняться жёстким правилам организации (рабочее место, расписание, форменная одежда). Конечно, определённая потребность в автономии есть у каждом, но если эта ориентация выражена ярко, вы скорее пожертвуете карьерным ростом или дополнительными возможностями ради сохранения независимости. Вы можете работать в организации, которая предоставляет достаточно свободы, но не будете испытывать сильной привязанности или лояльности к ней, отвергая любые попытки ограничить вашу самостоятельность.`,

  "СТАБИЛЬНОСТЬ_РАБОТЫ": `Эта ориентация основана на потребности в безопасности и предсказуемости, чтобы будущие жизненные события были понятны и управляемы. Существует два типа стабильности — стабильность работы и стабильность места жительства.\n\nЕсли вам важна стабильность работы, вы стремитесь к организации, которая обеспечивает длительную занятость, хорошую репутацию, надежность, заботу о сотрудниках и уверенность в завтрашнем дне. Вы можете полностью доверить работодателю управление своей карьерой и готовы переехать, если компания этого потребует.\n\nЕсли же вам важна стабильность места жительства, вы стремитесь закрепиться в определенном регионе, «пустить корни», вкладываться в дом и менять работу только в том случае, если это позволит сохранить привязанность к месту.\n\nЛюди со стремлением к стабильности могут быть очень компетентными и занимать высокие должности, но часто отказываются от продвижения, если оно связано с риском, нестабильностью или временными неудобствами.`,

  "СТАБИЛЬНОСТЬ_МЕСТА": `Эта ориентация основана на потребности в безопасности и предсказуемости, чтобы будущие жизненные события были понятны и управляемы. Существует два типа стабильности — стабильность работы и стабильность места жительства.\n\nЕсли вам важна стабильность работы, вы стремитесь к организации, которая обеспечивает длительную занятость, хорошую репутацию, надежность, заботу о сотрудниках и уверенность в завтрашнем дне. Вы можете полностью доверить работодателю управление своей карьерой и готовы переехать, если компания этого потребует.\n\nЕсли же вам важна стабильность места жительства, вы стремитесь закрепиться в определенном регионе, «пустить корни», вкладываться в дом и менять работу только в том случае, если это позволит сохранить привязанность к месту.\n\nЛюди со стремлением к стабильности могут быть очень компетентными и занимать высокие должности, но часто отказываются от продвижения, если оно связано с риском, нестабильностью или временными неудобствами.`,

  "СЛУЖЕНИЕ": `Основными ценностями для вас являются помощь людям, забота о мире, стремление менять жизнь окружающих к лучшему. Вы выбираете направления деятельности, где можно приносить пользу — защиту окружающей среды, контроль качества продуктов, защиту прав потребителей и другие социально значимые сферы. Вы будете продолжать следовать этим ценностям даже при смене места работы. Если организация противоречит вашим убеждениям, вы не станете в ней работать и откажетесь от продвижения, если оно отдаляет вас от вашей миссии.`,

  "ВЫЗОВ": `Ваша мотивация строится на стремлении к конкуренции, преодолению препятствий и решению сложных задач. Вам важно побеждать, сравнивать результаты, испытывать себя. Вы рассматриваете многие ситуации через призму выигрыша и проигрыша. Для вас сама борьба и достижение победы важнее конкретной сферы деятельности. Если работа становится слишком простой или предсказуемой, вам быстро становится скучно — вам нужны новизна, динамика и вызовы.`,

  "ИНТЕГРАЦИЯ_ЖИЗНИ": `Вы стремитесь к гармоничному сочетанию разных сфер жизни: работы, семьи, саморазвития, отдыха. Вы не хотите, чтобы какая-то одна область полностью доминировала. Вам важен баланс, целостность и возможность жить «в целом хорошо», а не жертвовать чем-то одним ради карьеры. Вы больше цените качество жизни, своё окружение и возможность развиваться в разных направлениях, чем узконаправленный карьерный путь или привязанность к конкретной организации.`,

  "ПРЕДПРИНИМАТЕЛЬСТВО": `Вы стремитесь создавать новое, готовы рисковать и преодолевать препятствия. Вам важно иметь своё дело, собственную идею, бренд или проект, который становится продолжением вас самих. Для вас ключевым является создание чего-то значимого, даже если это связано с временными неудачами. Предпринимательская ориентация не обязательно связана с творчеством — главное для вас построить систему, вложить в неё душу и развивать её дальше, опираясь на собственные решения и амбиции.`
}

export default function CareerAnchorsResultPage() {
  const params = useParams()
  const uuid = params.uuid as string
  const [result, setResult] = useState<ResultData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_BASE_URL}/tests/career-anchors/results/${uuid}`)

        if (!response.ok) {
          throw new Error('Результат не найден')
        }

        const data = await response.json()
        setResult(data)
      } catch (err: any) {
        setError(err.message || 'Произошла ошибка при загрузке результата')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResult()
  }, [uuid])

  const getTopAnchors = (): TopAnchors => {
    if (!result) return { primary: null, secondary: null }

    const anchorsWithScores = result.dimensions
      .filter(dim => dim.score > 5)
      .sort((a, b) => b.score - a.score)

    return {
      primary: anchorsWithScores[0] || null,
      secondary: anchorsWithScores[1] || null
    }
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.resultCard}>
          <div className={styles.loading}>Загрузка результата...</div>
        </div>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className={styles.container}>
        <div className={styles.resultCard}>
          <div className={styles.error}>
            <h3>Ошибка</h3>
            <p>{error || 'Результат не найден'}</p>
            <Link href="/tests/career-anchors" className={styles.restartButton}>
              Пройти тест заново
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { primary, secondary } = getTopAnchors()

  return (
    <div className={styles.container}>

      <div>
        <h1 className={styles.title}>Результаты теста "Якоря карьеры"</h1>

        {/* основной результат */}
        <div className={styles.resultSection}>
          {primary ? (
            <>
              {secondary ? (
                <>
                  <h2 className={styles.sectionTitle}>Ваши карьерные якоря</h2>

                  <div className={styles.anchorCard}>
                    <h3 className={styles.anchorTitle}>
                      Ведущий якорь: {primary.title}
                    </h3>
                    <div className={styles.score}>
                      Балл: {primary.score.toFixed(1)} / 10 ({primary.level})
                    </div>
                    <p className={styles.anchorDescription}>
                      {ANCHOR_DESCRIPTIONS[primary.code]}
                    </p>
                  </div>

                  <div className={styles.anchorCard}>
                    <h3 className={styles.anchorTitle}>
                      Вспомогательный якорь: {secondary.title}
                    </h3>
                    <div className={styles.score}>
                      Балл: {secondary.score.toFixed(1)} / 10 ({secondary.level})
                    </div>
                    <p className={styles.anchorDescription}>
                      {ANCHOR_DESCRIPTIONS[secondary.code]}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <h2 className={styles.sectionTitle}>Ваш карьерный якорь</h2>
                  <div className={styles.anchorCard}>
                    <h3 className={styles.anchorTitle}>
                      Ведущий якорь: {primary.title}
                    </h3>
                    <div className={styles.score}>
                      Балл: {primary.score.toFixed(1)} / 10 ({primary.level})
                    </div>
                    <p className={styles.anchorDescription}>
                      {ANCHOR_DESCRIPTIONS[primary.code]}
                    </p>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className={styles.noAnchors}>
              <h2 className={styles.sectionTitle}>Результат</h2>
              <p className={styles.noAnchorsText}>
                У вас не выделился ни один из карьерных якорей. Это может означать,
                что сейчас карьера не является для вас важной целью.
              </p>
            </div>
          )}
        </div>

        {/* все баллы */}
        <div className={styles.allScoresSection}>
          <h3 className={styles.scoresTitle}>Все показатели</h3>
          <div className={styles.scoresGrid}>
            {result.dimensions.map((dimension) => (
              <div key={dimension.code} className={styles.scoreItem}>
                <div className={styles.scoreHeader}>
                  <span className={styles.scoreName}>{dimension.title}</span>
                  <span className={styles.scoreValue}>{dimension.score.toFixed(1)}</span>
                </div>
                <div className={styles.scoreLevel}>{dimension.level}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actions}>
            <button className={styles.saveBtn} onClick={() => {
            const currentUrl = window.location.href;
            navigator.clipboard.writeText(currentUrl);
            alert('Ссылка на результат скопирована в буфер обмена!');
            }}>
            Сохранить результат
            </button>
            <button className={styles.restartBtn} onClick={() => {
            window.location.href = result.actions.restart_url;
            }}>
            Пройти заново
            </button>
        </div>
      </div>
    </div>
  )
}
