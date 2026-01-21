import type { Permission } from "../modules/permissions/type";
import type { CreateRoleInput, Role } from "../modules/roles/type";
import { api } from "./axios";

export async function listRoles(): Promise<Role[]> {
  const { data } = await api.get<{ ok: boolean; data: Role[] }>("/roles");
  return data.data; // 👈 CLAVE
}

export async function createRole(payload: CreateRoleInput) {
  await api.post("/roles", payload);
}

export async function assignRoleToUser(
  companyUserId: string,
  roleId: string
) {
  await api.patch("/roles/assign", {
    companyUserId,
    roleId,
  });
}

export async function getRolePermissions(
  roleId: string
): Promise<Permission[]> {
  const { data } = await api.get<{ ok: boolean; data: Permission[] }>(
    `/roles/${roleId}/permissions`
  );
  return data.data;
}