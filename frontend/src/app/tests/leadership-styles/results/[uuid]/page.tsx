'use client'
export const dynamic = 'force-dynamic'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getResult } from '@/lib/api'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js'
import styles from './page.module.css'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

interface ResultFlags {
  flat_questions: number[]
  inconsistent_questions: number[]
  overflow_questions: number[]
  asymmetry: boolean
  too_many_strongs: boolean
  all_close: boolean
  fast_attempt: boolean
  duration_sec: number
}

interface TopStyle {
  code: string
  title: string
  score: number
  level: string
  contextual?: boolean
}

interface ResultRawJson {
  flags?: ResultFlags
  top_styles?: TopStyle[]
  scores?: Record<string, number>
  levels?: Record<string, string>
}

interface ResultData {
  test: { slug: string; title: string }
  computed_at: string
  dimensions: Array<{
    code: string
    title: string
    score: number
    level: string
  }>
  summary_md: string
  viz: {
    type: string
    data: {
      labels: string[]
      values: number[]
    }
  }
  raw_json?: ResultRawJson
  actions: {
    can_copy_link: boolean
    restart_url: string
    result_url?: string
  }
}

type StyleKey = 'ИНФОРМИРОВАНИЕ' | 'ОБУЧЕНИЕ' | 'ПОДДЕРЖКА' | 'ДЕЛЕГИРОВАНИЕ'

