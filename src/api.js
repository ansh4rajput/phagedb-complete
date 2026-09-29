const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.DEV ? 'http://localhost:8787/api' : '/api');

function authHeaders() {
  const token = localStorage.getItem('phagedb_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function api(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  const type = res.headers.get('content-type') || '';
  if (type.includes('application/json')) return res.json();
  return res.text();
}

export const getPhages = (qs='') => api(`/phages${qs}`);
export const getPhage = (id) => api(`/phages/${encodeURIComponent(id)}`);
export const getStats = () => api('/stats');
export const login = (identifier, password) => api('/session/login', { method:'POST', body: JSON.stringify({ identifier, password }) });
export const me = () => api('/me');
export const createPhage = (payload) => api('/phages', { method:'POST', body: JSON.stringify(payload) });
export const updatePhage = (id, payload) => api(`/phages/${id}`, { method:'PUT', body: JSON.stringify(payload) });
export const changeStatus = (id, status) => api(`/phages/${id}/status`, { method:'POST', body: JSON.stringify({ status }) });
