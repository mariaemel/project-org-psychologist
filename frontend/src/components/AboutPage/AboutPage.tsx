'use client';
import styles from './AboutPage.module.css';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config';

interface SpecialistInfo {
  id: number;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface ImageAsset {
  id: number;
  name: string;
  image: string;
  created_at: string;
}

const RequestForm = dynamic(() => import('@/components/RequestForm/RequestForm'), { ssr: false });

export default function AboutPage() {
  const [formType, setFormType] = useState<null | 'request' | 'question'>(null);
  const [specialistInfo, setSpecialistInfo] = useState<SpecialistInfo | null>(null);
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const closeForm = () => setFormType(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const specialistResponse = await fetch(`${API_BASE_URL}/specialist-info/`);
      const specialistData = await specialistResponse.json();
      const imagesResponse = await fetch(`${API_BASE_URL}/images/`);
      const imagesData = await imagesResponse.json();

      if (!specialistResponse.ok) {
        throw new Error(`Failed to fetch specialist info: ${specialistResponse.status}`);
      }

      if (!imagesResponse.ok) {
        throw new Error(`Failed to fetch images: ${imagesResponse.status}`);
      }

      setSpecialistInfo(specialistData);

      let imagesArray: ImageAsset[] = [];

      if (Array.isArray(imagesData)) {
        imagesArray = imagesData;
      } else if (imagesData && Array.isArray(imagesData.results)) {
        imagesArray = imagesData.results;
      } else if (imagesData && imagesData.data && Array.isArray(imagesData.data)) {
        imagesArray = imagesData.data;
      }
      setImages(imagesArray);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getImageUrl = (imagePath: string) => {

    if (imagePath.startsWith('http')) {
      return imagePath;
    }

    if (imagePath.startsWith('/media/')) {
      return `${API_BASE_URL}${imagePath}`;
    }

    return `${API_BASE_URL}/media/${imagePath}`;
  };

  const getContentParagraphs = () => {
    if (!specialistInfo?.content) {
      return [];
    }

    const paragraphs = specialistInfo.content.split('\n').filter(paragraph => paragraph.trim() !== '');
    return paragraphs;
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  const contentParagraphs = getContentParagraphs();

  const fallbackContent = [
    "."
  ];

  const displayParagraphs = contentParagraphs.length > 0 ? contentParagraphs : fallbackContent;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.aboutSection}>
          <div className={styles.contentWrapper}>
            <div className={styles.imagePlaceholder}>
              {images.length > 0 && images[0] ? (
                <Image
                  src={getImageUrl(images[0].image)}
                  alt={images[0].name}
                  width={400}
                  height={400}
                  className={styles.profileImage}
                  onError={(e) => {
                    console.error('Error loading image:', images[0].image);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className={styles.imageFallback}>Изображение</div>
              )}
            </div>
            <div className={styles.textContent}>
              <h2 className={styles.title}>обо мне</h2>
              {displayParagraphs.slice(0, 3).map((paragraph, index) => (
                <p key={index} className={styles.text}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {displayParagraphs[3] && (
            <p className={styles.footerNote}>
              {displayParagraphs[3]}
            </p>
          )}
        </section>

        <section className={styles.educationSection}>
          <h2 className={styles.educationTitle}>образование</h2>

          <div className={styles.blockRow}>
            <p className={styles.textObr}>
              {displayParagraphs[4] }
            </p>
            <div className={styles.grayBlock}>
              {images.length > 1 && images[1] ? (
                <Image
                  src={getImageUrl(images[1].image)}
                  alt={images[1].name}
                  width={410}
                  height={380}
                  className={styles.educationImage}
                />
              ) : (
                <div className={styles.imageFallback}>Диплом</div>
              )}
            </div>
          </div>

          <div className={styles.blockRow}>
            <div className={styles.grayBlockSmall}>
              {images.length > 2 && images[2] ? (
                <Image
                  src={getImageUrl(images[2].image)}
                  alt={images[2].name}
                  width={440}
                  height={280}
                  className={styles.educationImageSmall}
                />
              ) : (
                <div className={styles.imageFallback}>УрФУ</div>
              )}
            </div>
            <p className={styles.textObr1}>
              {displayParagraphs[5]}
            </p>
          </div>

          <div className={styles.blockRow}>
            <div className={styles.textList}>
              <p>
                {displayParagraphs[6] }
              </p>
              <ul>
                <li>{displayParagraphs[7] }</li>
                <li>{displayParagraphs[8] }</li>
              </ul>
            </div>
            <div className={styles.blockGrid}>
              {images.length > 3 && images.slice(3, 7).map((image, index) => (
                <div key={image.id} className={styles.square}>
                  <Image
                    src={getImageUrl(image.image)}
                    alt={image.name}
                    width={200}
                    height={200}
                    className={styles.gridImage}
                  />
                </div>
              ))}
              {images.length <= 3 && Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className={styles.square}>
                  <div className={styles.imageFallback}>Сертификат {index + 1}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.experienceSection}>
          <div className={styles.contentWrapper2}>
            <div className={styles.leftColumn}>
              <div className={styles.yearBox}>2013</div>
              <div className={styles.yearBox}>2021</div>
            </div>
            <div className={styles.rightColumn}>
              <h2 className={styles.experiencetitle}>опыт</h2>
              <p className={styles.textOpit}>
                {displayParagraphs[9] }
              </p>
              <p className={styles.textOpit}>
                {displayParagraphs[10] }
              </p>
            </div>
          </div>
        </section>

        <section className={styles.methodsSection}>
          <h2 className={styles.methodtitle}>методы работы</h2>

          <div className={styles.step}>
            <div className={styles.textmethods}>
              <p>{contentParagraphs[11] }</p>
              <p>{contentParagraphs[12] }</p>
            </div>
            {images.length > 7 && images[7] ? (
              <Image
                src={images[7].image}
                alt={images[7].name}
                width={220}
                height={220}
                className={styles.image}
              />
            ) : (
              <img
                src="/methods-1.png"
                alt="Сбор анамнеза"
                className={styles.image}
              />
            )}
          </div>

          <div className={styles.step}>
            {images.length > 8 && images[8] ? (
              <Image
                src={images[8].image}
                alt={images[8].name}
                width={220}
                height={220}
                className={styles.image}
              />
            ) : (
              <Image
                src="/methods-2.png"
                alt="Диагностика"
                width={220}
                height={220}
                className={styles.image}
              />
            )}
            <div className={styles.textmethods1}>
              <p>{contentParagraphs[13] }</p>
            </div>
          </div>

          <div className={styles.step}>
            <div className={styles.textmethods2}>
              <p>{contentParagraphs[14]}</p>
            </div>
            {images.length > 9 && images[9] ? (
              <Image
                src={images[9].image}
                alt={images[9].name}
                width={240}
                height={240}
                className={styles.image3}
              />
            ) : (
              <Image
                src="/methods-3.png"
                alt="Рецепт"
                width={240}
                height={240}
                className={styles.image3}
              />
            )}
          </div>

          <div className={styles.step}>
            {images.length > 10 && images[10] ? (
              <Image
                src={images[10].image}
                alt={images[10].name}
                width={300}
                height={300}
                className={styles.image}
              />
            ) : (
              <Image
                src="/methods-4.png"
                alt="Поддержка"
                width={300}
                height={300}
                className={styles.image}
              />
            )}
            <div className={styles.textmethods3}>
              <p>{contentParagraphs[15] }</p>
              <p>{contentParagraphs[16] }</p>
            </div>
          </div>
        </section>

        <section className={styles.paperSection}>
          <div className={styles.paperContent}>
            <img
              src="/paper-bg.jpg"
              alt="paper background"
              className={styles.paperImage}
            />
            <img
              src="/quote.png"
              alt="paper background"
              className={styles.paperQuote}
            />
            <button className={styles.paperButton} onClick={() => setFormType('request')}>
              Оставить заявку
            </button>
          </div>

          {formType === 'request' && <RequestForm onClose={closeForm} />}
        </section>
      </div>
    </div>
  );
}