const STYLE_CONFIG: Record<StyleKey, {
  color: string
  title: string
  summary: string
  sections: Array<{
    title: string
    items: string[]
    description?: string | string[]
    conclusion?: string
  }>
}> = {
  'ИНФОРМИРОВАНИЕ': {
    color: '#D94A3C',
    title: 'ИНФОРМИРОВАНИЕ',
    summary: `
      <p>Ваш результат: <strong>Директивный стиль руководства</strong> <br/><em>У вас <span>директивный</span> (инструктирующий) стиль руководства.</em></p></br>
      <p>Вы склонны самостоятельно определять цели и пути их достижения, чётко формулируете задачи и требуете их исполнения в соответствии с установленными стандартами.</p></br>
      <p>Для вас важно, чтобы сотрудники точно понимали, что, как и когда нужно сделать. Вы предпочитаете держать процесс под контролем, обеспечивая выполнение работы по шагам и минимизируя неопределённость.</p></br>
    `,
    sections: [
      {
        title: 'Характеристика руководителя с директивным стилем',
        items: [
          'Ставит цели самостоятельно, максимально подробно, формулирует их по принципу SMART.',
          'Принимает решения по всем вопросам без обсуждения с подчиненными.',
          'Дает детальные инструкции — кто, что, когда и как должен сделать.',
          'Сам разрабатывает план работы или руководит планированием.',
          'Осуществляет пошаговый контроль и обеспечивает постоянную обратную связь по процессу.',
          'Степень поддержки сотрудников невысока, акцент делается на задаче и результате.',
          'Поощряет прогресс и выполнение, но не вовлекает подчиненных в процесс принятия решений.'
        ]
      },
      {
        title: 'Когда этот стиль наиболее эффективен',
        description: ['Директивный стиль наилучшим образом подходит для работы с сотрудниками уровня зрелости R1 — "Начинающий энтузиаст", то есть: новыми или неопытными работниками, не обладающими необходимыми навыками для выполнения задач, но проявляющими высокий уровень мотивации и энтузиазма.',
                      'Таким сотрудникам нужны:'],
        items: [
          'четкие указания, стандарты и приоритеты,',
          'ясное понимание ролей и сроков,',
          'постоянное информирование и обратная связь о ходе выполнения.',
        ],
        conclusion: 'Руководитель в этой ситуации должен быть для них наставником, помогая освоить основы и не допустить ошибок.'
      },
      {
        title: 'Возможные риски при чрезмерной директивности',
        items: [
          'Сотрудники могут стать чрезмерно зависимыми от руководителя, не проявлять инициативу.',
          'Со временем чрезмерный контроль может снижать внутреннюю мотивацию и креативность.',
          'Если команда уже более опытна, такой подход может восприниматься как недоверие.'
        ]
      },
      {
        title: 'Рекомендации по развитию',
        items: [
          'Постепенно повышайте степень самостоятельности сотрудников, делегируйте не только задачи, но и часть решений.',
          'Сохраняйте четкость и структурность, но оставляйте пространство для инициативы.',
          'Развивайте навыки доверия, мотивации и поддержки — они помогут эффективнее управлять более зрелыми командами.'
        ]
      }
    ]
  },
  'ОБУЧЕНИЕ': {
    color: '#FFCF4A',
    title: 'ОБУЧЕНИЕ',
    summary: `
      <p>Ваш результат: <strong>Обучающий стиль руководства</strong><br/> <em>У вас <span>обучающий</span> (коучинговый) стиль руководства.</em></p></br>
      <p>Вы склонны сочетать высокую директивность с активной поддержкой. С одной стороны, вы ясно формулируете задачи и сохраняете ответственность за принятие решений. С другой — вовлекаете сотрудников в обсуждение, объясняете логику действий и помогаете им понять «почему» и «зачем» выполняется то или иное задание.</p></br>
      <p>Ваш подход направлен не просто на выполнение задачи, а на развитие подчиненных, формирование у них уверенности и компетенций.</p></br>
    `,
    sections: [
      {
        title: 'Характеристика руководителя с обучающим стилем',
        items: [
          'Сам ставит цели и принимает решения, но после обсуждения с сотрудниками.',
          'Активно объясняет причины действий, делится знаниями и опытом.',
          'Поддерживает диалог, задаёт развивающее вопросы ("А как бы ты поступил?", "Почему ты так считаешь?").',
          'Руководит процессом планирования, но учитывает предложения команды.',
          'Предоставляет обратную связь регулярно, направленную на процесс, а не только на результат.',
          'Высоко поддерживает сотрудников — поощряет идеи, вдохновляет, хвалит за успехи, помогает справиться с трудностями.',
          'При этом сохраняет четкость, последовательность и структурность в управлении.'
        ]
      },
      {
        title: 'Когда этот стиль наиболее эффективен',
        description: 'Обучающий стиль наиболее результативен при работе с сотрудниками уровня зрелости R2 — "Разочарованный ученик":',
        items: [
          'у них еще недостаточно знаний и навыков, но уже есть определённый опыт;',
          'мотивация часто снижается из-за первых ошибок и разочарования в сложности задач;',
          'они нуждаются в контроле, поддержке, поощрении и обратной связи;',
          'им важно понимать, почему что-то нужно делать именно так.',
        ],
        conclusion: 'В такой ситуации руководство должен проявлять терпение, помогать сотруднику восстанавливать уверенность, учить и направлять, не снижая при этом требований.'
      },
      {
        title: 'Возможные риски при чрезмерной обучающей позиции',
        items: [
          'Сотрудники могут начать чрезмерно зависеть от постоянных объяснений и поддержки.',
          'Перегрузка коммуникацией может замедлять процесс принятия решений.',
          'Если не переходить вовремя к более делегирующему поводу, сотрудник может застрять на уровня ученичества.'
        ]
      },
      {
        title: 'Рекомендации по развитию',
        items: [
          'Поздравляйте активно развивать способности сотрудникам через обсуждения, обратную связь и объяснение логики решений.',
          'Старайтесь поэтапно повышать уровень самостоятельности подчиненных, постепенно уменьшая директивность.',
          'Поддерживайте атмосферу доверия и открытого диалога, поощряйте инициативу.',
          'Развивайте в себе навыки коучинга и наставничества: задавайте вопросы, помогающие сотрудникам самим находить решения.'
        ]
      }
    ]
  },
  'ПОДДЕРЖКА': {
    color: '#29A80D',
    title: 'ПОДДЕРЖКА',
    summary: `
      <p>Ваш результат: <strong>Поддерживающий стиль руководства</strong><br/>
      <em>У вас <span>поддерживающий</span> (совместный) стиль руководства.</em></p><br/>
      <p>Вы стремитесь к партнёрским отношениям с сотрудниками, активно вовлекаете их в процесс принятия решений, предоставляете свободу действий и одновременно поддерживаете морально</p><br/>
      <p>Ваша цель — укрепить уверенность подчиненных, мотивировать их к самостоятельности и развить чувство ответственности за результат.</p></br>
    `,
    sections: [
      {
        title: 'Характеристика руководителя с поддерживающим стилем',
        items: [
          'Совместно с сотрудником формирует цели и определяет задачи.',
          'Делегирует часть планирования и принятия решений, поощряя инициативу.',
          'Предоставляет всю необходимую информацию, помогает разобраться в организационных вопросах.',
          'Вовлекает сотрудников в процесс обсуждения, спрашивает их мнение и учитывает предложения.',
          'Поддерживает уверенность подчиненных, ободряет, помогает преодолевать сомнения.',
          'Осуществляет контроль по этапам (вехам), а не пошагово, фокусируясь на результате, а не на процессе.',
          'Обратная связь конструктивна, направлена на поддержание мотивации и повышение уверенности в своих силах.'
        ]
      },
      {
        title: 'Когда этот стиль наиболее эффективен',
        description: 'Поддерживающий стиль управления оптимален для работы с сотрудниками уровня зрелости R3 — "Осторожный исполнитель", которые:',
        items: [
          'обладают знаниями и навыками для выполнения задач (средний или высокий уровень компетенции),',
          'могут работать самостоятельно, но не всегда уверены в себе,',
          'иногда проявляют колебания в принятии решений и нуждаются в одобрении,',
          'хотят быть услышанными, ценят поддержку и признание.',
        ],
        conclusion: 'Руководитель здесь играет роль наставника-партнера — помогает сотруднику поверить в свои силы, укрепить внутреннюю мотивацию и развить автономность.'
      },
      {
        title: 'Возможные риски при чрезмерной поддерживающей позиции',
        items: [
          'Сотрудники могут привыкнуть полагаться на эмоциональную поддержку и избегать полной ответственности.',
          'При избыточной вовлеченности руководителя принятие решений может замедляться.',
          'Если не вовремя перейти к делегирующему стилю, развитие самостоятельности сотрудников может застопориться.'
        ]
      },
      {
        title: 'Рекомендации по развитию',
        items: [
          'Продолжайте использовать диалоговый формат, поддерживая сотрудников и признавая их достижения.',
          'Постепенно передавайте им больше полномочий — от совместного планирования к самостоятельному.',
          'Сохраняйте открытость, но уменьшайте зависимость команды от вашего постоянного участия.',
          'Уделяйте внимание результату, а не только процессу: помогайте сотрудникам видеть влияние их решений.',
          'Развивайте доверие и уверенность — это естественный мост к следующему уровню лидерства — делегирующему стилю.'
        ]
      }
    ]
  },
  'ДЕЛЕГИРОВАНИЕ': {
    color: '#1E86EA',
    title: 'ДЕЛЕГИРОВАНИЕ',
    summary: `
      <p>Ваш результат: <strong>Делегирующий стиль руководства</strong></p>
      <p><em>У вас <span>делегирующий</span> (доверительный) стиль руководства.</em></p><br/>
      <p>Вы доверяете сотрудникам, предоставляете им свободу действий и возможность самостоятельно принимать решения. Ваш подход основан на уверенности в профессионализме подчиненных: вы обозначаете цели и сроки, а ответственность за способы достижения результата передаете им.</p><br/>
      <p>Этот стиль демонстрирует зрелость руководителя, готовность отпустить избыточный контроль и выстраивать отношения на основе доверия и партнёрства.</p></br>
    `,
    sections: [
      {
        title: 'Характеристика руководителя с делегирующим стилем',
        items: [
          'Обозначает задачу и ожидаемые результаты, согласует сроки выполнения.',
          'Требует от сотрудника разработки решения и плана действий, при необходимости оказывает поддержку.',
          'Предоставляет информацию по запросу, не вмешивается без необходимости.',
          'Делегирует ответственность за выполнение задач и принятие решений.',
          'Контроль минимален, основан на итогах, а не на процессе.',
          'Обратная связь дается в основном по результату, с элементами совместного анализа и самооценки сотрудника.',
          'Поощряет самостоятельность, инициативу и готовность брать на себя сложные задачи.'
        ]
      },
      {
        title: 'Когда этот стиль наиболее эффективен',
        description: 'Делегирующий стиль подходит для сотрудников уровня зрелости R4 — "Уверенный профессионал", которые:',
        items: [
          'имеют высокий уровень компетентности и устойчивую эффективность,',
          'мотивированы внутренне, гордятся своими результатами,',
          'предпочитают работать автономно и самостоятельно принимать решения,',
          'могут быть наставниками для других,',
          'нуждаются не в контроле, а в признании и доверии.'
        ],
        conclusion: 'Для таких сотрудников руководитель становится партнёром и стратегом, создающим условия для профессионального роста и самореализации.'
      },
      {
        title: 'Возможные риски при чрезмерной делегации',
        items: [
          'Слишком раннее делегирование может привести к ошибкам и срыву сроков.',
          'Недостаточный контроль может привести к потере управления ситуацией.',
          'Сотрудники могут чувствовать себя брошенными без достаточной поддержки.'
        ]
      },
      {
        title: 'Рекомендации по развитию',
        items: [
          'Поддерживайте баланс между доверием и вовлеченностью: контролируйте стратегические результаты, не вмешиваясь в детали.',
          'Регулярно обсуждайте итоги работы, помогайте видеть вклад сотрудника в общие цели.',
          'Используйте обратную связь как инструмент признания и развития, а не контроля.',
          'Предоставляйте сложные и разнообразные задачи, чтобы поддерживать интерес и мотивацию.',
          'Помните: делегирующий стиль наиболее эффективен, когда руководитель остается доступным и готов помочь, если это действительно нужно.'
        ]
      }
    ]
  }
}

