'use client';

import styles from './TeamBoost.module.css';
import Image from 'next/image';
import photoRoom from '/public/gotov.png';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const RequestForm = dynamic(() => import('@/components/RequestForm/RequestForm'), { ssr: false });
const QuestionsFormPortal = dynamic(() => import('@/components/QuestionsForm/QuestionsFormPortal'), { ssr: false });

export default function TeamWorkSection() {

  const [formType, setFormType] = useState<null | 'request' | 'question'>(null);
  const closeForm = () => setFormType(null);

  return (
    <section className={styles.teamWorkSection}>
      <div className={styles.container}>
        <div className={styles.leftSide}>
          <Image src={photoRoom} alt="Работа в команде" className={styles.teamImage} />
          <div className={styles.buttons}>
            <button className={styles.primaryButton} onClick={() => setFormType('request')}>Оставить заявку</button>
            <button className={styles.secondaryButton} onClick={() => setFormType('question')}>Задать вопрос</button>
          </div>
        </div>
        <div className={styles.rightSide}>
          <h2 className={styles.title}>
            Готовы улучшить работу ?
          </h2>
          <div className={styles.features}>
            <div className={styles.featureCard}>Понять текущее положение дел</div>
            <div className={styles.featureCard}>Разработать вектор движения</div>
            <div className={styles.featureCard}>Побороть старые проблемы и устремиться к новым достижениям</div>
          </div>
        </div>
      </div>

      {formType === 'request' && <RequestForm onClose={closeForm} />}
      {formType === 'question' && <QuestionsFormPortal onClose={closeForm} />}
    </section>
  );
}
