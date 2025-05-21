'use client';
import { useState } from 'react';
import styles from './RequestForm.module.css';

export default function RequestForm({ onClose }: { onClose: () => void }) {
  const [formSent, setFormSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      full_name: formData.get('full_name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      request_text: formData.get('request_text'),
      client_type: formData.get('client_type'),
      preferred_communication: formData.get('preferred_communication'),
    };

    try {
      const res = await fetch('http://localhost:8000/api/requests/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Ошибка при отправке формы');

      setFormSent(true);
      setTimeout(() => {
        setFormSent(false);
        onClose();
      }, 2000);
    } catch (err) {
      alert('Ошибка при отправке формы. Попробуйте позже.');
      console.error(err);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2>Оставить заявку</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label>ФИО:<input type="text" name="full_name" required /></label>
          <label>Телефон:<input type="tel" name="phone" required /></label>
          <label>Email:<input type="email" name="email" required /></label>
          <label>Тип клиента:
            <select name="client_type" required>
              <option value="">-- выберите --</option>
              <option value="individual">Физическое лицо</option>
              <option value="organization">Юридическое лицо</option>
            </select>
          </label>
          <label>Предпочтительный способ связи:
            <select name="preferred_communication" required>
              <option value="">-- выберите --</option>
              <option value="email">Email</option>
              <option value="phone">Телефон</option>
            </select>
          </label>
          <label>Комментарий:<textarea name="request_text" rows={4} required /></label>
          <button type="submit">Отправить</button>
        </form>
        {formSent && <div className={styles.toast}>Спасибо за заявку!</div>}
      </div>
    </div>
  );
}
