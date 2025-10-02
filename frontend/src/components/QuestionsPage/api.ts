import { API_BASE_URL } from '@/config';

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export const faqAPI = {
  async getFAQs(): Promise<FAQItem[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/faq/`);
      if (!response.ok) {
        throw new Error('Ошибка при загрузке вопросов');
      }
      return await response.json();
    } catch (error) {
      console.error('Ошибка:', error);
      return [];
    }
  },
};
