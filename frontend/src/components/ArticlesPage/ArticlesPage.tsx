'use client';
import styles from './ArticlesPage.module.css';

export default function ArticlesPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.headingContainer}>
        <div className={styles.headingBox}>
          <h1 className={styles.heading}>Статьи</h1>
        </div>
      </div>

      <div className={styles.articleCard}>
        <div className={styles.imagePlaceholder}>
        <img
            src="/article-cover.jpg"
            alt="thumbnail"
            width={160}
            height={110}
            className={styles.imageInner}
          />
        </div>
        <div className={styles.articleContent}>
          <h2 className={styles.articleTitle}>
            Название статьи название статьи еще название статьи
          </h2>
          <p className={styles.articleDescription}>
            Какое-то описание статьи или выемки из нее. Какое-то описание статьи или выемки из нее.
            Какое-то описание статьи или выемки из нее.
          </p>
        </div>
      </div>

      <div className={styles.articleCard}>
        <div className={styles.imagePlaceholder}>
        <img
            src="/article-cover.jpg"
            alt="thumbnail"
            width={160}
            height={110}
            className={styles.imageInner}
          />
        </div>
        <div className={styles.articleContent}>
          <h2 className={styles.articleTitle}>
            Название статьи название статьи еще название статьи
          </h2>
          <p className={styles.articleDescription}>
            Какое-то описание статьи или выемки из нее. Какое-то описание статьи или выемки из нее.
            Какое-то описание статьи или выемки из нее.
          </p>
        </div>
      </div>

      <div className={styles.articleCard}>
        <div className={styles.imagePlaceholder}>
        <img
            src="/article-cover.jpg"
            alt="thumbnail"
            width={160}
            height={110}
            className={styles.imageInner}
          />
        </div>
        <div className={styles.articleContent}>
          <h2 className={styles.articleTitle}>
            Название статьи название статьи еще название статьи
          </h2>
          <p className={styles.articleDescription}>
            Какое-то описание статьи или выемки из нее. Какое-то описание статьи или выемки из нее.
            Какое-то описание статьи или выемки из нее.
          </p>
        </div>
      </div>

      <div className={styles.articleCard}>
        <div className={styles.imagePlaceholder}>
        <img
            src="/article-cover.jpg"
            alt="thumbnail"
            width={160}
            height={110}
            className={styles.imageInner}
          />
        </div>
        <div className={styles.articleContent}>
          <h2 className={styles.articleTitle}>
            Название статьи название статьи еще название статьи
          </h2>
          <p className={styles.articleDescription}>
            Какое-то описание статьи или выемки из нее. Какое-то описание статьи или выемки из нее.
            Какое-то описание статьи или выемки из нее.
          </p>
        </div>
      </div>

      <div className={styles.articleCard}>
        <div className={styles.imagePlaceholder}>
        <img
            src="/article-cover.jpg"
            alt="thumbnail"
            width={160}
            height={110}
            className={styles.imageInner}
          />
        </div>
        <div className={styles.articleContent}>
          <h2 className={styles.articleTitle}>
            Название статьи название статьи еще название статьи
          </h2>
          <p className={styles.articleDescription}>
            Какое-то описание статьи или выемки из нее. Какое-то описание статьи или выемки из нее.
            Какое-то описание статьи или выемки из нее.
          </p>
        </div>
      </div>

      <div className={styles.articleCard}>
        <div className={styles.imagePlaceholder}>
        <img
            src="/article-cover.jpg"
            alt="thumbnail"
            width={160}
            height={110}
            className={styles.imageInner}
          />
        </div>
        <div className={styles.articleContent}>
          <h2 className={styles.articleTitle}>
            Название статьи название статьи еще название статьи
          </h2>
          <p className={styles.articleDescription}>
            Какое-то описание статьи или выемки из нее. Какое-то описание статьи или выемки из нее.
            Какое-то описание статьи или выемки из нее.
          </p>
        </div>
      </div>
    </div>
  );
}
