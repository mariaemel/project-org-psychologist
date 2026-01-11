"use client";
import { useEffect, useState } from 'react';
import styles from './Footer.module.css';
import { API_BASE_URL } from '@/config';

interface ContactData {
  id: number;
  email: string;
  phone: string;
  telegram: string;
}

const Footer = () => {
  const [contacts, setContacts] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/contacts/1/`);
        if (!response.ok) throw new Error('Ошибка загрузки');
        const data = await response.json();
        setContacts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.sections}>
          <h4>Разделы</h4>
          <ul>
            <li><a href="/">Главная</a></li>
            <li><a href="/about">Обо мне</a></li>
            <li><a href="/services">Услуги</a></li>
            <li><a href="/articles">Статьи</a></li>
            <li><a href="/questions">Вопросы</a></li>
            <li><a href="/tests">Тесты</a></li>
          </ul>
        </div>

        <div className={styles.contacts}>
          <h4>Контакты</h4>
          {loading && <p>Загрузка...</p>}
          {error && <p>Ошибка: {error}</p>}
          {contacts && (
            <>
              <p>E-mail: {contacts.email}</p>
              <p>Телефон: {contacts.phone}</p>
              <p>Telegram: {contacts.telegram}</p>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
