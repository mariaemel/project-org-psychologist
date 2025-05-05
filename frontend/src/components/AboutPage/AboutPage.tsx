'use client';
import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.heroSection}>
        <div className={styles.cards}>
            <div className={styles.cardWhite} />
            <div className={styles.cardGray} />
            <div className={styles.cardLightGray} />
        </div>
        <div className={styles.introBox}>
            <h2 className={styles.title}>Обо мне</h2>
            <p className={styles.description}>
            Здравствуйте! Меня зовут [Имя].<br />
            Я помогаю компаниям строить эффективные команды и<br />
            развивать корпоративную культуру
            </p>
        </div>
      </section>

      <section className={styles.educationSection}>
        <div className={styles.educationLabel}>Образование</div>
        <div className={styles.educationContent}>
          <div className={styles.educationText}>
            Какой-то текст про образование. Какой-то текст про образование. Какой-то текст про образование. Какой-то текст про образование. Какой-то текст про образование. Какой-то текст про образование. Какой-то текст про образование. Какой-то текст про образование.
          </div>
          <div className={styles.educationImage} />
        </div>
      </section>

      <section className={styles.experienceSection}>
      <div className={styles.circleBackground}></div>
        <div className={styles.experienceLabel}>Опыт</div>
        <div className={styles.experienceContent}>
            <div className={styles.experienceBlock}>
            <div className={styles.experienceBadge}>
                <div className={styles.years}>5</div>
                <div className={styles.label}>лет опыта</div>
            </div>
            <div className={styles.experienceText}>
                Количество лет в профессии.<br />
                Ключевые направления: работа с конфликтами, обучение лидеров, диагностика команд и пр.<br />
                Можно указать примеры сфер (ИТ, образование, производство и др.), если работала с разными компаниями.
            </div>
            </div>
        </div>
      </section>

      <section className={styles.methodsSection}>
        <div className={styles.methodsLabel}>Методы работы</div>
      </section>

      <section className={styles.paperSection}>
        <img
          src="/paper-bg.png"
          alt="paper background"
          className={styles.paperImage}
        />
        <button className={styles.paperButton}>ОСТАВИТЬ ЗАЯВКУ</button>
      </section>
    </div>
  );
}
