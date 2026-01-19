export interface AuthUser {
    id: string;
    name: string;
    email: string;
}

export interface LoginResponse {
    ok: boolean;
    token: string;
    user: AuthUser;
}

export interface AuthResponse {
    ok: boolean;
    token: string;
    user: AuthUser;
    message?: string;
}

export interface ApiError {
    ok: false;
    message: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;

  hasCompany: boolean;
  companies: CompanyContext[];
  activeCompany: CompanyContext | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setSession: (token: string, user: AuthUser) => Promise<void>;
}


export interface CompanyContext {
  company_id: string;
  company_name: string;
  role_id: string;
  role_name: string;
  status: string;
}

export interface AuthContextResponse {
  ok: boolean;
  hasCompany: boolean;
  companies: CompanyContext[];
  activeCompany: CompanyContext | null;
}

