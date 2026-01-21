import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner";
import { listCustomFields } from "../../api/customFields.api";
import type { Client } from "./types";
import type { CustomField } from "../employees/types";

interface Props {
  open: boolean;
  initial?: Client | null;
  onClose: () => void;
  onSubmit: (data: Partial<Client>) => Promise<void>;
}

export default function ClientFormModal({
  open,
  initial,
  onClose,
  onSubmit,
}: Props) {
  const { t } = useTranslation();

  const [form, setForm] = useState<Partial<Client>>({});
  const [customDefs, setCustomDefs] = useState<CustomField[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setForm(initial ?? {});
    setLoadingFields(true);

    listCustomFields("clients")
      .then(setCustomDefs)
      .finally(() => setLoadingFields(false));
  }, [open, initial]);

  if (!open) return null;

  const update = (key: keyof Client, value: unknown) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const updateCustom = (key: string, value: unknown) => {
    setForm((p) => ({
      ...p,
      custom_fields: {
        ...(p.custom_fields ?? {}),
        [key]: value,
      },
    }));
  };

  const submit = async () => {
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-xl bg-(--bg-surface) rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">
          {initial ? t("clients.edit") : t("clients.create")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label={t("clients.columns.name")} value={form.name ?? ""} onChange={(v) => update("name", v)} />
          <Input label={t("clients.columns.email")} value={form.email ?? ""} onChange={(v) => update("email", v)} />
          <Input label={t("clients.columns.phone")} value={form.phone ?? ""} onChange={(v) => update("phone", v)} />
          <Input label={t("clients.columns.tax_id")} value={form.tax_id ?? ""} onChange={(v) => update("tax_id", v)} />
        </div>

        <Input
          label={t("clients.columns.address")}
          value={form.address ?? ""}
          onChange={(v) => update("address", v)}
        />

        {/* Custom fields */}
        {loadingFields && <Spinner />}

        {!loadingFields && customDefs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customDefs.map((f) => (
              <Input
                key={f.id}
                label={f.label}
                value={String(form.custom_fields?.[f.field_key] ?? "")}
                onChange={(v) => updateCustom(f.field_key, v)}
              />
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-(--bg-app)">
            {t("common.cancel")}
          </button>
          <button
            onClick={submit}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-(--color-primary) text-white"
          >
            {t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Reusable Input */
function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs text-(--text-secondary)">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg bg-(--bg-app) px-3 py-2"
      />
    </label>
  );
}
