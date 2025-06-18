'use client';
import { useState, useEffect } from 'react';
import styles from './ArticlesPage.module.css';

interface Article {
  id: number;
  type: 'article' | 'bookshelf';
  category: string;
  title: string;
  short_description: string;
  content: string;
  published_date: string;
  is_published: boolean;
  tags: string;
}

export default function ArticlesPage() {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:8000/articles/list/');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const articlesData = Array.isArray(data) ? data : (data.results || []);
        setArticles(articlesData);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Не удалось загрузить статьи. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка материалов...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const publishedArticles = articles.filter(article => article.is_published);
  const bookshelfItems = publishedArticles.filter(item => item.type === 'bookshelf');
  const articleItems = publishedArticles.filter(item => item.type === 'article');

  const bookshelfByCategory = bookshelfItems.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, Article[]>);

  const getCategoryDisplayName = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'finance': 'Управление финансами',
      'time': 'Тайм менеджмент',
      'self': 'Самодиагностика и управление состоянием',
      'other': 'Другие материалы'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className={styles.wrapper}>
      {/* Книжная полка */}
      <section className={styles.shelfSection}>
        <img src="/vector-1.svg" alt="paper" className={styles.paperImage1} />
        <img src="/vector9.svg" alt="paper" className={styles.paperImage2} />
        <div className={styles.shelfHeader}>
          <h1 className={styles.shelfTitle}>книжная полка</h1>
          <p className={styles.shelfDescription}>
            В данном разделе я рассказываю своё мнение о прочитанных книгах и делюсь своими
            мыслями на их счёт.
          </p>
        </div>
        <img src="/vector7.svg" alt="paper" className={styles.paperImage3} />
        <img src="/vector8.svg" alt="paper" className={styles.paperImage4} />
        <img src="/vector2.svg" alt="paper" className={styles.paperImage10} />


        {Object.entries(bookshelfByCategory).map(([category, books]) => (
          <div key={category}>
            <h2 className={styles.category}>{getCategoryDisplayName(category)}</h2>
            {books.map(book => (
              <div key={book.id} className={styles.bookCard}>
                <div className={styles.bookImage}></div>
                <div className={styles.bookContent}>
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  {book.short_description && (
                    <p className={styles.reviewText}>{book.short_description}</p>
                  )}
                  <p className={styles.opisanie}>
                    {expandedItems[`book-${book.id}`] ? (
                      book.content
                    ) : (
                      <>
                        {book.content?.slice(0, 200) || 'Нет содержимого'}...
                        <span
                          className={styles.readMoreInline}
                          onClick={() => toggleExpand(`book-${book.id}`)}
                        >
                          читать дальше
                        </span>
                      </>
                    )}
                  </p>
                  {expandedItems[`book-${book.id}`] && (
                    <button
                      className={styles.readMore}
                      onClick={() => toggleExpand(`book-${book.id}`)}
                    >
                      Свернуть
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      {/* Статьи */}
      <section className={styles.articlesSection}>
        <img src="/vector9.svg" alt="paper" className={styles.paperImage5} />
        <img src="/vector3.svg" alt="paper" className={styles.paperImage6} />
        <img src="/vector4.svg" alt="paper" className={styles.paperImage7} />
        <img src="/vector-4.svg" alt="paper" className={styles.paperImage8} />
        <img src="/vector-3.svg" alt="paper" className={styles.paperImage9} />

        <h2 className={styles.articlesTitle}>статьи</h2>

        {articleItems.length > 0 ? (
          articleItems.map(article => (
            <div key={article.id} className={styles.bookCard}>
              <div className={styles.bookImageArt}></div>
              <div className={styles.bookContent}>
                <h3 className={styles.bookTitleArt}>{article.title}</h3>
                {article.short_description && (
                  <p className={styles.reviewText}>{article.short_description}</p>
                )}
                <p className={styles.opisanieArt}>
                  {expandedItems[`article-${article.id}`] ? (
                    article.content
                  ) : (
                    <>
                      {article.content?.slice(0, 200) || 'Нет содержимого'}...
                      <span
                        className={styles.readMoreInline}
                        onClick={() => toggleExpand(`article-${article.id}`)}
                      >
                        читать далее
                      </span>
                    </>
                  )}
                </p>
                {expandedItems[`article-${article.id}`] && (
                  <button
                    className={styles.readMore}
                    onClick={() => toggleExpand(`article-${article.id}`)}
                  >
                    Свернуть
                  </button>
                )}
                {article.tags && (
                  <p className={styles.articleTags}>
                    {article.tags.split(',').map(tag => `#${tag.trim()}`).join(' ')}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className={styles.empty}>Нет доступных статей</p>
        )}
      </section>
    </div>
  );
}
