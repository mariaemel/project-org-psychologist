'use client'
import { useEffect, useState } from 'react'
import styles from './Header.module.css'

export default function Header() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setHidden(false)
      } else {
        setHidden(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${styles.header} ${hidden ? styles.hidden : ''}`}>
      <nav className={styles.nav}>
      <a href="#about" className={styles.link}>ОБО МНЕ</a>
        <a href="#services" className={styles.link}>УСЛУГИ</a>
        <a href="#articles" className={styles.link}>СТАТЬИ</a>
        <a href="#faq" className={styles.link}>ВОПРОСЫ</a>
        <a href="#contact" className={styles.link}>ОСТАВИТЬ ЗАЯВКУ</a>
      </nav>
    </header>
  )
}
