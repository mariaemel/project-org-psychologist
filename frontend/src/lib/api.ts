import { API_BASE_URL } from '@/config';
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

export interface Test {
  slug: string;
  title: string;
  short_description: string;
  est_minutes: number;
  hero_image_url: string;
}

export interface Question {
  id: number;
  order_index: number;
  text: string;
  type: string;
  required: boolean;
  options: Option[];
  progress?: {
    index: number;
    total: number;
  };
}

export interface Option {
  id: number;
  order_index: number;
  text: string;
  value: string;
  dimension_code: string;
}

export async function startTest(testSlug: string): Promise<{attempt_id: number, first_question: Question}> {
  const response = await fetch(`${API_BASE_URL}/tests/attempts/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ test_slug: testSlug }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to start test: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function getQuestion(attemptId: number, questionIndex: number): Promise<{question: Question}> {
  const response = await fetch(`${API_BASE_URL}/tests/attempts/${attemptId}/question/${questionIndex}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch question: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function saveAnswer(attemptId: number, answerData: {
  question_id: number;
  option_id?: number;
  option_ids?: number[];
  text_value?: string;
}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/tests/attempts/${attemptId}/answer-and-next`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(answerData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save answer: ${response.status} ${errorText}`);
  }

  return response.json();
}

export async function finishTest(attemptId: number): Promise<{result_id: number, result_url: string}> {
  const response = await fetch(`${API_BASE_URL}/tests/attempts/${attemptId}/finish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to finish test: ${response.status} ${errorText}`);
  }

  return response.json();
}

export interface ResultData {
  test: {
    slug: string;
    title: string;
  };
  computed_at: string;
  dimensions: {
    code: string;
    title: string;
    score: number;
    level: string;
    explanation_md: string;
  }[];
  summary_md: string;
  viz: {
    type: string;
    data: {
      labels: string[];
      values: number[];
    };
  };
  actions: {
    can_copy_link: boolean;
    restart_url: string;
  };
}

export async function getResult(uuid: string): Promise<ResultData> {
  const response = await fetch(`${API_BASE_URL}/tests/leadership-styles/results/${uuid}`);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to fetch result: ${response.status} ${errorText}`);
  }

  return response.json();
}


export interface TestDetail {
  slug: string;
  title: string;
  short_description: string;
  instructions_md: string;
  est_minutes: number;
  hero_image_url: string;
  seo_title: string;
  seo_description: string;
  og_image_url: string;
}

export async function fetchTestDetail(slug: string): Promise<TestDetail> {
  const response = await fetch(`${API_BASE_URL}/tests/${slug}`);

  if (!response.ok) {
    throw new Error('Failed to fetch test data');
  }

  return response.json();
}

export async function fetchTestDetailCareer(slug: string): Promise<TestDetail> {
  const response = await fetch(`${API_BASE_URL}/tests/${slug}`);

  if (!response.ok) {
    throw new Error('Failed to fetch test data');
  }

  return response.json();
}
