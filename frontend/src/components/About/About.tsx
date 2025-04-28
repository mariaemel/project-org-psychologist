'use client'
import styles from './About.module.css'

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.container}>
        <div className={styles.imageBlock}>
          <div className={styles.imagePlaceholder}></div>
        </div>
        <div className={styles.textBlock}>
          <h2 className={styles.title}>ОБО МНЕ</h2>
          <p className={styles.description}>
          Приветственная речь. Представление себя, информация про деятельность. Еще чуть-чуть информации и переход к фактам о себе
          </p>
        </div>
      </div>
    </section>
  )
}
