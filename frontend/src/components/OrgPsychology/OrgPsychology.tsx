'use client'
import styles from './OrgPsychology.module.css'

export default function OrgPsychology() {
  return (
    <section className={styles.orgPsychology} id="psychology">
        <div className={styles.title}>ОРГАНИЗАЦИОННАЯ ПСИХОЛОГИЯ?</div>
          <div className={styles.leftCard}>
            <p>
                Организационная психология работает на уровне личности, группы (коллектива, команды) и организации.
            </p>
            <img src="/vector2.svg" alt="paper" className={styles.paperImage2} />
          </div>
          <div className={styles.imageWrapper}>
            <img src="/girl.png" alt="Иллюстрация" className={styles.imageWrapper1}/>
          </div>
          <div className={styles.greenCard}>
            ◦ Определяет способности людей и способствует их развитию.
          </div>
          <div className={styles.greenCard1}>
            ◦ Помогает проходить через изменения и адаптироваться к новым условиям.
          </div>
          <div className={styles.greenCard2}>
            ◦ Помогает справиться с негативным состоянием и повысить продуктивность.
          </div>
    </section>
  )
}
