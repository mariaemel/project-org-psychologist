'use client'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <h1 className={styles.name}>
            <span className={styles.firstname}>Василина</span><br />
            <span className={styles.lastname}>ДЕНИСЮК</span>
          </h1>
          <p className={styles.subtitle}>Организационный психолог</p>
          <button className={styles.button}>ОСТАВИТЬ ЗАЯВКУ</button>
        </div>
        <div className={styles.imageBlock}>
          <div className={styles.imagePlaceholder} />
        </div>
      </div>
    </section>
  )
}
