'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import styles from './page.module.css'
import {
  DISC_DESCRIPTIONS,
  DISC_RECOMMENDATIONS,
  DiscType
} from './discContent'
import { API_BASE_URL } from '@/config';
import RequestForm from '@/components/RequestForm/RequestForm'

type DiscPercent = Record<'D' | 'I' | 'S' | 'C', number>

interface DiscRawJson {
  work: {
    type: DiscType
    raw: DiscPercent
    percent: DiscPercent
    balanced: boolean
  }
  stress: {
    type: DiscType
    raw: DiscPercent
    percent: DiscPercent
    balanced: boolean
  }
  flags: Record<string, any>
  viz: {
    type: string
    data: {
      labels: string[]
      work: {
        raw: number[]
        values: number[]
      }
      stress: {
        raw: number[]
        values: number[]
      }
    }
  }
}

interface ResultData {
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
  raw_json?: DiscRawJson
}

function DiscDiagram({
  title,
  values,
  showPercentages = false
}: {
  title: string
  values: DiscPercent
  showPercentages?: boolean
}) {
  const center = 175
  const stroke = 15


  const DIM_ORDER: Array<'D' | 'I' | 'S' | 'C'> = ['D', 'I', 'S', 'C']
  const sortedEntries = Object.entries(values)
    .sort(([, a], [, b]) => b - a)

  const sortedDims = sortedEntries.map(([dim]) => dim as 'D' | 'I' | 'S' | 'C')

  return (
    <div className={styles.chartBlock}>
      <svg width="500" height="500" viewBox="0 0 350 350" className={styles.chartSvg}>
        <line x1="175" y1="20" x2="175" y2="330" stroke="#e0e0e0" strokeWidth="1" />
        <line x1="20" y1="175" x2="330" y2="175" stroke="#e0e0e0" strokeWidth="1" />

        <circle cx="175" cy="175" r="130" fill="none" stroke="#f0f0f0" strokeWidth="1" />

        <text
          x="175"
          y="30"
          textAnchor="middle"
          dominantBaseline="middle"
          className={styles.zeroMarker}
        >
          0
        </text>

        {DIM_ORDER.map((dim, index) => {
          const value = values[dim]
          const positionInSorted = sortedDims.indexOf(dim)
          const startRadius = 110
          const radiusIncrement = 22
          const r = startRadius - positionInSorted * radiusIncrement

          const startAngle = -90
          const angleLength = Math.min((value / 100) * 360, 359.99)

          const startAngleRad = (startAngle * Math.PI) / 180
          const endAngleRad = ((startAngle - angleLength) * Math.PI) / 180

          const startX = center + r * Math.cos(startAngleRad)
          const startY = center + r * Math.sin(startAngleRad)

          const endX = center + r * Math.cos(endAngleRad)
          const endY = center + r * Math.sin(endAngleRad)

          const largeArcFlag = angleLength > 180 ? 1 : 0

          const pathData = `
            M ${startX} ${startY}
            A ${r} ${r} 0 ${largeArcFlag} 0 ${endX} ${endY}
          `

          const letterOffset = 1
          const letterX = center + 10
          const letterY = center + (r - letterOffset) * Math.sin(startAngleRad)

          const outerRadius = 145
          const outerValueX = center + outerRadius * Math.cos(endAngleRad)
          const outerValueY = center + outerRadius * Math.sin(endAngleRad)

          return (
            <g key={`dim-${dim}`}>
              <path
                d={pathData}
                fill="none"
                strokeWidth={stroke}
                className={styles[`dim${dim}`]}
              />

              <line
                x1={center}
                y1={center}
                x2={outerValueX}
                y2={outerValueY}
                stroke="#e0e0e0"
              />

              <text
                x={letterX}
                y={letterY}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.dimLetter}
                style={{
                  textOrientation: 'mixed'
                }}
              >
                {dim}
              </text>

              <text
                x={outerValueX}
                y={outerValueY}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.dimValue}
              >
                {value}
              </text>
            </g>
          )
        })}
      </svg>
      <div className={styles.chartTitle}>{title}</div>
    </div>
  )
}

