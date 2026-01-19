import { useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import type {
  AuthUser,
  CompanyContext,
} from "./types";
import {
    clearActiveCompany,
  clearSession,
  getActiveCompany,
  getToken,
  getUser,
  saveActiveCompany,
  saveSession,
} from "./auth.storage";
import { loginRequest, authContextRequest } from "../api/auth.api";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(getToken());
  const [user, setUser] = useState<AuthUser | null>(getUser());

  const [hasCompany, setHasCompany] = useState(false);
  const [companies, setCompanies] = useState<CompanyContext[]>([]);
  const [activeCompany, setActiveCompany] = useState<CompanyContext | null>(
  getActiveCompany()
);





  const setSession = async (token: string, user: AuthUser) => {
  // 1️⃣ Guarda token PRIMERO
  saveSession(token, user);

  // 2️⃣ Ahora sí, ya existe el token para axios
  const ctx = await authContextRequest();

  // 3️⃣ Actualiza el estado
  setToken(token);
  setUser(user);
  setHasCompany(ctx.hasCompany);
  setCompanies(ctx.companies);
  setActiveCompany(ctx.activeCompany);
  saveActiveCompany(ctx.activeCompany);
};


  const login = async (email: string, password: string) => {
    const res = await loginRequest(email, password);
    await setSession(res.token, res.user);
  };

  const logout = () => {
  clearSession();
  clearActiveCompany();

  setToken(null);
  setUser(null);
  setHasCompany(false);
  setCompanies([]);
  setActiveCompany(null);
};


  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token && !!user,

      hasCompany,
      companies,
      activeCompany,

      login,
      logout,
      setSession,
    }),
    [token, user, hasCompany, companies, activeCompany]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