const getExpressionLevel = (score: number): string => {
  if (score <= 20) return "Стиль не выражен";
  if (score <= 30) return "Слабо выражен";
  if (score <= 70) return "Выражен";
  return "Ярко выражен";
};

// для получения текста с правильной степенью выраженности
const getSummaryWithExpression = (styleCode: string, score: number, originalSummary: string): string => {
  const expressionLevel = getExpressionLevel(score);
  let expressionText = "";

  switch (expressionLevel) {
    case "Ярко выражен":
      expressionText = "ярко выражен";
      break;
    case "Выражен":
      expressionText = "выражен";
      break;
    case "Слабо выражен":
      expressionText = "слабо выражен";
      break;
    default:
      expressionText = "выражен";
  }

  const styleName = getStyleName(styleCode);
  return originalSummary
    .replace(/У вас <span>/g, `У вас ${expressionText} <span>`)
    .replace(new RegExp(`У вас ${styleName}`, 'g'), `У вас ${expressionText} ${styleName}`);
};

const getStyleName = (code: string): string => {
  const styleMap: Record<string, string> = {
    'ИНФОРМИРОВАНИЕ': 'директивный',
    'ОБУЧЕНИЕ': 'обучающий',
    'ПОДДЕРЖКА': 'поддерживающий',
    'ДЕЛЕГИРОВАНИЕ': 'делегирующий'
  };
  return styleMap[code.toUpperCase()] || 'стиль';
};

