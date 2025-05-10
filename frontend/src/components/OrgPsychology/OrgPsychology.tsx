'use client'
import styles from './OrgPsychology.module.css'

export default function OrgPsychology() {
  return (
    <section className={styles.orgPsychology} id="psychology">
        <div className={styles.title}>ОРГАНИЗАЦИОННАЯ ПСИХОЛОГИЯ?</div>
        <div className={styles.container}>
            <div className={styles.leftCard}>
            <p>
                Организационная психология изучает, как люди работают в компаниях: что мотивирует их, какие факторы влияют на продуктивность и как создать здоровую рабочую среду.
            </p>
            </div>
            <div className={styles.rightCards}>
                <p>Помогает находить баланс между интересами сотрудников</p>
                <p>Оптимизация рабочих процессов снижает стресс и усталость</p>
                Создание условий, в которых сотрудники работают с интересом
            </div>
        </div>
    </section>
  )
}