export default function DiscResultPage() {
  const params = useParams()
  const uuid = params.uuid as string
  const [result, setResult] = useState<ResultData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [selectedServiceName, setSelectedServiceName] = useState('Консультация по результатам теста DISC')

  useEffect(() => {
    const fetchResult = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_BASE_URL}/tests/disc/results/${uuid}`)

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

  if (isLoading) {
    return <div className={styles.loading}>Загрузка…</div>
  }

  if (error || !result?.raw_json) {
    return (
      <div className={styles.error}>
        <h3>Ошибка</h3>
        <p>{error || 'Результат не найден'}</p>
      </div>
    )
  }

  const { work, stress } = result.raw_json
  const sameType = work.type === stress.type

  const workDesc = DISC_DESCRIPTIONS[work.type]
  const stressDesc = DISC_DESCRIPTIONS[stress.type]

  const workRec = DISC_RECOMMENDATIONS[work.type]
  const stressRec = DISC_RECOMMENDATIONS[stress.type]

  function ColoredTypeDisplay({ type }: { type: string }) {
    if (type.length === 1) {
      return (
        <span className={styles[`type${type}`]}>
          {type}
        </span>
      )
    }

    return (
      <>
        {" "}
        {type.split('').map((letter, index) => (
          <span
            key={index}
            className={styles[`type${letter}`]}
          >
            {letter}
          </span>
        ))}
      </>
    )
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {sameType ? (
          <div className={styles.singleDiagramSection}>
            <div className={styles.diagram1}>
                <DiscDiagram
                title=""
                values={work.percent}
                showPercentages={true}
                />
            </div>

            <div className={styles.textColumn}>
              <h2 className={styles.singleDiagramTitle}>
                Ваш тип: смешанный <p className={styles.type}><ColoredTypeDisplay type={work.type} /></p>
              </h2>

              <div className={styles.typeSubtitle}>
                {workDesc?.subtitle}
              </div>

              <div className={styles.descriptionBlock}>
                <h3>в работе</h3>
                <p>{workDesc?.work}</p>
              </div>

              <div className={styles.descriptionBlock}>
                <h3>в стрессе</h3>
                <p>{workDesc?.stress}</p>
              </div>
            </div>
          </div>
        ) : (

          <div className={styles.diagramsSection}>
            <div className={styles.workDiagram}>
                <DiscDiagram
                title="В работе"
                values={work.percent}
                showPercentages={true}
                />
                <h2 className={styles.diagramTitleWork}>
                  Ваш WORK-тип: смешанный <p className={styles.worktype}><ColoredTypeDisplay type={work.type} /></p>
                </h2>
                <div className={styles.typeDescriptionWork}>
                  {workDesc?.subtitle}
                </div>
                <p className={styles.typeFullDescription}>
                  {workDesc?.work}
                </p>
            </div>

            <div className={styles.stressDiagram}>
              <DiscDiagram
                title="В стрессе"
                values={stress.percent}
              />
              <h2 className={styles.diagramTitleStress}>
                Ваш STRESS-тип: <p className={styles.stresstype}><ColoredTypeDisplay type={stress.type} /></p>
              </h2>
              <div className={styles.typeDescriptionStress}>
                {stressDesc.subtitle}
              </div>
              <p className={styles.typeFullDescription1}>
                {stressDesc?.stress}
              </p>
            </div>
          </div>
        )}

        <div className={styles.recommendationsSection}>
          <h2 className={styles.recommendationsTitle}>рекомендации</h2>

        {sameType ? (
          <div className={styles.singleRecommendationsGrid}>
            <div className={styles.recommendationColumn}>
              {workRec?.slice(0, 3).map((recommendation, index) => (
                <div key={index} className={styles.recommendationItem}>
                  <li>{recommendation}</li>
                </div>
              ))}
            </div>

            <div className={styles.recommendationColumn}>
              {workRec?.slice(3, 5).map((recommendation, index) => (
                <div key={index} className={styles.recommendationItem}>
                  <li>{recommendation}</li>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.doubleRecommendationsGrid}>
            <div className={styles.recommendationColumn}>
              {workRec?.slice(0, 5).map((recommendation, index) => (
                <div key={index} className={styles.recommendationItem}>
                  <li>{recommendation}</li>
                </div>
              ))}
            </div>

            <div className={styles.recommendationColumn}>
              <div className={styles.stressRecList}>
                {stressRec.slice(0, 5).map((recommendation, index) => (
                  <div key={index} className={styles.recommendationItem}>
                    <li>{recommendation}</li>
                  </div>
                ))}
              </div>
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
              copyButton.textContent = 'Копировать'
              copyButton.style.cssText = `
                background-color: #575799;
                color: white;
                border: none;
                padding: 0 20px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: background-color 0.2s;
              `

              copyButton.onmouseover = () => {
                copyButton.style.backgroundColor = '#6969b6'
              }
              copyButton.onmouseout = () => {
                copyButton.style.backgroundColor = '#575799'
              }

              copyButton.onclick = async () => {
                try {
                  await navigator.clipboard.writeText(currentUrl)
                  const originalText = copyButton.textContent
                  copyButton.textContent = '✓ Скопировано!'
                  copyButton.style.backgroundColor = '#4CAF50'

                  setTimeout(() => {
                    copyButton.textContent = originalText
                    copyButton.style.backgroundColor = '#575799'
                  }, 2000)
                } catch (err) {
                  console.error('Ошибка при копировании:', err)
                  copyButton.textContent = 'Ошибка!'
                  copyButton.style.backgroundColor = '#f44336'

                  setTimeout(() => {
                    copyButton.textContent = 'Копировать'
                    copyButton.style.backgroundColor = '#575799'
                  }, 2000)
                }
              }

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
          <div className={styles.contactAction}>
            <button
              className={styles.contactBtn}
              onClick={() => setShowForm(true)}
            >
              Записаться
            </button>
          </div>
          {showForm && (
            <RequestForm
              onClose={() => setShowForm(false)}
              defaultServiceName={selectedServiceName}
            />
          )}
        </div>
      </main>
    </div>
  )
}
