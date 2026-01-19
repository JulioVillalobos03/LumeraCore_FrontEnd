export type EmployeeStatus = "active" | "inactive";

export type Employee = {
  id: string;
  company_id: string;
  user_id: string | null;

  first_name: string;
  last_name: string;

  email: string | null;
  phone: string | null;
  position: string | null;
  department: string | null;

  status: EmployeeStatus;

  created_at?: string;
  updated_at?: string;

    custom_fields?: Record<string, unknown> | null;
};

export interface CustomFieldValue {
  field_id: string;
  label: string;
  type: string;
  value: string | number | boolean | null;
}


export type CreateEmployeeInput = {
  first_name: string;
  last_name: string;
  email?: string | null;
  phone?: string | null;
  position?: string | null;
  department?: string | null;
  user_id?: string | null;
  custom_fields?: Record<string, unknown> | null;
};

export type UpdateEmployeeInput = Partial<CreateEmployeeInput>;

export type ChangeEmployeeStatusInput = {
  status: EmployeeStatus;
};


// src/types/custom-field.ts
export type CustomField = {
  id: string;
  entity: string;
  field_key: string;
  label: string;
  field_type: "text" | "number" | "date" | "boolean" | "select";
  required: boolean;
  options?: { label: string; value: string }[] | null;
  active?: boolean; // opcional (no siempre lo usas)
};