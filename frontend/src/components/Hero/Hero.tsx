'use client'
import styles from './Hero.module.css'
import dynamic from 'next/dynamic';
import { useState } from 'react';

const RequestForm = dynamic(() => import('@/components/RequestForm/RequestForm'), { ssr: false });
export default function Hero() {

  const [showForm, setShowForm] = useState(false);

  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.container}>
          <p className={styles.role}>Организационный психолог</p>
          <h1 className={styles.name}>Василина ДЕНИСЮК</h1>
          <p className={styles.description}>
            Хотите изменений в своем бизнесе, карьере и состоянии?<br /> Вы пришли по адресу
          </p>
          <button className={styles.button} onClick={() => setShowForm(true)}>Оставить заявку</button>
        </div>
      </div>

      <div className={styles.quoteBox}>
        <p className={styles.quote}>
          «Нам не дано вернуть вчерашний день, но то, что<br />
          будет завтра, зависит от нас»<br />
          <span className={styles.author}>Линдон Джонсон</span>
        </p>
      </div>

      <img src="/styl.svg" alt="paper" className={styles.paperImage} />
      {showForm && <RequestForm onClose={() => setShowForm(false)} />}
    </section>
  )
}
