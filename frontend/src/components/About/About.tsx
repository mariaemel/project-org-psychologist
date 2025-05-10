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
              Приветственная речь. Представление себя, информация про деятельность. Еще чуть-чуть информации и переход к фактам о себе
              Приветственная речь. Представление себя, информация про деятельность. Еще чуть-чуть информации и переход к фактам о себе
            </div>
          </div>
      </div>
    </section>
  )
}
