import axios from "axios";
import { getActiveCompany, getToken } from "../auth/auth.storage";


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

  // ✅ necesario por tu companyMiddleware
  if (company?.company_id) {
    config.headers["x-company-id"] = company.company_id;
  }

  return config;
});