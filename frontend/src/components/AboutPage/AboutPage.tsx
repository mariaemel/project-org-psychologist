'use client';
import styles from './AboutPage.module.css';
import Image from 'next/image';
import photo from '/public/photo-placeholder.png';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const RequestForm = dynamic(() => import('@/components/RequestForm/RequestForm'), { ssr: false });

export default function AboutPage() {
  const [formType, setFormType] = useState<null | 'request' | 'question'>(null);
  const closeForm = () => setFormType(null);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
      <section className={styles.aboutSection}>
        <div className={styles.contentWrapper}>
          <div className={styles.imagePlaceholder}></div>
          <div className={styles.textContent}>
            <h2 className={styles.title}>обо мне</h2>
            <p className={styles.text}>
              С самого начала своей карьеры я работаю с бизнесом. В организационную психологию я пришла из IT-сферы,
              где занималась системным анализом и проектированием информационных систем для повышения эффективности компаний.
            </p>
            <p className={styles.text}>
              Со временем я всё яснее понимала: даже самые продуманные решения не работают в полной мере, если не учитывать
              человеческий фактор. Автоматизации недостаточно — именно люди определяют, будет ли бизнес развиваться,
              сокращать издержки и достигать целей.
            </p>
            <p className={styles.text}>
              Поведение и установки руководства могут либо вдохновлять команду, либо вызывать недопонимание и сопротивление.
              Каждый сотрудник способен как поддерживать изменения и обеспечивать эффективность процессов, так и мешать развитию.
            </p>
          </div>
        </div>
        <p className={styles.footerNote}>
          Это осознание привело меня в сферу организационной психологии — к работе с мотивацией, коммуникациями,
          культурой и структурой организаций, где именно человек находится в центре внимания.
        </p>
      </section>

      <section className={styles.educationSection}>
        <h2 className={styles.educationTitle}>образование</h2>

        <div className={styles.blockRow}>
          <p className={styles.textObr}>
            Моё профильное образование по направлению "Организационная психология" я получила в 2021 году,
            успешно завершив программу профессиональной переподготовки в Московском государственном университете имени
            М.В. Ломоносова (МГУ). Обучение дало прочную теоретическую базу и ценные практические инструменты для
            работы с людьми, командами и организациями.
          </p>
          <div className={styles.grayBlock} />
        </div>

        <div className={styles.blockRow}>
          <div className={styles.grayBlockSmall} />
          <p className={styles.textObr1}>
            Мой профессиональный путь начался с технической сферы: в 2013 году я окончила Уральский федеральный
            университет (УрФУ) по направлению «Информационные технологии». Этот опыт научил меня системному мышлению и
            работе с комплексными структурами — то, что я успешно применяю в своей практике и сегодня.
          </p>
        </div>

        <div className={styles.blockRow}>
          <div className={styles.textList}>
            <p>
              В рамках постоянного развития я продолжаю изучать специализированную литературу, посещаю
              профессиональные мероприятия и расширяю свою экспертизу. Среди дополнительного образования:
            </p>
            <ul>
              <li>Диплом школы менеджеров Стратоплан 2017 года — в рамках которой я изучала работу с людьми.</li>
              <li>Ивентополис «Управление основанное на данных» в 2022</li>
              <li>и др.</li>
            </ul>
          </div>
          <div className={styles.blockGrid}>
            <div className={styles.square} />
            <div className={styles.square} />
            <div className={styles.square} />
            <div className={styles.square} />
          </div>
        </div>
      </section>


      <section className={styles.experienceSection}>
        <div className={styles.contentWrapper2}>
          <div className={styles.leftColumn}>
            <div className={styles.yearBox}>2013</div>
            <div className={styles.yearBox}>2021</div>
          </div>
          <div className={styles.rightColumn}>
            <h2 className={styles.experiencetitle}>опыт</h2>
      textOpit      <p className={styles.textOpit}>
              С 2013 года я работаю с бизнесом и для бизнеса, над оптимизацией и автоматизацией процессов, происходящих в компании.
            </p>
            <p className={styles.textOpit}>
              С 2021 года я оказываю консультационные услуги. Моими клиентами являются сотрудники, собственники бизнеса и руководители высшего и среднего звена.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.methodsSection}>
        <h2 className={styles.methodtitle}>методы работы</h2>
        <div className={styles.step}>
          <div className={styles.textmethods}>
            <p>
              Мой метод во многом напоминает работу врача: внимание к деталям, индивидуальный подход и работа не с симптомами, а с первопричинами.
            </p>
            <p>
              На первой встрече мы проводим подробный "сбор анамнеза" — я изучаю запрос клиента, уточняю контекст, цели и возможные барьеры.
              Важно понять, с чем человек пришёл и чего он хочет достичь. Нет универсальных решений — каждая ситуация уникальна.
              Вы ведь удивитесь, если врач начнёт выписывать рецепт, не дослушав вас?
            </p>
          </div>
          <img
            src="/methods-1.png"
            alt="Сбор анамнеза"
            className={styles.image}
          />
        </div>

        <div className={styles.step}>
          <Image
            src="/methods-2.png"
            alt="Диагностика"
            width={220}
            height={220}
            className={styles.image}
          />
          <div className={styles.textmethods1}>
            <p>
              Затем, при необходимости, проводится дополнительная "диагностика": психологическое тестирование, наблюдение,
              самостоятельные задания или сбор наблюдений в реальной рабочей среде. Это позволяет точнее понять ситуацию и предложить не шаблонные,
              а действительно работающие решения. Иногда этот этап не требуется, если уже на первой встрече удаётся собрать достаточно информации.
            </p>
          </div>
        </div>

        <div className={styles.step}>
          <div className={styles.textmethods2}>
            <p>
              Далее мы обсуждаем результаты, формулируем ключевые выводы и разрабатываем индивидуальные рекомендации — своего рода "рецепт" для
              движения к цели, изменения состояния или преодоления затруднений.
            </p>
          </div>
          <Image
            src="/methods-3.png"
            alt="Рецепт"
            width={240}
            height={240}
            className={styles.image3}
          />
        </div>

        <div className={styles.step}>
          <Image
            src="/methods-4.png"
            alt="Поддержка"
            width={300}
            height={300}
            className={styles.image}
          />
          <div className={styles.textmethods3}>
            <p>
              Следующие встречи посвящены поддержке, отслеживанию прогресса и при необходимости — корректировке подхода.
              Мы также можем рассматривать сопутствующие запросы, которые возникают в процессе работы.
            </p>
            <p>
              Консультации проходят в онлайн-формате через удобные для клиента платформы. Некоторые услуги включают сопровождение и между сессиями —
              через мессенджеры.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.paperSection}>
        <div className={styles.paperContent}>
          <img
            src="/paper-bg.jpg"
            alt="paper background"
            className={styles.paperImage}
          />
          <button className={styles.paperButton} onClick={() => setFormType('request')}>Оставить заявку</button>
        </div>

        {formType === 'request' && <RequestForm onClose={closeForm} />}
      </section>
      </div>
    </div>
  );
}
