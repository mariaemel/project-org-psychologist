'use client';
import { useState } from 'react';
import styles from './RequestForm.module.css';
import { API_BASE_URL } from '@/config';

interface Props {
  onClose: () => void;
  defaultServiceId?: number;
  defaultServiceName?: string;
}

export default function RequestForm({ onClose, defaultServiceId, defaultServiceName }: Props) {
  const [clientType, setClientType] = useState<'individual' | 'organization' | null>(null);
  const [formSent, setFormSent] = useState(false);

  const handleClientTypeSelect = (type: 'individual' | 'organization') => {
    setClientType(type);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload: Record<string, any> = {
      full_name: formData.get('full_name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      request_text: formData.get('request_text'),
      client_type: clientType,
      preferred_communication: formData.get('preferred_communication'),
      consent_processing: formData.get('consent_processing') === 'on',
    };

    const rawDate = formData.get('desired_datetime');
    if (rawDate) {
      payload.desired_datetime = new Date(rawDate.toString()).toISOString();
    }

    if (clientType === 'individual') {
      payload.position_individual = formData.get('position_individual');
    }

    if (clientType === 'organization') {
      payload.position_juridical = formData.get('position_juridical');
      payload.company_name_juridical = formData.get('company_name_juridical');
      payload.inn_juridical = formData.get('inn_juridical');
    }

    if (defaultServiceId && defaultServiceId > 0) {
      payload.selected_service = defaultServiceId;
    }

    Object.keys(payload).forEach((key) => {
      if (
        payload[key] === null ||
        payload[key] === undefined ||
        payload[key] === ''
      ) {
        delete payload[key];
      }
    });


    try {
      const res = await fetch(`${API_BASE_URL}/application/create/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error('Ошибка при отправке');

      setFormSent(true);
      setTimeout(() => {
        setFormSent(false);
        onClose();
      }, 2000);
    } catch (err) {
      alert('Ошибка при отправке формы');
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>×</button>

        {!clientType ? (
          <div className={styles.typeSelection}>
            <p className={styles.titleSelection}>записаться</p>
            <button className={styles.selectTypeBtn} onClick={() => handleClientTypeSelect('individual')}>Я - физическое лицо</button>
            <button className={styles.selectTypeBtn} onClick={() => handleClientTypeSelect('organization')}>Я - юридическое лицо</button>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Запись на: {defaultServiceName || 'услугу'}</h2>

            <label>ФИО:<input type="text" name="full_name" required /></label>
            <label>Телефон:<input type="tel" name="phone" required /></label>
            <label>Email:<input type="email" name="email" required /></label>

            {clientType === 'individual' && (
              <>
                <label>Должность:<input type="text" name="position_individual" /></label>
                <label>Желаемые дата и время консультации:<input type="datetime-local" name="desired_datetime" /></label>
              </>
            )}

            {clientType === 'organization' && (
              <>
                <label>Должность:<input type="text" name="position_juridical" required /></label>
                <label>Название компании:<input type="text" name="company_name_juridical" required /></label>
                <label>ИНН:<input type="text" name="inn_juridical" required /></label>
                <label>Желаемые дата и время консультации:<input type="datetime-local" name="desired_datetime" /></label>
              </>
            )}

            <label>Предпочитаемый способ связи:
              <select name="preferred_communication" required>
                <option value="">-- Выберите --</option>
                <option value="Телефон">Телефон</option>
                <option value="Telegram">Telegram</option>
                <option value="Почта">Почта</option>
                <option value="Вк">Вконтакте</option>
                <option value="WhatsApp">WhatsApp</option>
              </select>
            </label>

            <label>Описание запроса:<textarea name="request_text" required /></label>

            <div className={styles.checkboxContainer}>
              <input type="checkbox" name="consent_processing" id="consent_processing" required />
              <label htmlFor="consent_processing" className={styles.checkboxLabel}>
                Даю согласие на обработку персональных данных
              </label>
            </div>

            <button type="submit" className={styles.submitBtn}>Отправить</button>
          </form>
        )}

        {formSent && <div className={styles.toast}>Спасибо за заявку!</div>}
      </div>
    </div>
  );
}
