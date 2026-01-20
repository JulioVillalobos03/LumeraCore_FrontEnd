import axios from "axios";
import { clearSession, getActiveCompany, getToken } from "../auth/auth.storage";


export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
  const token = getToken();
  const company = getActiveCompany();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (company?.company_id) {
    config.headers["x-company-id"] = company.company_id;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // 🔥 token inválido / expirado
      clearSession();

      // Evitar redirect infinito
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);