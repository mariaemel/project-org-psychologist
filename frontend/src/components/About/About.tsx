'use client'
import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.experienceLabel}>ОБО МНЕ</div>
      <div className={styles.experienceContent}>
          <div className={styles.experienceBlock}>
            <div className={styles.imageBlock}></div>
            <div className={styles.textBlock}>
              Более 10 лет я помогаю бизнесу становится эффективнее, анализируя и оптимизируя бизнес процессы и осуществляя работу с людьми. У меня индивидуальный подход к каждому конкретному человеку и бизнесу, напрямую связанный с его особенностями и направленный на максимальное раскрытие именно его потенциала и достижения его целей. Нет универсальных решений, есть только Вы и Ваш бизнес прекрасный и уникальный.

            </div>
          </div>
      </div>
      <img src="/vector-1.svg" alt="paper" className={styles.paperImage2} />
      <img src="/vector-2.svg" alt="paper" className={styles.paperImage3} />
    </section>
  )
}
