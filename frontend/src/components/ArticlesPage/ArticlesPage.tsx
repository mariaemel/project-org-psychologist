'use client';
import { useState } from 'react';
import styles from './ArticlesPage.module.css';

export default function ArticlesPage() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className={styles.wrapper}>
      <section className={styles.shelfSection}>
        <div className={styles.shelfHeader}>
          <h1 className={styles.shelfTitle}>книжная полка</h1>
          <p className={styles.shelfDescription}>
            В данном разделе я рассказываю своё мнение о прочитанных книгах и делюсь своими
            мыслями на их счёт.
          </p>
        </div>

        {/* Управление финансами */}
        <h2 className={styles.category}>Управление финансами</h2>

        {/* Книга 1 */}
        <div className={styles.bookCard}>
          <div className={styles.bookImage}></div>
          <div className={styles.bookContent}>
            <h3 className={styles.bookTitle}>
              «Название книги» <p className={styles.bookAuthor}>Автор книги</p>
            </h3>
            <p className={styles.reviewText}>Заголовок рецензии, заголовок рецензии.</p>
            <p className={styles.opisanie}>
              {expandedItems['finance1'] ? (
                <>
                  Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы. Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы.
                </>
              ) : (
                <>
                  Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы...{' '}
                  <span className={styles.readMoreInline} onClick={() => toggleExpand('finance1')}>читать дальше</span>
                </>
              )}
            </p>
            {expandedItems['finance1'] && (
              <button className={styles.readMore} onClick={() => toggleExpand('finance1')}>
                Свернуть
              </button>
            )}
          </div>
        </div>

        {/* Книга 2 */}
        <div className={styles.bookCard}>
          <div className={styles.bookImage}></div>
          <div className={styles.bookContent}>
            <h3 className={styles.bookTitle}>
              «Название книги» <p className={styles.bookAuthor}>Автор книги</p>
            </h3>
            <p className={styles.reviewText}>Заголовок рецензии, заголовок рецензии.</p>
            <p className={styles.opisanie}>
              {expandedItems['finance2'] ? (
                <>
                  Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы. Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы.
                </>
              ) : (
                <>
                  Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы...{' '}
                  <span className={styles.readMoreInline} onClick={() => toggleExpand('finance2')}>читать дальше</span>
                </>
              )}
            </p>
            {expandedItems['finance2'] && (
              <button className={styles.readMore} onClick={() => toggleExpand('finance2')}>
                Свернуть
              </button>
            )}
          </div>
        </div>

        {/* Тайм менеджмент */}
        <h2 className={styles.category}>Тайм менеджмент</h2>

        {/* Книга 3 */}
        <div className={styles.bookCard}>
          <div className={styles.bookImage}></div>
          <div className={styles.bookContent}>
            <h3 className={styles.bookTitle}>
              «Название книги» <p className={styles.bookAuthor}>Автор книги</p>
            </h3>
            <p className={styles.reviewText}>Заголовок рецензии, заголовок рецензии.</p>
            <p className={styles.opisanie}>
              {expandedItems['time1'] ? (
                <>
                  Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы. Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы.
                </>
              ) : (
                <>
                  Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы...{' '}
                  <span className={styles.readMoreInline} onClick={() => toggleExpand('time1')}>читать дальше</span>
                </>
              )}
            </p>
            {expandedItems['time1'] && (
              <button className={styles.readMore} onClick={() => toggleExpand('time1')}>
                Свернуть
              </button>
            )}
          </div>
        </div>

        {/* Самодиагностика */}
        <h2 className={styles.category}>Самодиагностика и управление состоянием</h2>

        {/* Книга 4 */}
        <div className={styles.bookCard}>
          <div className={styles.bookImage}></div>
          <div className={styles.bookContent}>
            <h3 className={styles.bookTitle}>
              «Название книги» <p className={styles.bookAuthor}>Автор книги</p>
            </h3>
            <p className={styles.reviewText}>Заголовок рецензии, заголовок рецензии.</p>
            <p className={styles.opisanie}>
              {expandedItems['diagnostic1'] ? (
                <>
                  Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы. Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы.
                </>
              ) : (
                <>
                  Эта книга оказалась для меня интересным опытом. В рецензии я постараюсь поделиться своими мыслями, что в ней откликнулось, а что — наоборот, вызвало вопросы...{' '}
                  <span className={styles.readMoreInline} onClick={() => toggleExpand('diagnostic1')}>читать дальше</span>
                </>
              )}
            </p>
            {expandedItems['diagnostic1'] && (
              <button className={styles.readMore} onClick={() => toggleExpand('diagnostic1')}>
                Свернуть
              </button>
            )}
          </div>
        </div>
      </section>

      <section className={styles.articlesSection}>
        <h2 className={styles.articlesTitle}>статьи</h2>
        <h3 className={styles.category}>Финансы</h3>

        {[1, 2, 3, 4, 5].map((item) => {
          const id = `article${item}`;
          return (
            <div className={styles.bookCard} key={id}>
              <div className={styles.bookImageArt}></div>
              <div className={styles.bookContent}>
                <h3 className={styles.bookTitleArt}>
                  Название статьи название статьи ещё название статьи
                </h3>
                <p className={styles.opisanieArt}>
                  {expandedItems[id] ? (
                    <>
                      Какое-то описание статьи или выемки из нее.  Какое-то описание статьи или выемки из нее. Какое-то описание статьи или выемки из нее.  Какое-то описание статьи или выемки из нее. Какое-то описание статьи или выемки из нее.  Какое-то описание статьи или выемки из нее. Какое-то описание статьи или выемки из нее.  Какое-то описание статьи или выемки из нее.
                    </>
                  ) : (
                    <>
                      Какое-то описание статьи или выемки из нее.  Какое-то описание статьи или выемки из нее. Какое-то описание статьи или выемки из нее.  Какое-то описание статьи или выемки из нее...{' '}
                      <span className={styles.readMoreInline} onClick={() => toggleExpand(id)}>читать далее</span>
                    </>
                  )}
                </p>
                {expandedItems[id] && (
                  <button className={styles.readMore} onClick={() => toggleExpand(id)}>
                    Свернуть
                  </button>
                )}
                <p className={styles.articleTags}>#тег1 #тег2</p>
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
}
