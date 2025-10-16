'use client';
import React, { useState, useEffect } from 'react';
import styles from './QuestionsPage.module.css';
import dynamic from 'next/dynamic';
import { API_BASE_URL } from '@/config';

const QuestionsForm = dynamic(() => import('@/components/QuestionsForm/QuestionsForm'), { ssr: false });

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export default function QuestionsPage() {
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [questions, setQuestions] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFAQs = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${API_BASE_URL}/faq/`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const faqData = await response.json();

        if (Array.isArray(faqData)) {
          setQuestions(faqData);
        } else {
          setQuestions(faqData.results || faqData.data || [faqData]);
        }

      } catch (err) {
        console.error('Полная ошибка загрузки:', err);
        setError('Не удалось загрузить вопросы');
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);

  const toggle = (index: number) => {
    setActiveIndices(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const formatAnswer = (answerText: string) => {
    if (!answerText) return <p>Нет ответа</p>;

    const paragraphs = answerText.split('\n').filter((p: string) => p.trim());

    return (
      <>
        {paragraphs.map((paragraph: string, index: number) => (
          <p key={index} className={styles.answers}>
            {paragraph}
          </p>
        ))}
      </>
    );
  };

  if (loading) {
    return <div className={styles.pageWrapper}>Загрузка вопросов...</div>;
  }


  const displayQuestions = Array.isArray(questions) ? questions : [];

  return (
    <div className={styles.pageWrapper}>
      <section className={styles.questionsSection}>
        <h1 className={styles.title}>часто задаваемые вопросы</h1>

        <div className={styles.accordion}>
          {displayQuestions.length === 0 ? (
            <div>Нет вопросов для отображения</div>
          ) : (
            displayQuestions.map((item: FAQItem, index: number) => {
              const isOpen = activeIndices.includes(index);
              return (
                <div key={item.id || index} className={styles.item}>
                  <button
                    className={`${styles.question} ${isOpen ? styles.open : ''}`}
                    onClick={() => toggle(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.question || 'Без вопроса'}</span>
                    <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {isOpen && (
                    <div className={styles.answerWrapper}>
                      <div className={styles.answer}>
                        {formatAnswer(item.answer)}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className={styles.askBlock}>
          <h2 className={styles.askTitle}>остались вопросы?</h2>
          <p className={styles.askText}>Вы можете задать свой вопрос прямо сейчас</p>
          <button className={styles.askButton} onClick={() => setShowForm(true)}>
            Задать вопрос
          </button>
        </div>

        {showForm && <QuestionsForm onClose={() => setShowForm(false)} />}
      </section>
    </div>
  );
}
