'use client';
import React, { useState, useEffect } from 'react';
import styles from './QuestionsForm.module.css';
import { sendQuestion } from '../../../services/api';

const initialData = {
  full_name: '',
  phone: '',
  email: '',
  question_text: '',
  client_type: '',
  question_topic: '',
  position_juridical: '',
  company_name_juridical: '',
  inn_juridical: '',
  preferred_communication: '',
  additional_files: '',
  consent_processing: false,
};

const QuestionsForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState(initialData);
  const [file, setFile] = useState<File | null>(null);
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', escHandler);
    return () => document.removeEventListener('keydown', escHandler);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const selectClientType = (type: 'individual' | 'organization') => {
    setFormData(prev => ({
      ...prev,
      client_type: type,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();

    for (const key in formData) {
      const value = formData[key as keyof typeof formData];
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'boolean') {
          data.append(key, value ? 'true' : 'false');
        } else {
          data.append(key, value as string);
        }
      }
    }

    if (file) {
      data.append('additional_files', file);
    }

    try {
      await sendQuestion(data);
      setFormSent(true);

      setTimeout(() => {
        setFormSent(false);
        onClose();
      }, 2000)} catch (err) {
      console.error(err);
      alert('Ошибка при отправке формы');
    }
  };

  if (!formData.client_type) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={e => e.stopPropagation()}>
          <div className={styles.selection}>
            <h2 className={styles.title}>Кто вы?</h2>
            <button
              className={styles.clientTypeButton}
              onClick={() => selectClientType('individual')}
            >
              Физическое лицо
            </button>
            <button
              className={styles.clientTypeButton}
              onClick={() => selectClientType('organization')}
            >
              Юридическое лицо
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h2 className={styles.title}>Задать вопрос</h2>
            <form onSubmit={handleSubmit} className={styles.form} >
              <label>ФИО:</label>
              <input name="full_name" required value={formData.full_name} onChange={handleChange} className={styles.input} />

              <label>Телефон:</label>
              <input name="phone" required value={formData.phone} onChange={handleChange} className={styles.input} />

              <label>Email:</label>
              <input name="email" type="email" required value={formData.email} onChange={handleChange} className={styles.input} />

              <label>Тема вопроса:</label>
              <input name="question_topic" required value={formData.question_topic} onChange={handleChange} className={styles.input} />

              {formData.client_type === 'organization' && (
                <>
                  <label>Должность:</label>
                  <input name="position_juridical" value={formData.position_juridical} onChange={handleChange} className={styles.input} />

                  <label>Название компании:</label>
                  <input name="company_name_juridical" value={formData.company_name_juridical} onChange={handleChange} className={styles.input} />

                  <label>ИНН:</label>
                  <input name="inn_juridical" value={formData.inn_juridical} onChange={handleChange} className={styles.input} />
                </>
              )}

              <label>Предпочитаемый способ связи:</label>
              <select name="preferred_communication" value={formData.preferred_communication} onChange={handleChange} required className={styles.input}>
                <option value="">-- выберите --</option>
                <option value="Телефон">Телефон</option>
                <option value="Telegram">Telegram</option>
                <option value="Почта">Почта</option>
                <option value="Вк">Вконтакте</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>

              <label>Описание ситуации:</label>
              <textarea name="question_text" required value={formData.question_text} onChange={handleChange} className={styles.textarea} />

              <label>Дополнительно:</label>
              <input type="file" name="additional_files" onChange={handleFileChange} className={styles.input} />

              <label className={styles.checkboxLabel}>
                <input type="checkbox" name="consent_processing" checked={formData.consent_processing} onChange={handleChange} required />
                Даю согласие на обработку персональных данных
              </label>

              <button type="submit" className={styles.submitBtn}>Отправить</button>
            </form>
            {formSent && <div className={styles.toast}>Спасибо за заявку!</div>}
      </div>
    </div>
  );
};

export default QuestionsForm;
