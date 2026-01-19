import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner";
import {
  createCustomField,
  type CreateCustomFieldPayload,
} from "../../api/customFields.api";
import type { CustomFieldEntity } from "../../types/entities";

type FieldType = CreateCustomFieldPayload["field_type"];

interface Props {
  open: boolean;
  entity: CustomFieldEntity;
  onClose: () => void;
  onCreated: () => Promise<void> | void; // recarga tabla
}

export default function CreateCustomFieldModal({
  open,
  entity,
  onClose,
  onCreated,
}: Props) {
  const { t } = useTranslation();

  const defaultState = useMemo(
    () => ({
      label: "",
      field_key: "",
      field_type: "text" as FieldType,
      required: false,
      // para select:
      optionText: "", // input temporal
      options: [] as { label: string; value: string }[],
    }),
    []
  );

  const [form, setForm] = useState(defaultState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(defaultState);
    setError(null);
    setSaving(false);
  }, [open, defaultState]);

  if (!open) return null;

  // slug para field_key (simple y seguro)
  const slugifyKey = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/ñ/g, "n")
      .replace(/[áàä]/g, "a")
      .replace(/[éèë]/g, "e")
      .replace(/[íìï]/g, "i")
      .replace(/[óòö]/g, "o")
      .replace(/[úùü]/g, "u")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [key]: value }));

  const addOption = () => {
    const text = form.optionText.trim();
    if (!text) return;

    const value = slugifyKey(text) || text.toLowerCase().replace(/\s+/g, "_");

    // evitar duplicados por value
    if (form.options.some((o) => o.value === value)) {
      setError(t("customFields.errors.optionDuplicate"));
      return;
    }

    setError(null);
    setForm((p) => ({
      ...p,
      options: [...p.options, { label: text, value }],
      optionText: "",
    }));
  };

  const removeOption = (value: string) => {
    setForm((p) => ({
      ...p,
      options: p.options.filter((o) => o.value !== value),
    }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const label = form.label.trim();
    const field_key = form.field_key.trim();

    if (!label) {
      setError(t("customFields.errors.labelRequired"));
      return;
    }

    if (!field_key) {
      setError(t("customFields.errors.keyRequired"));
      return;
    }

    if (form.field_type === "select" && form.options.length === 0) {
      setError(t("customFields.errors.selectNeedsOptions"));
      return;
    }

    const payload: CreateCustomFieldPayload = {
      entity,
      label,
      field_key: slugifyKey(field_key), // asegura formato tipo "contract_type"
      field_type: form.field_type,
      required: form.required,
      options: form.field_type === "select" ? form.options : null,
    };

    setSaving(true);
    try {
      await createCustomField(payload);
      await onCreated();
      onClose();
    } catch (err: unknown) {
      // aquí podrías mapear message codes si tu backend ya los manda como "CUSTOM_FIELDS_INVALID_INPUT" etc
      setError(t("customFields.errors.createFailed"));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const autoKeyFromLabel = () => {
    if (form.field_key.trim().length > 0) return; // no pisar si ya escribió
    set("field_key", slugifyKey(form.label));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-2xl rounded-xl bg-(--bg-surface) p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              {t("customFields.createTitle")}
            </h2>
            <p className="text-sm text-(--text-secondary)">
              {t("customFields.entity")}: <span className="font-medium">{entity}</span>
            </p>
          </div>

          
        </div>

        {error && (
          <div className="mt-4 rounded-lg border px-4 py-3 text-sm border-(--color-primary)/30 bg-(--color-primary)/5">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("customFields.form.label")}
              value={form.label}
              onChange={(v) => {
                set("label", v);
              }}
              onBlur={autoKeyFromLabel}
              required
            />

            <Input
              label={t("customFields.form.key")}
              value={form.field_key}
              onChange={(v) => set("field_key", v)}
              hint={t("customFields.form.keyHint")}
              required
            />

            <Select
              label={t("customFields.form.type")}
              value={form.field_type}
              onChange={(v) => set("field_type", v as FieldType)}
              options={[
                { label: t("customFields.types.text"), value: "text" },
                { label: t("customFields.types.number"), value: "number" },
                { label: t("customFields.types.date"), value: "date" },
                { label: t("customFields.types.boolean"), value: "boolean" },
                { label: t("customFields.types.select"), value: "select" },
              ]}
            />

            <div className="flex items-center gap-3 pt-6">
              <input
                id="required"
                type="checkbox"
                checked={form.required}
                onChange={(e) => set("required", e.target.checked)}
                className="h-4 w-4 accent-(--color-primary)"
              />
              <label htmlFor="required" className="text-sm">
                {t("customFields.form.required")}
              </label>
            </div>
          </div>

          {/* SELECT OPTIONS */}
          {form.field_type === "select" && (
            <div className="rounded-xl border bg-(--bg-app) p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">
                    {t("customFields.form.options")}
                  </p>
                  <p className="text-xs text-(--text-secondary)">
                    {t("customFields.form.optionsHint")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={form.optionText}
                  onChange={(e) => set("optionText", e.target.value)}
                  placeholder={t("customFields.form.optionPlaceholder")}
                  className="
                    flex-1 px-4 py-2.5 rounded-lg
                    bg-(--bg-surface)
                    border border-transparent
                    transition-all duration-200 ease-out
                    focus:outline-none
                    focus:border-(--color-primary)
                    focus:ring-2 focus:ring-(--color-primary)/30
                    focus:shadow-[0_0_0_4px_rgba(193,18,31,0.12)]
                    focus:scale-[1.01]
                  "
                />

                <button
                  type="button"
                  onClick={addOption}
                  className="px-4 py-2.5 rounded-lg bg-(--color-primary) text-white text-sm hover:opacity-90 transition"
                >
                  {t("customFields.form.addOption")}
                </button>
              </div>

              {form.options.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.options.map((o) => (
                    <span
                      key={o.value}
                      className="inline-flex items-center gap-2 rounded-full bg-white/60 border px-3 py-1 text-xs"
                    >
                      <span className="font-medium">{o.label}</span>
                      <span className="text-(--text-secondary)">({o.value})</span>
                      <button
                        type="button"
                        onClick={() => removeOption(o.value)}
                        className="ml-1 rounded-full px-2 py-0.5 hover:bg-black/5 transition"
                        aria-label="remove option"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-(--text-secondary)">
                  {t("customFields.form.noOptions")}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-(--bg-app) hover:bg-(--bg-app)/80 transition text-sm"
              disabled={saving}
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-(--color-primary) text-white hover:opacity-90 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Spinner />
                  {t("customFields.form.saving")}
                </>
              ) : (
                t("customFields.form.save")
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- UI helpers ---------- */

function Input({
  label,
  value,
  onChange,
  required = false,
  hint,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hint?: string;
  onBlur?: () => void;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-(--text-secondary) mb-1">
        {label} {required ? "*" : ""}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        className="
          w-full px-4 py-2.5 rounded-lg
          bg-(--bg-app)
          border border-transparent
          transition-all duration-200 ease-out
          focus:outline-none
          focus:border-(--color-primary)
          focus:ring-2 focus:ring-(--color-primary)/30
          focus:shadow-[0_0_0_4px_rgba(193,18,31,0.12)]
          focus:scale-[1.01]
        "
      />
      {hint && <span className="mt-1 block text-[11px] text-(--text-secondary)">{hint}</span>}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-xs text-(--text-secondary) mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-4 py-2.5 rounded-lg
          bg-(--bg-app)
          border border-transparent
          transition-all duration-200 ease-out
          focus:outline-none
          focus:border-(--color-primary)
          focus:ring-2 focus:ring-(--color-primary)/30
          focus:shadow-[0_0_0_4px_rgba(193,18,31,0.12)]
        "
      >
        {options.map((o) => (
          <option value={o.value} key={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
