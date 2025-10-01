'use client'
import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.experienceContent}>
          <div className={styles.experienceBlock}>
            <div className={styles.imageBlock}></div>
            <div className={styles.textBlock}>
              <h2 className={styles.aboutTitle}>ОБО МНЕ</h2>
              <p>
                Более 10 лет я помогаю бизнесу становится эффективнее, анализируя и оптимизируя бизнес процессы и осуществляя работу с людьми. У меня индивидуальный подход к каждому конкретному человеку и бизнесу, напрямую связанный с его особенностями и направленный на максимальное раскрытие именно его потенциала и достижения его целей. Нет универсальных решений, есть только Вы и Ваш бизнес прекрасный и уникальный.
              </p>
            </div>
          </div>
      </div>
      <img src="/vector-1.svg" alt="paper" className={styles.paperImage2} />
      <img src="/vector-2.svg" alt="paper" className={styles.paperImage3} />
      <img src="/vector-3.svg" alt="paper" className={styles.paperImage4} />
      <img src="/vector-4.svg" alt="paper" className={styles.paperImage5} />
      <img src="/vector7.svg" alt="paper" className={styles.paperImage6} />
      <img src="/vector8.svg" alt="paper" className={styles.paperImage7} />
      <img src="/vector9.svg" alt="paper" className={styles.paperImage8} />
      <img src="/vector-4.svg" alt="paper" className={styles.paperImage9} />
    </section>
  )
}
