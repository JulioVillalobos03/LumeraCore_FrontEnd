import { api } from "./axios";
import type {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  ChangeEmployeeStatusInput,
} from "../modules/employees/types";

type OkResponse<T> = { ok: true; data: T };

export async function listEmployees() {
  const { data } = await api.get<OkResponse<Employee[]>>("/employees");
  return data.data;
}

export async function createEmployee(payload: CreateEmployeeInput) {
  const { data } = await api.post<OkResponse<{ id: string }>>("/employees", payload);
  return data.data;
}

export async function getEmployee(id: string) {
  const { data } = await api.get<OkResponse<Employee>>(`/employees/${id}`);
  return data.data;
}

export async function updateEmployee(id: string, payload: UpdateEmployeeInput) {
  const { data } = await api.put<{ ok: true }>(`/employees/${id}`, payload);
  return data.ok;
}

export async function changeEmployeeStatus(id: string, payload: ChangeEmployeeStatusInput) {
  const { data } = await api.patch<{ ok: true }>(`/employees/${id}/status`, payload);
  return data.ok;
}
