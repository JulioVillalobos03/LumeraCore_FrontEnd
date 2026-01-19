import { api } from "./axios";
import type { AuthContextResponse, AuthResponse } from "../auth/types";

export async function loginRequest(email: string, password: string) {
    const { data } = await api.post<AuthResponse>("/auth/login", { email, password });
    return data;
}

export async function registerRequest(
  name: string,
  email: string,
  password: string
) {
  const { data } = await api.post<AuthResponse>(
    "/auth/register",
    { name, email, password }
  );
  return data;
}

export async function authContextRequest() {
  const { data } = await api.get<AuthContextResponse>("/auth/context");
  console.log("Este es el context" + data)
  return data;
}