const getStyleConfig = (code: string) => {
  const upperCode = code.toUpperCase() as StyleKey;
  return STYLE_CONFIG[upperCode];
};

export default function ResultPage() {
  const params = useParams();
  const [result, setResult] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getResult(params.uuid as string);
        setResult(data);
      } catch (err: any) {
        setError(`Не удалось загрузить результаты: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    if (params.uuid) fetchResult();
  }, [params.uuid]);

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) return <div className={styles.loading}>Загрузка...</div>;
  if (error || !result)
    return (
      <div className={styles.error}>
        <h3>Ошибка</h3>
        <p>{error || 'Результаты не найдены'}</p>
      </div>
    );

  // проверка на крайние случаи по флагам из бека
  const flags = result.raw_json?.flags;
  const topStyles = result.raw_json?.top_styles || [];

  console.log('Крайние случаи', flags);
  console.log('Главные стили', topStyles);
  console.log('Все стили', result.dimensions);

  const hasVeryStrongStyle = result.dimensions.some(d => d.score > 70);
  const sortedDimensions = [...result.dimensions].sort((a, b) => b.score - a.score);

  const hasCriticalIssues = flags ? (
    flags.flat_questions?.length > 0 ||
    flags.inconsistent_questions?.length > 0 ||
    flags.overflow_questions?.length > 0 ||
    flags.asymmetry ||
    flags.all_close ||
    flags.fast_attempt ||
    (flags.too_many_strongs && !hasVeryStrongStyle &&
    sortedDimensions[2]?.score > (sortedDimensions[1].score / 2) &&
    sortedDimensions[2]?.level !== "Слабо выражен")
  ) : false;

  // если есть проблемы И нет ярко выраженного стиля, то ошибка
  if (hasCriticalIssues && !hasVeryStrongStyle) {
    return (
      <div className={styles.retry}>
        <div className={styles.retryContainer}>
          <div className={styles.retryImage}>
            <div className={styles.sadImagePlaceholder}>Картинка грустная</div>
          </div>
          <div className={styles.retryContent}>
            <h1>Попробуйте еще раз</h1>
            <p>Результаты теста не позволяют однозначно определить ваш ведущий стиль руководства.</p>
            <p>Возможно, ваши ответы были слишком равномерными или противоречивыми, поэтому профиль получился неустойчивым.</p>
            <p>Попробуйте пройти тест ещё раз, выбирая оценки, которые лучше отражают ваши реальные предпочтения в разных ситуациях.</p>
            <Link href={result.actions.restart_url} className={styles.restartBtn}>
              Пройти заново
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let mainStyleCode = topStyles[0]?.code;
  let mainStyle = mainStyleCode ? getStyleConfig(mainStyleCode) : null;

  if (!mainStyle && result.dimensions && result.dimensions.length > 0) {
    const leadingDimension = result.dimensions.reduce((prev, current) =>
      (prev.score > current.score) ? prev : current
    );
    mainStyleCode = leadingDimension.code;
    mainStyle = getStyleConfig(mainStyleCode);
  }

  if (!mainStyle) {
    return (
      <div className={styles.error}>
        <h3>Ошибка</h3>
        <p>Не удалось определить стиль руководства. Данные могут быть некорректными.</p>
      </div>
    );
  }

  const totalScore = result.dimensions.reduce((sum, dim) => sum + dim.score, 0);
  const labelsWithPercentages = result.viz.data.labels.map((label, index) => {
    const percentage = totalScore > 0 ? Math.round((result.viz.data.values[index] / totalScore) * 100) : 0;
    return `${label} (${percentage}%)`;
  });

  const chartData = {
    labels: labelsWithPercentages,
    datasets: [
      {
        data: result.viz.data.values,
        backgroundColor: [
          STYLE_CONFIG.ИНФОРМИРОВАНИЕ.color,
          STYLE_CONFIG.ОБУЧЕНИЕ.color,
          STYLE_CONFIG.ПОДДЕРЖКА.color,
          STYLE_CONFIG.ДЕЛЕГИРОВАНИЕ.color
        ],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          boxWidth: 14,
          boxHeight: 14,
          padding: 10,
          margin: 12,
          usePointStyle: false,
          font: {
            size: 13,
            family: "'Nunito Sans', sans-serif"
          },

          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => {
                const value = data.datasets[0].data[i];
                const percentage = totalScore > 0 ? Math.round((value / totalScore) * 100) : 0;

                return {
                  text: `${label}`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor,
                  lineWidth: data.datasets[0].borderWidth,
                  pointStyle: 'rect',
                  hidden: false,
                  index: i
                };
              });
            }
            return [];
          }
        }
      },
      title: { display: false },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = totalScore > 0 ? Math.round((value / totalScore) * 100) : 0;
            return `${label.replace(/ \(\d+%\)$/, '')}: ${value} баллов (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true,
    layout: {
      padding: {
        top: 40
      }
    }
  };

  const expressedStyles = result.dimensions.filter(dim =>
    dim.level === "Выражен" || dim.level === "Ярко выражен"
  ).sort((a, b) => b.score - a.score);

  const mainStyles = expressedStyles.length >= 2 && expressedStyles[1].score > 40
    ? expressedStyles.slice(0, 2)
    : expressedStyles.slice(0, 1);

  return (
    <div className={styles.container}>
      {/* круговая диаграмма */}
      <div className={styles.topSection}>
        <div className={styles.chartContainer}>
          <div className={styles.chart}>
            <Pie data={chartData} options={chartOptions} height={400} width={400} />
          </div>
        </div>

        <div className={styles.summary}>
          {/* для одного стиля */}
          {mainStyles.length === 1 && (
            <>
              <h1 className={styles.title} style={{ color: getStyleConfig(mainStyles[0].code)?.color }}>
                {getStyleConfig(mainStyles[0].code)?.title || mainStyles[0].title}
              </h1>
              <div
                className={styles.summaryContent}
                dangerouslySetInnerHTML={{
                  __html: getSummaryWithExpression(
                    mainStyles[0].code,
                    mainStyles[0].score,
                    getStyleConfig(mainStyles[0].code)?.summary || ''
                  )
                    .replace(/<span>/g, `<span style="color: ${getStyleConfig(mainStyles[0].code)?.color}; font-weight: 600;">`)
                    .replace(/<em>/g, `<em style="border-left: 3px solid ${getStyleConfig(mainStyles[0].code)?.color}; padding-left: 12px; margin-left: 2px; font-style: italic; display: inline-block;">`)
                }}
              />
            </>
          )}

          {/* для двух стилей заголовок */}
          {mainStyles.length === 2 && (
            <h1 className={styles.title} style={{ color: '#333' }}>
              Ваши ведущие стили руководства
            </h1>
          )}
        </div>
      </div>

      {/* для двух стилей блоки в ряд под диаграммой */}
      {mainStyles.length === 2 && (
        <div className={styles.stylesRow}>
          {mainStyles.map((style, index) => {
            const styleConfig = getStyleConfig(style.code);
            if (!styleConfig) return null;

            return (
              <div key={index} className={styles.styleCard} style={{ borderLeftColor: styleConfig.color }}>
                <h2 style={{ color: styleConfig.color }}>
                  {styleConfig.title}
                </h2>
                <div
                  className={styles.styleContent}
                  dangerouslySetInnerHTML={{
                    __html: getSummaryWithExpression(
                      style.code,
                      style.score,
                      styleConfig.summary || ''
                    )
                      .replace(/<span>/g, `<span style="color: ${styleConfig.color}; font-weight: 600;">`)
                      .replace(/<em>/g, `<em style="border-left: 3px solid ${styleConfig.color}; padding-left: 12px; margin-left: 2px; font-style: italic; display: inline-block;">`)
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* секции для всех главных стилей */}
      <div className={styles.sections}>
        {mainStyles.map((mainStyle, styleIndex) => {
          const styleConfig = getStyleConfig(mainStyle.code);
          if (!styleConfig) return null;

          return (
            <div key={styleIndex} className={styles.styleSection}>
              {mainStyles.length === 2 && (
                <div className={styles.styleHeader}>
                  <h2 className={styles.styleTitle} style={{ color: styleConfig.color }}>
                    {styleConfig.title}
                  </h2>
                </div>
              )}

              {/* раскрывающиеся секции */}
              {styleConfig.sections.map((section: any, idx: number) => {
                const sectionKey = `${styleIndex}-${idx}`;

                return (
                  <div key={idx} className={styles.section}>
                    <div
                      className={styles.sectionHeader}
                      onClick={() => toggleSection(sectionKey)}
                      style={{
                        borderLeftColor: styleConfig.color,
                        borderTopColor: styleConfig.color
                      }}
                    >
                      <h3 className={styles.sectionTitle} style={{ color: styleConfig.color }}>
                        {section.title}
                      </h3>
                      <span className={styles.arrow} style={{ color: styleConfig.color }}>
                        {openSections[sectionKey] ? '▲' : '▼'}
                      </span>
                    </div>

                    {openSections[sectionKey] && (
                      <div
                        className={styles.sectionContent}
                        style={{
                          borderLeftColor: styleConfig.color,
                          borderBottomColor: styleConfig.color
                        }}
                      >
                        {section.description && (
                          <div className={styles.description}>
                            {Array.isArray(section.description)
                              ? section.description.map((desc: string, i: number) => (
                                  <p key={i}>{desc}</p>
                                ))
                              : <p>{section.description}</p>
                            }
                          </div>
                        )}

                        {section.items && section.items.length > 0 && (
                          <ul className={styles.sectionList}>
                            {section.items.map((item: string, itemIdx: number) => (
                              <li key={itemIdx} className={styles.listItem}>
                                {item}
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.conclusion && (
                          <p className={styles.conclusion}>
                            {section.conclusion}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* кнопки */}
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
          window.location.href = result.actions.restart_url;
        }}>
          Пройти заново
        </button>
      </div>
    </div>
  );
}
