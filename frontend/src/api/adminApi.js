import { getToken } from "../utils/authToken.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options) {
  const token = getToken();
  const res = await fetch(`${API_URL}/admin${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Помилка запиту (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const adminApi = {
  overview: () => request("/overview"),
  listUsers: () => request("/users"),
  banUser: (id) => request(`/users/${id}/ban`, { method: "PATCH" }),
  unbanUser: (id) => request(`/users/${id}/unban`, { method: "PATCH" }),
  kickUser: (id) => request(`/users/${id}/kick`, { method: "PATCH" }),
  setRole: (id, role) => request(`/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
  deleteUser: (id) => request(`/users/${id}`, { method: "DELETE" }),
};
