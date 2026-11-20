const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

export async function api(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(BASE_URL + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && token) {
    localStorage.removeItem('token');
    window.location.reload();
  }
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}
