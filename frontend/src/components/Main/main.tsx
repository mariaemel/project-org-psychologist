'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

import heroStyles from './Hero.module.css';
import aboutStyles from './About.module.css';
import orgStyles from './OrgPsychology.module.css';
import servicesStyles from './Services.module.css';
import teamStyles from './TeamBoost.module.css';

import Image from 'next/image';
import photoRoom from '@/images/gotov.png';
import { API_BASE_URL } from '@/config';

const RequestForm = dynamic(() => import('@/components/RequestForm/RequestForm'), { ssr: false });
const QuestionsFormPortal = dynamic(() => import('@/components/QuestionsForm/QuestionsFormPortal'), { ssr: false });


interface Service {
  id: number;
  name: string;
  duration: string;
  description: string;
  price: string;
  category: string;
  is_active: boolean;
  client_type: 'individual' | 'organization';
}

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<null | 'request' | 'question'>(null);
  const closeForm = () => setFormType(null);

  const [type, setType] = useState<'individuals' | 'businesses'>('individuals');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isIndividuals = type === 'individuals';
  const clientType = isIndividuals ? 'individual' : 'organization';

  const fetchServices = async (clientType?: 'individual' | 'organization', limit?: number): Promise<Service[]> => {
    let allServices: Service[] = [];
    let nextUrl = clientType
      ? `${API_BASE_URL}/services/list/?client_type=${clientType}&page_size=100`
      : `${API_BASE_URL}/services/list/?page_size=100`;

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) throw new Error('Failed to fetch services');

        const data = await response.json();
        allServices = [...allServices, ...(data.results || [])];

        nextUrl = data.next;
      }

      if (limit && allServices.length > limit) {
        allServices = allServices.slice(0, limit);
      }

      return allServices;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const data = await fetchServices(clientType, 3);
        setServices(data);
        setError(null);
      } catch (err) {
        console.error('Error loading services:', err);
        setError('Не удалось загрузить услуги');
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [clientType]);

  const toggleCard = (index: number) => {
    setExpandedCard(prev => (prev === index ? null : index));
  };

  const transformServices = (services: Service[]) => {
    return services.map(service => ({
      id: service.id,
      title: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price
    }));
  };

  const data = transformServices(services);

  return (
    <>
      {/* HERO */}
      <section className={heroStyles.hero}>
        <div className={heroStyles.content}>
          <div className={heroStyles.container}>
            <p className={heroStyles.role}>Организационный психолог</p>
            <h1 className={heroStyles.name}>Василина ДЕНИСЮК</h1>
            <p className={heroStyles.description}>
              Хотите изменений в своем бизнесе, карьере и состоянии?<br /> Вы пришли по адресу
            </p>
            <button className={heroStyles.button} onClick={() => setShowForm(true)}>Оставить заявку</button>
          </div>
        </div>

        <div className={heroStyles.quoteBox}>
          <p className={heroStyles.quote}>
            «Нам не дано вернуть вчерашний день, но то, что<br />
            будет завтра, зависит от нас»<br />
            <span className={heroStyles.author}>Линдон Джонсон</span>
          </p>
        </div>

        <img src="/styl.svg" alt="paper" className={heroStyles.paperImage} />
        {showForm && <RequestForm onClose={() => setShowForm(false)} />}
      </section>

      {/* ABOUT */}
      <section className={aboutStyles.about} id="about">
        <div className={aboutStyles.experienceContent}>
          <div className={aboutStyles.experienceBlock}>
            <div className={aboutStyles.imageBlock}></div>
            <div className={aboutStyles.textBlock}>
              <h2 className={aboutStyles.aboutTitle}>ОБО МНЕ</h2>
              <p>
                Более 10 лет я помогаю бизнесу становится эффективнее, анализируя и оптимизируя бизнес процессы и осуществляя работу с людьми. У меня индивидуальный подход к каждому конкретному человеку и бизнесу, напрямую связанный с его особенностями и направленный на максимальное раскрытие именно его потенциала и достижения его целей. Нет универсальных решений, есть только Вы и Ваш бизнес прекрасный и уникальный.
              </p>
            </div>
          </div>
        </div>
        <img src="/vector-1.svg" alt="paper" className={aboutStyles.paperImage2} />
        <img src="/vector-2.svg" alt="paper" className={aboutStyles.paperImage3} />
        <img src="/vector-3.svg" alt="paper" className={aboutStyles.paperImage4} />
        <img src="/vector-4.svg" alt="paper" className={aboutStyles.paperImage5} />
        <img src="/vector7.svg" alt="paper" className={aboutStyles.paperImage6} />
        <img src="/vector8.svg" alt="paper" className={aboutStyles.paperImage7} />
        <img src="/vector9.svg" alt="paper" className={aboutStyles.paperImage8} />
        <img src="/vector-4.svg" alt="paper" className={aboutStyles.paperImage9} />
      </section>

      {/* ORG PSYCHOLOGY */}
      <section className={orgStyles.orgPsychology} id="psychology">
        <div className={orgStyles.title}>ОРГАНИЗАЦИОННАЯ ПСИХОЛОГИЯ?</div>
        <div className={orgStyles.leftCard}>
          <p>
            Организационная психология работает на уровне личности, группы (коллектива, команды) и организации.
          </p>
          <img src="/vector2.svg" alt="paper" className={orgStyles.paperImage2} />
        </div>
        <div className={orgStyles.imageWrapper}>
          <img src="/girl.png" alt="Иллюстрация" className={orgStyles.imageWrapper1}/>
        </div>
        <div className={orgStyles.greenCard}>
          ◦ Определяет способности людей и способствует их развитию.
        </div>
        <div className={orgStyles.greenCard1}>
          ◦ Помогает проходить через изменения и адаптироваться к новым условиям.
        </div>
        <div className={orgStyles.greenCard2}>
          ◦ Помогает справиться с негативным состоянием и повысить продуктивность.
        </div>
      </section>

      {/* SERVICES */}
      <section className={servicesStyles.servicesSection} id="services">
        <div className={servicesStyles.tabs}>
          <button
            className={`${servicesStyles.tab} ${isIndividuals ? servicesStyles.active : ''}`}
            onClick={() => setType('individuals')}
          >
            ДЛЯ ФИЗИЧЕСКИХ ЛИЦ
          </button>
          <button
            className={`${servicesStyles.tab} ${!isIndividuals ? servicesStyles.active : ''}`}
            onClick={() => setType('businesses')}
          >
            ДЛЯ ЮРИДИЧЕСКИХ ЛИЦ
          </button>
        </div>

        <div className={servicesStyles.cardsWrapper}>
          {loading ? (
            <div className={servicesStyles.loading}>Загрузка услуг...</div>
          ) : error ? (
            <div className={servicesStyles.error}>{error}</div>
          ) : data.length === 0 ? (
            <div className={servicesStyles.empty}>Услуги не найдены</div>
          ) : (
            <>
              <div className={servicesStyles.cards}>
                {data.map((item, i) => {
                  const isExpanded = expandedCard === i;
                  return (
                    <div className={servicesStyles.card} key={item.id || i}>
                      <div className={servicesStyles.cardTitle}>{item.title}</div>
                      <div className={servicesStyles.cardDescription}>{item.description}</div>
                      <div className={servicesStyles.cardDuration}>
                        <strong>Продолжительность:</strong> {item.duration}
                      </div>

                      {isExpanded && (
                        <div className={servicesStyles.cardPrice}>
                          <strong>Стоимость:</strong> {item.price}
                        </div>
                      )}

                      <div className={servicesStyles.priceButton} onClick={() => toggleCard(i)}>
                        {isExpanded ? 'Скрыть' : 'Подробнее'}
                      </div>
                    </div>
                  );
                })}
              </div>
              <a
                href={`/services?type=${isIndividuals ? 'individual' : 'business'}`}
                className={servicesStyles.moreLink}
              >
                Больше услуг →
              </a>
            </>
          )}
        </div>
      </section>

      {/* TEAM BOOST (CTA) */}
      <section className={teamStyles.teamWorkSection}>
        <div className={teamStyles.container}>
          <div className={teamStyles.leftSide}>
            <Image src={photoRoom} alt="Работа в команде" className={teamStyles.teamImage} />
            <div className={teamStyles.buttons}>
              <button className={teamStyles.primaryButton} onClick={() => setFormType('request')}>Оставить заявку</button>
              <button className={teamStyles.secondaryButton} onClick={() => setFormType('question')}>Задать вопрос</button>
            </div>
          </div>
          <div className={teamStyles.rightSide}>
            <h2 className={teamStyles.title}>
              Готовы улучшить работу ?
            </h2>
            <div className={teamStyles.features}>
              <div className={teamStyles.featureCard}>Понять текущее положение дел</div>
              <div className={teamStyles.featureCard}>Разработать вектор движения</div>
              <div className={teamStyles.featureCard}>Побороть старые проблемы и устремиться к новым достижениям</div>
            </div>
          </div>
        </div>

        {formType === 'request' && <RequestForm onClose={closeForm} />}
        {formType === 'question' && <QuestionsFormPortal onClose={closeForm} />}
      </section>
    </>
  );
}
