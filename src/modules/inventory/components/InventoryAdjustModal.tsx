import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { listProducts } from "../../../api/products.api";
import { listCustomFields } from "../../../api/customFields.api";
import Spinner from "../../../components/common/Spinner";
import type { Product } from "../types";
import type { CustomField } from "../../employees/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    product_id: string;
    type: "in" | "out";
    quantity: number;
    notes?: string;
    custom_fields?: Record<string, unknown> | null;
  }) => Promise<void>;
}

/** Altura reservada para evitar que el modal cambie de tamaño */
const CUSTOM_FIELDS_MIN_HEIGHT = 220;

export default function InventoryAdjustModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();

  /* =======================
     State
     ======================= */
  const [products, setProducts] = useState<Product[]>([]);
  const [customDefs, setCustomDefs] = useState<CustomField[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingFields, setLoadingFields] = useState(false);
  const [saving, setSaving] = useState(false);

  const defaultForm = useMemo(
    () => ({
      product_id: "",
      type: "in" as "in" | "out",
      quantity: 1,
      notes: "",
      custom_fields: {} as Record<string, unknown>,
    }),
    []
  );

  const [form, setForm] = useState(defaultForm);

  /* =======================
     Load data on open
     ======================= */
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoadingProducts(true);
      setLoadingFields(true);

      try {
        const [productsData, customFieldsData] = await Promise.all([
          listProducts(),
          listCustomFields("inventory"),
        ]);

        setProducts(productsData);
        setCustomDefs(customFieldsData);
      } finally {
        setLoadingProducts(false);
        setLoadingFields(false);
      }
    };

    setForm(defaultForm);
    void load();
  }, [open, defaultForm]);

  if (!open) return null;

  /* =======================
     Helpers
     ======================= */
  const update = (key: keyof typeof form, value: unknown) => {
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

  const changeType = (type: "in" | "out") => {
    setForm((prev) => ({
      ...prev,
      type,
      custom_fields: type === "out" ? {} : prev.custom_fields,
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      await onSubmit({
        product_id: form.product_id,
        type: form.type,
        quantity: form.quantity,
        notes: form.notes || "",
        custom_fields:
          form.type === "in" &&
          form.custom_fields &&
          Object.keys(form.custom_fields).length > 0
            ? form.custom_fields
            : null,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  };

  /* =======================
     Render
     ======================= */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-2xl bg-(--bg-surface) rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-lg font-semibold">
          {t("inventory.adjust.title")}
        </h2>

        {/* =======================
           Switch Entrada / Salida
           ======================= */}
        <div className="flex rounded-lg bg-(--bg-app) p-1">
          <button
            type="button"
            onClick={() => changeType("in")}
            className={`
              flex-1 px-3 py-2 text-sm rounded-md transition
              ${
                form.type === "in"
                  ? "bg-(--color-primary) text-white"
                  : "text-(--text-secondary)"
              }
            `}
          >
            {t("inventory.adjust.in")}
          </button>

          <button
            type="button"
            onClick={() => changeType("out")}
            className={`
              flex-1 px-3 py-2 text-sm rounded-md transition
              ${
                form.type === "out"
                  ? "bg-(--color-primary) text-white"
                  : "text-(--text-secondary)"
              }
            `}
          >
            {t("inventory.adjust.out")}
          </button>
        </div>

        {/* =======================
           Base fields
           ======================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label={t("inventory.adjust.selectProduct")}
            value={form.product_id}
            required
            loading={loadingProducts}
            options={products.map((p) => ({
              label: p.name,
              value: p.id,
            }))}
            onChange={(v) => update("product_id", v)}
          />

          <Input
            type="number"
            label={t("inventory.columns.stock")}
            value={String(form.quantity)}
            required
            onChange={(v) => update("quantity", Number(v))}
          />
        </div>

        <Input
          label={t("inventory.adjust.notes")}
          value={form.notes}
          onChange={(v) => update("notes", v)}
        />

        {/* =======================
           Custom fields (espacio fijo)
           ======================= */}
        <div
          className={`
            transition-all duration-300 ease-in-out
            ${form.type === "in" ? "opacity-100" : "opacity-0 pointer-events-none"}
          `}
          style={{ minHeight: CUSTOM_FIELDS_MIN_HEIGHT }}
        >
          {form.type === "in" && (
            <>
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

                      switch (f.field_type) {
                        case "select":
                          return (
                            <SelectField
                              key={f.id}
                              label={f.label}
                              required={f.required}
                              value={String(value ?? "")}
                              options={Array.isArray(f.options) ? f.options : []}
                              onChange={(v) =>
                                updateCustom(f.field_key, v)
                              }
                            />
                          );

                        case "boolean":
                          return (
                            <SelectField
                              key={f.id}
                              label={f.label}
                              required={f.required}
                              value={String(value ?? "")}
                              options={[
                                { label: t("common.yes"), value: "true" },
                                { label: t("common.no"), value: "false" },
                              ]}
                              onChange={(v) =>
                                updateCustom(
                                  f.field_key,
                                  v === "true"
                                )
                              }
                            />
                          );

                        case "number":
                          return (
                            <Input
                              key={f.id}
                              type="number"
                              label={f.label}
                              required={f.required}
                              value={String(value ?? "")}
                              onChange={(v) =>
                                updateCustom(
                                  f.field_key,
                                  Number(v)
                                )
                              }
                            />
                          );

                        case "date":
                          return (
                            <Input
                              key={f.id}
                              type="date"
                              label={f.label}
                              required={f.required}
                              value={String(value ?? "")}
                              onChange={(v) =>
                                updateCustom(f.field_key, v)
                              }
                            />
                          );

                        default:
                          return (
                            <Input
                              key={f.id}
                              label={f.label}
                              required={f.required}
                              value={String(value ?? "")}
                              onChange={(v) =>
                                updateCustom(f.field_key, v)
                              }
                            />
                          );
                      }
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* =======================
           Actions
           ======================= */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-(--bg-app) text-sm"
          >
            {t("common.cancel")}
          </button>

          <button
            type="button"
            disabled={saving || !form.product_id}
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-(--color-primary) text-white text-sm disabled:opacity-60"
          >
            {saving ? t("common.saving") : t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =======================
   Reusable Inputs
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
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg bg-(--bg-app)
          focus:ring-2 focus:ring-(--color-primary)/30"
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
  loading = false,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
  required?: boolean;
  loading?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-(--text-secondary) mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>

      <select
        value={value}
        required={required}
        disabled={loading}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg bg-(--bg-app)"
      >
        <option value="">
          {loading ? "..." : `— ${label} —`}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
