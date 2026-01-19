export type CustomFieldOption = { label: string; value: string };

export type CustomField = {
  id: string;
  entity: string;
  field_key: string;
  label: string;
  field_type: "text" | "number" | "date" | "boolean" | "select";
  required: boolean;
  options: CustomFieldOption[] | null; // en tu backend viene options (o null)
  active?: boolean; // opcional si luego lo agregas
};
