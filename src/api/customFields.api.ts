import { api } from "./axios";
import type { CustomField } from "../types/custom-field";

export async function listCustomFields(entity: string): Promise<CustomField[]> {
  const { data } = await api.get<{ ok: boolean; data: CustomField[] }>(
    "/custom-fields",
    { params: { entity } }
  );
  return data.data;
}

export type CreateCustomFieldPayload = {
  entity: string;
  field_key: string;
  label: string;
  field_type: "text" | "number" | "date" | "boolean" | "select";
  required?: boolean;
  options?: { label: string; value: string }[] | null;
};

export async function createCustomField(payload: CreateCustomFieldPayload) {
  const { data } = await api.post("/custom-fields", payload);
  return data;
}
