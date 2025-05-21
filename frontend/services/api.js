export const fetchData = async (endpoint) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`);
    if (!res.ok) {
      throw new Error('Ошибка при загрузке данных');
    }
    const data = await res.json();
    return data;
  };

export async function getPing() {
  const res = await fetch('http://127.0.0.1:8000/api/ping/');
  const data = await res.json();
  return data;
}

export const sendQuestion = async (formData) => {
  const data = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      data.append(key, value);
    }
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questions/create/`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(`Ошибка при отправке: ${JSON.stringify(error)}`);
  }

  return await res.json();
};
