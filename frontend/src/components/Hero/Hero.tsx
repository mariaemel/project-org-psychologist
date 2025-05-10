'use client'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.name}>
          <span className={styles.firstname}>Василина ДЕНИСЮК</span><br />
        </h1>
        <p className={styles.role}>Организационный психолог</p>
        <p className={styles.description}>Помогаю бизнесу и людям работать лучше вместе</p>
        <button className={styles.button}>ОСТАВИТЬ ЗАЯВКУ</button>
      </div>
    </section>
  )
}
