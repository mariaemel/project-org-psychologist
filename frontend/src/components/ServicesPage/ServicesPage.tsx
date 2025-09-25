'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import styles from './ServicesPage.module.css';
import dynamic from 'next/dynamic';
import { API_BASE_URL } from '@/config';

const RequestForm = dynamic(() => import('@/components/RequestForm/RequestForm'), { ssr: false });

export interface Service {
  id: number;
  name: string;
  duration: string;
  description: string;
  price: string;
  category: string;
  is_active: boolean;
  client_type: 'individual' | 'organization';
}

export async function fetchServices(clientType?: 'individual' | 'organization') {
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

    return allServices;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

export default function ServicesPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('type') === 'organization' ? 'organization' : 'individual';
  const [tab, setTab] = useState<'individual' | 'organization'>(initialTab);
  const [showForm, setShowForm] = useState(false);
  const [selectedServiceName, setSelectedServiceName] = useState<string | null>(null);
  const [allServices, setAllServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchServices(tab);
      console.log('Total services loaded:', data.length);
      setAllServices(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Не удалось загрузить услуги');
    } finally {
      setLoading(false);
    }
  };
  loadServices();
}, [tab]);

  const filteredServices = allServices.filter(service =>
    service.client_type === tab && service.is_active
  );

  const servicesByCategory = filteredServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const openForm = (name: string) => {
    setSelectedServiceName(name);
    setShowForm(true);
  };

  if (loading) {
    return <div className={styles.loading}></div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!loading && !error && filteredServices.length === 0) {
    return (
      <div className={styles.empty}>
        {tab === 'organization'
          ? ''
          : ''}
      </div>
    );
  }

  return (
    <div className={styles.servicesPage}>
      <div className={styles.tabs}>
        <button
          className={tab === 'individual' ? styles.active : ''}
          onClick={() => setTab('individual')}
        >
          ДЛЯ ФИЗИЧЕСКИХ ЛИЦ
        </button>
        <button
          className={tab === 'organization' ? styles.active : ''}
          onClick={() => setTab('organization')}
        >
          ДЛЯ ЮРИДИЧЕСКИХ ЛИЦ
        </button>
      </div>

      {Object.entries(servicesByCategory).map(([category, services]) => (
        <div key={category} className={styles.categorySection}>
          <h2>{getCategoryDisplayName(category, tab)}</h2>
          <div className={styles.servicesList}>
            {services.map(service => (
              <div key={service.id} className={styles.serviceCard}>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className={styles.details}>
                  <div className={styles.detailItem}>
                    <img src="/clock.svg" alt="clock" className={styles.icon} />
                    <span><strong>Продолжительность:</strong> {service.duration}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <img src="/Group.svg" alt="price" className={styles.icon} />
                    <span><strong>Стоимость:</strong> {service.price}</span>
                  </div>
                </div>
                <button
                  className={styles.signupButton}
                  onClick={() => openForm(service.name)}
                >
                  Записаться
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showForm && selectedServiceName !== null && (
        <RequestForm
          onClose={() => setShowForm(false)}
          defaultServiceName={selectedServiceName}
        />
      )}
    </div>
  );
}

function getCategoryDisplayName(categoryKey: string, clientType: 'individual' | 'organization'): string {
  const categoryMaps = {
    individual: {
      'consulting': 'консультирование',
      'career': 'карьерное консультирование',
      'other': 'другие услуги'
    },
    organization: {
      'consulting': 'консультирование',
      'staff': 'оценка и подбор персонала',
      'other': 'другие услуги'
    }
  };

  const clientCategories = categoryMaps[clientType];
  const displayName = (clientCategories as Record<string, string>)[categoryKey];

  return displayName || categoryKey;
}
