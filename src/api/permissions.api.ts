import type { Permission } from "../modules/permissions/type";
import { api } from "./axios";

export async function listPermissions(): Promise<Permission[]> {
  const { data } = await api.get<{ ok: boolean; data: Permission[] }>(
    "/permissions"
  );
  return data.data;
}

export async function assignPermissionToRole(payload: {
  roleId: string;
  permissionId: string;
}) {
  await api.post("/permissions/assign", payload);
}

export async function createPermission(key: string): Promise<Permission> {
  // tu backend espera { key }
  const { data } = await api.post<Permission>("/permissions", { key });
  return data;
}
