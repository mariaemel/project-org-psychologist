
const API_BASE_URL = 'http://127.0.0.1:8000';



export interface Article {
  id: number;
  title: string;
  short_description: string;
  content: string;
  published_date: string;
  is_published: boolean;
  tag: string;
}

export async function fetchArticles(): Promise<Article[]> {
  const response = await fetch(`${API_BASE_URL}/articles/list/`);
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  const data = await response.json();
  return data.results || data;
}

export interface SpecialistInfo {
  id: number;
  name: string;
  full_name: string;
  experience: string;
  education: string;
  social_links: string;
  curriculum: string;
  resultator: string;
  photo?: string;
}

export async function fetchSpecialistInfo(): Promise<SpecialistInfo> {
  const response = await fetch(`${API_BASE_URL}/specialist-info/`);
  if (!response.ok) {
    throw new Error('Failed to fetch specialist info');
  }
  return response.json();
}
