import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createPermission } from "../../../api/permissions.api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

export default function CreatePermissionModal({
  open,
  onClose,
  onSaved,
}: Props) {
  const { t } = useTranslation();

  const defaultKey = useMemo(() => "", []);
  const [key, setKey] = useState(defaultKey);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ reset al abrir/cerrar para que no se queden datos
  useEffect(() => {
    if (!open) return;
    setKey(defaultKey);
    setError(null);
    setSaving(false);
  }, [open, defaultKey]);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!key.trim()) return;

    setSaving(true);
    setError(null);

    try {
      await createPermission(key.trim());
      await onSaved();
      onClose();
    } catch (e) {
      // si quieres mapear errores con resolveErrorKey lo metes aquí
      setError(t("permissions.errors.createFailed" + e));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-(--bg-surface) p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">
            {t("permissions.createTitle")}
          </h2>
          <p className="text-sm text-(--text-secondary)">
            {t("permissions.createSubtitle")}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="block text-xs text-(--text-secondary) mb-1">
              {t("permissions.form.key")}
              <span className="text-red-500 ml-0.5">*</span>
            </span>

            <input
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder={t("permissions.form.keyPlaceholder")}
              className="
                w-full px-4 py-2.5 rounded-lg
                bg-(--bg-app)
                border border-transparent
                transition-all duration-200
                focus:outline-none
                focus:border-(--color-primary)
                focus:ring-2 focus:ring-(--color-primary)/30
              "
              required
            />
          </label>

          {error && (
            <div className="rounded-lg border px-4 py-3 text-sm border-red-500/30 bg-red-500/5">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-(--bg-app) text-sm"
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              disabled={saving || !key.trim()}
              className="
                px-4 py-2 rounded-lg text-sm text-white
                bg-(--color-primary)
                hover:opacity-90 transition
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {saving ? t("common.saving") : t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
