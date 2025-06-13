// components/Footer.tsx

import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.sections}>
        <h4>Разделы</h4>
        <ul>
          <li><a href="/">Главная</a></li>
          <li><a href="/about">О специалисте</a></li>
          <li><a href="/services">Услуги</a></li>
          <li><a href="/articles">Статьи</a></li>
          <li><a href="/questions">Вопросы</a></li>
        </ul>
      </div>
      <div className={styles.contacts}>
        <h4>Контакты</h4>
        <p>Email: wasilinaden@gmail.com</p>
        <p>Телефон: +7 (999) 123-45-67</p>
        <p>Telegram: @WasilinaDen</p>
      </div>
    </footer>
  );
};

export default Footer;
