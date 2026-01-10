'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Plugin,
  ChartOptions,
  FontSpec
} from 'chart.js'
import styles from './page.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

import { API_BASE_URL } from '@/config';

interface Dimension {
  code: string
  title: string
  score: number
  level: string
  explanation_md: string
}
interface AnchorConfig {
  name: string;
  description: string;
  color: string;
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

const ANCHOR_CONFIG: { [key: string]: { name: string; description: string; color: string } } = {
  "СТАБИЛЬНОСТЬ_РАБОТЫ": {
    name: "Стабильность",
    description: `Эта ориентация основана на потребности в безопасности и предсказуемости, чтобы будущие жизненные события были поняты и управляемы. Существует два типа стабильности — стабильность работы и стабильность места жительства.

Если вам важна стабильность работы, вы стремитесь к организации, которая обеспечивает длительную занятость, хорошую репутацию, надёжность, заботу о сотрудниках и уверенность в завтрашнем дне. Вы можете полностью доверить работодателю управление своей карьерой и готовы переехать, если компания этого потребует.

Если же вам важна стабильность места жительства, вы стремитесь закрепиться в определенном регионе, «пустить корни», вкладываться в дом и менять работу только в том случае, если это позволит сохранить привязанность к месту.

Люди со стремлением к стабильности могут быть очень компетентными и занимать высокие должности, но часто отказываются от продвижения, если оно связано с риском, нестабильностью или временными неудобствами.`,
    color: '#575799'
  },
  "СТАБИЛЬНОСТЬ_МЕСТА": {
    name: "Стабильность",
    description: `Эта ориентация основана на потребности в безопасности и предсказуемости, чтобы будущие жизненные события были поняты и управляемы. Существует два типа стабильности — стабильность работы и стабильность места жительства.

Если вам важна стабильность работы, вы стремитесь к организации, которая обеспечивает длительную занятость, хорошую репутацию, надёжность, заботу о сотрудниках и уверенность в завтрашнем дне. Вы можете полностью доверить работодателю управление своей карьерой и готовы переехать, если компания этого потребует.

Если же вам важна стабильность места жительства, вы стремитесь закрепиться в определенном регионе, «пустить корни», вкладываться в дом и менять работу только в том случае, если это позволит сохранить привязанность к месту.

Люди со стремлением к стабильности могут быть очень компетентными и занимать высокие должности, но часто отказываются от продвижения, если оно связано с риском, нестабильностью или временными неудобствами.`,
    color: '#575799'
  },
  "ИНТЕГРАЦИЯ_ЖИЗНИ": {
    name: "Интеграция стилей жизни",
    description: `Вы стремитесь к гармоничному сочетанию разных сфер жизни: работы, семьи, саморазвития, отдыха. Вы не хотите, чтобы какая-то одна область полностью доминировала. Вам важен баланс, целостность и возможность жить «в целом хорошо», а не жертвовать чем-то одним ради карьеры. Вы больше цените качество жизни, своё окружение и возможность развиваться в разных направлениях, чем узконаправленный карьерный путь или привязанность к конкретной организации.`,
    color: '#575799'
  },
  "СЛУЖЕНИЕ": {
    name: "Служение",
    description: `Основными ценностями для вас являются помощь людям, забота о мире, стремление менять жизнь окружающих к лучшему. Вы выбираете направления деятельности, где можно приносить пользу — защиту окружающей среды, контроль качества продуктов, защиту прав потребителей и другие социально значимые сферы. Вы будете продолжать следовать этим ценностям даже при смене места работы. Если организация противоречит вашим убеждениям, вы не станете в ней работать и откажетесь от продвижения, если оно отдаляет вас от вашей миссии.`,
    color: '#575799'
  },
  "МЕНЕДЖМЕНТ": {
    name: "Менеджмент",
    description: `В этом случае ключевое значение для вас имеет способность объединять усилия других людей, нести ответственность за итоговый результат и интегрировать различные функции организации. С возрастом и накоплением опыта эта ориентация становится выраженнее. Такая карьерная линия требует навыков межличностного и группового взаимодействия, эмоциональной устойчивости и готовности нести бремя власти и ответственности. Вы можете ощущать, что не реализовали карьерные цели, пока не займете позицию, позволяющую руководить разными направлениями деятельности предприятия: финансами, маркетингом, производством, разработками или продажами.`,
    color: '#575799'
  },
  "АВТОНОМИЯ": {
    name: "Автономия",
    description: `Вашей первоочередной заботой является освобождение от организационных правил, предписаний и ограничений. У вас ярко выражено стремление всё делать по-своему: самостоятельно решать, когда, над чем и сколько работать. Вы не хотите подчиняться жёстким правилам организации (рабочее место, расписание, форменная одежда). Конечно, определённая потребность в автономии есть у каждом, но если эта ориентация выражена ярко, вы скорее пожертвуете карьерным ростом или дополнительными возможностями ради сохранения независимости. Вы можете работать в организации, которая предоставляет достаточно свободы, но не будете испытывать сильной привязанности или лояльности к ней, отвергая любые попытки ограничить вашу самостоятельность.`,
    color: '#575799'
  },
  "ПРОФКОМПЕТЕНТНОСТЬ": {
    name: "Профессиональная компетентность",
    description: `Эта ориентация связана с вашими способностями и талантами в определенной области (научные исследования, техническое проектирование, финансовый анализ и т. д.). Вы стремитесь быть мастером своего дела и особенно удовлетворены, когда достигаете успехов в профессиональной сфере. Однако вы быстро теряете интерес к работе, которая не позволяет вам развивать свои способности. Одновременно вы ищете признания своих талантов, ожидая, что ваш статус будет соответствовать уровню мастерства. Вы готовы управлять другими в пределах своей компетентности, но само управление не является для вас самоцелью. Поэтому многие люди с подобной ориентацией избегают менеджерских ролей, воспринимая их как вынужденный шаг ради профессионального роста. Это одна из самых распространённых карьерных ориентаций в организации, обеспечивающая принятие компетентных решений.`,
    color: '#575799'
  },
  "ПРЕДПРИНИМАТЕЛЬСТВО": {
    name: "Предпринимательство",
    description: `Вы стремитесь создавать новое, готовы рисковать и преодолевать препятствия. Вам важно иметь своё дело, собственную идею, бренд или проект, который становится продолжением вас самих. Для вас ключевым является создание чего-то значимого, даже если это связано с временными неудачами. Предпринимательская ориентация не обязательно связана с творчеством — главное для вас построить систему, вложить в неё душу и развивать её дальше, опираясь на собственные решения и амбиции.`,
    color: '#575799'
  },
  "ВЫЗОВ": {
    name: "Вызов",
    description: `Ваша мотивация строится на стремлении к конкуренции, преодолению препятствий и решению сложных задач. Вам важно побеждать, сравнивать результаты, испытывать себя. Вы рассматриваете многие ситуации через призму выигрыша и проигрыша. Для вас сама борьба и достижение победы важнее конкретной сферы деятельности. Если работа становится слишком простой или предсказуемой, вам быстро становится скучно — вам нужны новизна, динамика и вызовы.`,
    color: '#575799'
  }
}

const getLevel = (score: number): string => {
  if (score >= 8) return 'высокий'
  if (score >= 6) return 'заметный'
  if (score >= 4) return 'умеренный'
  return 'низкий'
}

const formatAnchorName = (code: string): string => {
  const config = ANCHOR_CONFIG[code]
  if (!config) return code

  if (code === "СТАБИЛЬНОСТЬ_РАБОТЫ") {
    return "Стабильность работы";
  } else if (code === "СТАБИЛЬНОСТЬ_МЕСТА") {
    return "Стабильность места";
  }

  return config.name
}

export default function CareerAnchorsResultPage() {
  const params = useParams()
  const uuid = params.uuid as string
  const [result, setResult] = useState<ResultData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const chartRef = useRef(null)

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

  // хотя бы один якорь с баллом >= 5
  const hasAnchorWithScore5OrMore = () => {
    if (!result) return false
    return result.dimensions.some(dim => dim.score >= 5)
  }

  // одинаковые баллы по двум и более якорям >= 5
  const hasEqualHighScores = () => {
    if (!result) return false

    const highScoreDimensions = result.dimensions.filter(dim => dim.score >= 5)

    if (highScoreDimensions.length < 2) return false

    const scoreGroups: { [key: string]: number } = {}

    highScoreDimensions.forEach(dim => {
      const roundedScore = dim.score.toFixed(1)
      scoreGroups[roundedScore] = (scoreGroups[roundedScore] || 0) + 1
    })

    return Object.values(scoreGroups).some(count => count >= 2)
  }

  // два главных якоря
  const getTopAnchors = (): TopAnchors => {
    if (!result) return { primary: null, secondary: null }

    const filteredAnchors = result.dimensions.filter(dim => dim.score >= 5)
    const sortedAnchors = [...filteredAnchors].sort((a, b) => b.score - a.score)

    return {
      primary: sortedAnchors.length > 0 ? sortedAnchors[0] : null,
      secondary: sortedAnchors.length > 1 ? sortedAnchors[1] : null
    }
  }

  const getDisplayCase = () => {
    if (!result) return null

    const hasAnchor = hasAnchorWithScore5OrMore()

    // нет якорей >= 5
    if (!hasAnchor) {
      return "case1"
    }

    // есть одинаковые баллы >= 5
    if (hasEqualHighScores()) {
      return "case2"
    }

    // выводим два якоря
    return "case3"
  }

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (error || !result) {
    return (
      <div className={styles.error}>
        <h3>Ошибка</h3>
        <p>{error || 'Результаты не найдены'}</p>
        <Link href="/tests/career-anchors" className={styles.restartBtn}>
          Пройти тест заново
        </Link>
      </div>
    )
  }

  const displayCase = getDisplayCase()
  const { primary, secondary } = getTopAnchors()

  const formatAnchorName = (code: string): string => {
    const config = ANCHOR_CONFIG[code]
    if (!config) return code

    if (code === "СТАБИЛЬНОСТЬ_РАБОТЫ") {
      return "Стабильность работы"
    } else if (code === "СТАБИЛЬНОСТЬ_МЕСТА") {
      return "Стабильность места"
    }

    return config.name
  }

  const getBarColor = (dimension: Dimension, index: number) => {
    if (displayCase === "case1") {
      return '#B2FFCC'
    }

    if (displayCase === "case2") {
      if (!result) return '#B2FFCC'

      const highScoreDimensions = result.dimensions.filter(dim => dim.score >= 5)

      if (highScoreDimensions.length < 2) return '#B2FFCC'

      const scoreGroups: { [key: string]: number } = {}
      highScoreDimensions.forEach(dim => {
        const roundedScore = dim.score.toFixed(1)
        scoreGroups[roundedScore] = (scoreGroups[roundedScore] || 0) + 1
      })

      const duplicateScores = Object.keys(scoreGroups)
        .filter(score => scoreGroups[score] >= 2)
        .map(score => parseFloat(score))

      if (dimension.score >= 5 && duplicateScores.includes(dimension.score)) {
        return '#92A5FA'
      }

      return '#B2FFCC'
    }

    if (primary && dimension.code === primary.code) {
      return '#92A5FA'
    }

    if (secondary && dimension.code === secondary.code) {
      return '#DCE3FF'
    }

    return '#B2FFCC'
  }

  const sortedForChart = [...result.dimensions].sort((a, b) => b.score - a.score)

  const chartData = {
    labels: sortedForChart.map(dim => formatAnchorName(dim.code)),
    datasets: [
      {
        label: 'Баллы',
        data: sortedForChart.map(dim => dim.score),
        backgroundColor: sortedForChart.map((dim, index) => getBarColor(dim, index)),
        borderColor: sortedForChart.map((dim, index) => getBarColor(dim, index)),
        borderWidth: 1,
        borderRadius: 5,
        barPercentage: 0.8,
        categoryPercentage: 0.8,
      }
    ]
  }

  const drawValuesPlugin: Plugin<'bar'> = {
    id: 'drawValues',
    afterDatasetsDraw(chart: any) {
      const { ctx, chartArea, scales, data } = chart
      const meta = chart.getDatasetMeta(0)

      if (!meta.data.length || !chartArea || !scales.y) return

      ctx.save()

      ctx.beginPath()
      ctx.strokeStyle = '#D6D6D6'
      ctx.lineWidth = 2
      const lineX = chartArea.left - 20
      ctx.moveTo(lineX, chartArea.top)
      ctx.lineTo(lineX, chartArea.bottom)
      ctx.stroke()

      ctx.textAlign = 'right'
      ctx.textBaseline = 'alphabetic';
      ctx.font = '18px "Nunito Sans", sans-serif';
      ctx.fillStyle = '#333333'

      const fixedRightPosition = chartArea.right + 45
      meta.data.forEach((bar: any, index: number) => {
        const value = data.datasets[0].data[index]
        const y = bar.y
        const verticalOffset = 5
        const adjustedY = y + verticalOffset
        ctx.fillText(value.toFixed(1), fixedRightPosition, adjustedY)
      })

      ctx.restore()
    }
  }

  ChartJS.register(drawValuesPlugin)

  const chartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw as number || 0
            return `${value} баллов (${getLevel(value)})`
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 10,
        display: true,
        ticks: {
          display: false,
          stepSize: 1
        },
        grid: {
          display: false,
        },
        border: {
          display: false
        },
        title: {
          display: false
        }
      },
      y: {
        ticks: {
          font: {
            size: 18,
            weight: 'normal',
            family: '"Nunito Sans", sans-serif'
          } as FontSpec,
          padding: 30,
          color: '#333',
          crossAlign: 'far' as const,
          callback: function(value, index, values) {
            const label = this.getLabelForValue(index as number);
            if (label.length > 20) {
              if (label === 'Профессиональная компетентность') {
                return ['Профессиональная', 'компетентность'];
              }
              if (label === 'Интеграция стилей жизни') {
                return ['Интеграция', 'стилей жизни'];
              }
            }
            return label;
          }
        },
        grid: {
          display: false
        },
        border: {
          display: false
        },
        afterFit: function(scale) {
          scale.left = 200;
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 50,
        top: 20,
        bottom: 20
      }
    }
  }

  return (
    <div className={styles.container}>
      {/* диаграмма */}
      <div className={styles.chartSection}>
        <div className={styles.chartContainer}>
          <div className={styles.chartWrapper}>
            <Bar
              ref={chartRef}
              data={chartData}
              options={chartOptions}
              height={800}
            />
          </div>
        </div>
      </div>

      {/* мобильная версия диаграммы */}
      <div className={styles.mobileChartSection}>
        <div className={styles.mobileChartContainer}>
          {sortedForChart.map((dimension, index) => {
            let barColor;
            if (displayCase === "case1") {
              barColor = '#B2FFCC';
            } else if (displayCase === "case2") {
              if (dimension.score >= 5) {
                const highScoreDimensions = result.dimensions.filter(dim => dim.score >= 5);
                const scoreGroups: any = {};
                highScoreDimensions.forEach(dim => {
                  const roundedScore = dim.score.toFixed(1);
                  scoreGroups[roundedScore] = (scoreGroups[roundedScore] || 0) + 1;
                });

                const duplicateScores = Object.keys(scoreGroups)
                  .filter(score => scoreGroups[score] >= 2)
                  .map(score => parseFloat(score));

                if (duplicateScores.includes(dimension.score)) {
                  barColor = '#92A5FA';
                } else {
                  barColor = '#B2FFCC';
                }
              } else {
                barColor = '#B2FFCC';
              }
            } else if (displayCase === "case3") {
              if (primary && dimension.code === primary.code) {
                barColor = '#92A5FA';
              } else if (secondary && dimension.code === secondary.code) {
                barColor = '#DCE3FF';
              } else {
                barColor = '#B2FFCC';
              }
            }

            return (
              <div key={dimension.code} className={styles.mobileChartItem}>
                <div className={styles.mobileChartHeader}>
                  <div className={styles.mobileChartName}>
                    {formatAnchorName(dimension.code)}
                  </div>
                  <div className={styles.mobileChartValue}>
                    {dimension.score.toFixed(1)}
                  </div>
                </div>
                <div className={styles.mobileProgressBar}>
                  <div
                    className={styles.mobileProgressFill}
                    style={{
                      width: `${(dimension.score / 10) * 100}%`,
                      backgroundColor: barColor
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* нет якорей >= 5 */}
      {displayCase === "case1" && (
        <div className={styles.specialMessage}>
          <div className={styles.messageCard}>
            <div className={styles.messageText}>
              <p>У вас не выделился ни один из карьерных якорей. Это может означать, что сейчас карьера не является для вас важной целью.</p>
            </div>
          </div>
        </div>
      )}

      {/* есть одинаковые баллы >= 5 */}
      {displayCase === "case2" && (
        <div className={styles.specialMessage}>
          <div className={styles.messageCard}>
            <div className={styles.messageText}>
              <p>У вас нет ярко выраженных карьерных якорей. Это может означать, что на данный момент ни одно профессиональное направление не доминирует.</p>
            </div>
          </div>
        </div>
      )}

      {/* выводим два якоря */}
      {displayCase === "case3" && (
        <div className={styles.infoColumns}>
          <div className={styles.column}>
            <div className={styles.anchorCard}>
              <div className={styles.anchorHeader}>
                <h3 className={styles.anchorTitle}>
                  Ваш ведущий карьерный якорь
                </h3>
                {primary && (
                  <div className={styles.anchorName} style={{ color: ANCHOR_CONFIG[primary.code]?.color }}>
                    {formatAnchorName(primary.code)}
                  </div>
                )}
              </div>

              {primary && (
                <div className={styles.anchorDescription}>
                  {ANCHOR_CONFIG[primary.code]?.description.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.column}>
            {secondary ? (
              <div className={styles.anchorCard}>
                <div className={styles.anchorHeader}>
                  <h3 className={styles.anchorTitle}>
                    Дополнительный карьерный якорь
                  </h3>
                  <div className={styles.anchorName} style={{ color: ANCHOR_CONFIG[secondary.code]?.color }}>
                    {formatAnchorName(secondary.code)}
                  </div>
                </div>

                <div className={styles.anchorDescription}>
                  {ANCHOR_CONFIG[secondary.code]?.description.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.anchorCard}>
                <div className={styles.anchorHeader}>
                  <h3 className={styles.anchorTitle}>
                    Дополнительный карьерный якорь
                  </h3>
                </div>
                <div className={styles.noSecondary}>
                  <p>У вас нет ярко выраженного дополнительного карьерного якоря</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.actions}>
        <button className={styles.saveBtn} onClick={() => {
          const currentUrl = window.location.href

          const modal = document.createElement('div')
          modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            font-family: 'Inter', sans-serif;
          `

          const modalContent = document.createElement('div')
          modalContent.style.cssText = `
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          `

          const title = document.createElement('h3')
          title.textContent = 'Копирование ссылки на результат'
          title.style.cssText = `
            margin-top: 0;
            margin-bottom: 20px;
            color: #333;
            font-size: 18px;
          `

          const description = document.createElement('p')
          description.textContent = 'Скопируйте ссылку ниже, чтобы сохранить результат теста:'
          description.style.cssText = `
            margin-bottom: 15px;
            color: #666;
            font-size: 14px;
          `

          const linkContainer = document.createElement('div')
          linkContainer.style.cssText = `
            display: flex;
            margin-bottom: 25px;
            border: 1px solid #ddd;
            border-radius: 4px;
            overflow: hidden;
          `

          const linkInput = document.createElement('input')
          linkInput.type = 'text'
          linkInput.value = currentUrl
          linkInput.readOnly = true
          linkInput.style.cssText = `
            flex-grow: 1;
            padding: 10px 15px;
            border: none;
            font-size: 14px;
            color: #333;
            background-color: #f9f9f9;
            overflow: hidden;
            text-overflow: ellipsis;
          `

          const copyButton = document.createElement('button')

          const buttonContainer = document.createElement('div')
          buttonContainer.style.cssText = `
            display: flex;
            justify-content: flex-end;
            gap: 10px;
          `

          const closeButton = document.createElement('button')
          closeButton.textContent = 'Закрыть'
          closeButton.style.cssText = `
            background-color: #9D9DCC;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.2s;
          `

          closeButton.onmouseover = () => {
            closeButton.style.backgroundColor = '#8888b1'
          }
          closeButton.onmouseout = () => {
            closeButton.style.backgroundColor = '#9D9DCC'
          }

          closeButton.onclick = () => {
            document.body.removeChild(modal)
          }

          linkContainer.appendChild(linkInput)
          linkContainer.appendChild(copyButton)

          buttonContainer.appendChild(closeButton)

          modalContent.appendChild(title)
          modalContent.appendChild(description)
          modalContent.appendChild(linkContainer)
          modalContent.appendChild(buttonContainer)

          modal.appendChild(modalContent)
          document.body.appendChild(modal)

          modal.onclick = (e) => {
            if (e.target === modal) {
              document.body.removeChild(modal)
            }
          }

          linkInput.select()
        }}>
          Сохранить результат
        </button>
        <button className={styles.restartBtn} onClick={() => {
          window.location.href = result.actions.restart_url
        }}>
          Пройти заново
        </button>
      </div>
    </div>
  )
}
