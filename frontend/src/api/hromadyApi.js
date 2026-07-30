import { getToken } from "../utils/authToken.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

async function request(path, options) {
  const token = getToken();
  const res = await fetch(`${API_URL}${path}`, {
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

export const hromadyApi = {
  list: () => request("/hromady"),
  create: (data) => request("/hromady", { method: "POST", body: JSON.stringify(data) }),
  update: (id, data) => request(`/hromady/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id) => request(`/hromady/${id}`, { method: "DELETE" }),
};
