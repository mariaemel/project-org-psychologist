import styles from './TeamBoost.module.css';
import Image from 'next/image';
import photoRoom from '/public/photoroom.png';

export default function TeamWorkSection() {
  return (
    <section className={styles.teamWorkSection}>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <Image src={photoRoom} alt="Работа в команде" className={styles.teamImage} />
          <div className={styles.buttons}>
            <button className={styles.primaryButton}>ОСТАВИТЬ ЗАЯВКУ</button>
            <button className={styles.secondaryButton}>ЗАДАТЬ ВОПРОС</button>
          </div>
        </div>
        <div className={styles.rightSide}>
          <h2 className={styles.title}>
            Готовы улучшить<br />работу вашей<br />команды?
          </h2>
          <div className={styles.features}>
            <div className={styles.featureCard1}>Что-то про индивидуальный подход</div>
            <div className={styles.featureCard2}>Про экспертность</div>
            <div className={styles.featureCard3}>Что-то про скорость подтверждения заявки</div>
          </div>
        </div>
      </div>
    </section>
  );
}
