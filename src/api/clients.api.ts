import { api } from "./axios";
import type { Client, ClientStatus } from "../modules/clients/types";

type ListClientsResponse = { ok: boolean; data: Client[] };
type GetClientResponse = { ok: boolean; data: Client };
type MutateResponse = { ok: boolean; data?: unknown };

/**
 * GET /clients
 */
export async function listClients(): Promise<Client[]> {
  const { data } = await api.get<ListClientsResponse>("/clients");
  return data.data;
}

/**
 * GET /clients/:id
 */
export async function getClient(id: string): Promise<Client> {
  const { data } = await api.get<GetClientResponse>(`/clients/${id}`);
  return data.data;
}

/**
 * POST /clients
 */
export async function createClient(payload: Partial<Client>): Promise<{ id: string }> {
  const { data } = await api.post<MutateResponse>("/clients", payload);

  // tu backend regresa: { ok: true, data: { id } }
  const result = data.data as { id: string } | undefined;
  return result ?? { id: "" };
}

/**
 * PUT /clients/:id
 */
export async function updateClient(id: string, payload: Partial<Client>): Promise<void> {
  await api.put<MutateResponse>(`/clients/${id}`, payload);
}

/**
 * PATCH /clients/:id/status
 */
export async function changeClientStatus(
  id: string,
  status: ClientStatus
): Promise<void> {
  await api.patch<MutateResponse>(`/clients/${id}/status`, { status });
}
