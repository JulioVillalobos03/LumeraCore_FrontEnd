import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner";
import type { CreateUserInput } from "./types";
import { createUser } from "../../api/users.api";
import { listRoles } from "../../api/roles.api";
import type { Role } from "../roles/type";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

export default function UserFormModal({ open, onClose, onSaved }: Props) {
  const { t } = useTranslation();

  const defaultForm: CreateUserInput = useMemo(
    () => ({
      name: "",
      email: "",
      password: "",
      roleId: "",
    }),
    []
  );

  const [form, setForm] = useState<CreateUserInput>(defaultForm);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ======================
     Load roles
     ====================== */
  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoadingRoles(true);
      try {
        const data = await listRoles();
        setRoles(data);
      } finally {
        setLoadingRoles(false);
      }
    };

    setForm(defaultForm);
    void load();
  }, [open, defaultForm]);

  if (!open) return null;

  const update = <K extends keyof CreateUserInput>(
    key: K,
    value: CreateUserInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await createUser(form);
      await onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-lg bg-(--bg-surface) rounded-xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-6">
          {t("users.create")}
        </h2>

        <form onSubmit={submit} className="space-y-4">
          <Input
            label={t("users.form.name")}
            value={form.name}
            onChange={(v) => update("name", v)}
            required
          />

          <Input
            label={t("users.form.email")}
            type="email"
            value={form.email}
            onChange={(v) => update("email", v)}
            required
          />

          <Input
            label={t("users.form.password")}
            type="password"
            value={form.password}
            onChange={(v) => update("password", v)}
            required
          />

          {/* Role */}
          <label className="block">
            <span className="block text-xs text-(--text-secondary) mb-1">
              {t("users.form.role")}
            </span>

            {loadingRoles ? (
              <div className="flex justify-center py-2">
                <Spinner />
              </div>
            ) : (
              <select
                value={form.roleId}
                onChange={(e) => update("roleId", e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-(--bg-app)"
              >
                <option value="">
                  — {t("users.actions.assignRole")} —
                </option>

                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            )}
          </label>

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
              className="px-4 py-2 rounded-lg bg-(--color-primary) text-white disabled:opacity-60"
            >
              {saving ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ======================
   Input
   ====================== */
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
        className="w-full px-4 py-2.5 rounded-lg bg-(--bg-app)"
      />
    </label>
  );
}
