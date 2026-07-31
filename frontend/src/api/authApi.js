const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Помилка запиту (${res.status})`);
  }
  return res.json();
}

export const authApi = {
  login: (username, password) =>
    request("/auth/login", { method: "POST", body: JSON.stringify({ email: username, password }) }),
  register: (email, password) =>
    request("/auth/register", { method: "POST", body: JSON.stringify({ email, password }) }),
  me: (token) => request("/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
};
