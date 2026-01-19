export type ProductStatus = "active" | "inactive";

export type Product = {
  id: string;
  name: string;
  sku?: string | null;
  price: number;
  description?: string | null;
  status: "active" | "inactive";
  custom_fields?: Record<string, unknown> | null;
};

export type CreateProductInput = {
  name: string;
  sku?: string | null;
  price: number;
  description?: string | null;
  custom_fields?: Record<string, unknown> | null;
};

export type CustomField = {
  id: string;
  entity: string;
  field_key: string;
  label: string;
  field_type: "text" | "number" | "date" | "boolean" | "select";
  required: boolean;
  options?: { label: string; value: string }[] | null;
};
