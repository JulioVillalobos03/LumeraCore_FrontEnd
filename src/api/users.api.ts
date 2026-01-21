import { getActiveCompany } from "../auth/auth.storage";
import type { CompanyUser, CreateUserInput } from "../modules/users/types";
import { api } from "./axios";

export async function listUsers(): Promise<CompanyUser[]> {
  const company = getActiveCompany();

  if (!company?.company_id) {
    throw new Error("No active company");
  }

  const { data } = await api.get<{ users: CompanyUser[] }>(
    `/company-users/${company.company_id}`
  );

  return data.users;
}

export async function changeUserStatus(
  companyUserId: string,
  status: "active" | "inactive"
) {
  await api.patch(`/company-users/${companyUserId}/status`, { status });
}

export async function createUser(payload: CreateUserInput): Promise<void> {
  await api.post("/users", payload);
}

export async function updateUser(
  id: string,
  payload: { name: string; email: string }
) {
  await api.patch(`/users/${id}`, payload);
}

/* =====================
   ROLES
   ===================== */


