'use client'
import styles from './OrgPsychology.module.css'

export default function OrgPsychology() {
  return (
    <section className={styles.orgPsychology} id="psychology">
        <h2 className={styles.title}>ОРГАНИЗАЦИОННАЯ<br/>ПСИХОЛОГИЯ?</h2>
        <div className={styles.container}>
            <div className={styles.leftCard}>
            <p>
                Организационная психология изучает, как люди работают в компаниях: что мотивирует их, какие факторы влияют на продуктивность и как создать здоровую рабочую среду.
            </p>
            </div>
            <div className={styles.rightCards}>
            <div className={styles.rightTopCard}>
                Помогает находить баланс между интересами сотрудников
            </div>
            <div className={styles.rightMiddleCard}>
                Оптимизация рабочих процессов снижает стресс и усталость
            </div>
            <div className={styles.rightBottomRow}>
                <div className={styles.rightBottomTextCard}>
                Создание условий, в которых сотрудники работают с интересом
                </div>
                <div className={styles.rightBottomEmptyCard}></div>
            </div>
            </div>
        </div>
    </section>
  )
}
