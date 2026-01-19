import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CreateProductInput, Product } from "./types";
import type { CustomField } from "../employees/types";
import { listCustomFields } from "../../api/customFields.api";
import Spinner from "../../components/common/Spinner";

type Mode = "create" | "edit";

interface Props {
  open: boolean;
  mode: Mode;
  initial?: Product | null;
  onClose: () => void;
  onSubmit: (payload: CreateProductInput) => Promise<void>;
}

export default function ProductFormModal({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();

  const defaultForm: CreateProductInput = useMemo(
    () => ({
      name: "",
      sku: "",
      price: 0,
      description: "",
      custom_fields: {},
    }),
    []
  );

  const [form, setForm] = useState<CreateProductInput>(defaultForm);
  const [customDefs, setCustomDefs] = useState<CustomField[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [saving, setSaving] = useState(false);

  /* =======================
     Load custom fields
     ======================= */
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      console.log("🟡 Loading product custom fields...");
      setLoadingFields(true);
      try {
        const defs = await listCustomFields("products");
        console.log("🟡 Custom field defs:", defs);
        setCustomDefs(defs);
      } finally {
        setLoadingFields(false);
      }
    };

    void load();
  }, [open]);

  /* =======================
     Load initial data (edit)
     ======================= */
  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initial) {
      console.log("🟠 Editing product:", initial);
      setForm({
        name: initial.name,
        sku: initial.sku ?? "",
        price: initial.price,
        description: initial.description ?? "",
        custom_fields: initial.custom_fields ?? {},
      });
    } else {
      setForm(defaultForm);
    }
  }, [open, mode, initial, defaultForm]);

  if (!open) return null;

  const update = (key: keyof CreateProductInput, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateCustom = (key: string, value: unknown) => {
    setForm((prev) => ({
      ...prev,
      custom_fields: {
        ...(prev.custom_fields ?? {}),
        [key]: value,
      },
    }));
  };

  /* =======================
     SUBMIT
     ======================= */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload: CreateProductInput = {
        name: form.name,
        sku: form.sku || null,
        price: form.price,
        description: form.description || null,
        custom_fields:
          form.custom_fields && Object.keys(form.custom_fields).length > 0
            ? form.custom_fields
            : null,
      };


      await onSubmit(payload);

      onClose();
    } catch (e) {
      console.error("❌ ERROR SAVING PRODUCT", e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-2xl bg-(--bg-surface) rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-6">
          {mode === "create"
            ? t("products.create")
            : t("products.edit")}
        </h2>

        <form onSubmit={submit} className="space-y-6">
          {/* Base fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("products.form.name")}
              value={form.name}
              onChange={(v) => update("name", v)}
              required
            />

            <Input
              label="SKU"
              value={form.sku ?? ""}
              onChange={(v) => update("sku", v)}
            />

            <Input
              type="number"
              label={t("products.form.price")}
              value={String(form.price)}
              onChange={(v) => update("price", Number(v))}
              required
            />

            <Input
              label={t("products.form.description")}
              value={form.description ?? ""}
              onChange={(v) => update("description", v)}
            />
          </div>

          {/* Custom fields */}
          {loadingFields && (
            <div className="flex justify-center py-6">
              <Spinner />
            </div>
          )}

          {!loadingFields && customDefs.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-(--text-secondary) mb-3">
                {t("products.customFields")}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customDefs.map((f) => {
                  const value = form.custom_fields?.[f.field_key];

                  if (f.field_type === "select") {
                    return (
                      <SelectField
                        key={f.id}
                        label={f.label}
                        required={f.required}
                        value={String(value ?? "")}
                        options={Array.isArray(f.options) ? f.options : []}
                        onChange={(v) => updateCustom(f.field_key, v)}
                      />
                    );
                  }

                  return (
                    <Input
                      key={f.id}
                      label={f.label}
                      required={f.required}
                      value={String(value ?? "")}
                      onChange={(v) => updateCustom(f.field_key, v)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-(--bg-app)"
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-(--color-primary) text-white"
            >
              {saving ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =======================
   Inputs
   ======================= */

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-(--text-secondary) mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2.5 rounded-lg bg-(--bg-app)"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-(--text-secondary) mb-1">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-2.5 rounded-lg bg-(--bg-app)"
      >
        <option value="">— {label} —</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
