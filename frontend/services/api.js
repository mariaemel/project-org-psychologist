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
