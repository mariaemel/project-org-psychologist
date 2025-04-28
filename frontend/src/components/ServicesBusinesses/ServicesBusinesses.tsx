import styles from './ServicesBusinesses.module.css';

export default function ServicesBusinesses() {
  return (
    <section className={styles.services}>
      <h2 className={styles.title}>УСЛУГИ ДЛЯ ЮРИДИЧЕСКИХ ЛИЦ</h2>
      <div className={styles.cardsWrapper}>
        <div className={styles.cards}>
        <div className={styles.card}>
            <div className={styles.cardTitle}>
              Услуга первая. услуга, ещё немного для длины и объема
            </div>
            <ul className={styles.cardList}>
              <li>Описание услуги</li>
              <li>для чего</li>
              <li>для кого</li>
              <li>какую помощь окажет</li>
              <li>ещё немного описания</li>
            </ul>
            <div className={styles.priceButton}>ОООО ₽</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              Услуга первая. услуга, ещё немного для длины и объема
            </div>
            <ul className={styles.cardList}>
              <li>Описание услуги</li>
              <li>для чего</li>
              <li>для кого</li>
              <li>какую помощь окажет</li>
              <li>ещё немного описания</li>
            </ul>
            <div className={styles.priceButton}>ОООО ₽</div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              Услуга первая. услуга, ещё немного для длины и объема
            </div>
            <ul className={styles.cardList}>
              <li>Описание услуги</li>
              <li>для чего</li>
              <li>для кого</li>
              <li>какую помощь окажет</li>
              <li>ещё немного описания</li>
            </ul>
            <div className={styles.priceButton}>ОООО ₽</div>
          </div>
        </div>

        <div className={styles.moreLink}>
          Больше услуг →
        </div>
    </div>
    </section>
  );
}
