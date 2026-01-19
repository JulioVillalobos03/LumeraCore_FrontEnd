import type { AuthUser } from "./types";

const TOKEN_KEY = "lumera_token";
const USER_KEY = "lumera_user";
const COMPANY_KEY = "lumera_company";

export function saveSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as AuthUser) : null;
}

export function saveActiveCompany(company: unknown) {
  localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
}

export function getActiveCompany() {
  const raw = localStorage.getItem(COMPANY_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearActiveCompany() {
  localStorage.removeItem(COMPANY_KEY);
}