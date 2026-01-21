export type ClientStatus = "active" | "inactive";

export interface Client {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  tax_id?: string | null;
  address?: string | null;
  status: ClientStatus;
  custom_fields?: Record<string, unknown>;
  created_at?: string;
}
