import { useState } from "react";
import { useTranslation } from "react-i18next";
import { createRole } from "../../api/roles.api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

export default function RoleFormModal({ open, onClose, onSaved }: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      await createRole({ name });
      await onSaved();
      setName("");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-(--bg-surface) p-6 space-y-5">
        <h2 className="text-lg font-semibold">
          {t("roles.create")}
        </h2>

        <div>
          <label className="text-xs text-(--text-secondary)">
            {t("roles.columns.name")}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm bg-(--bg-app)"
          />
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-(--bg-app)"
          >
            {t("common.cancel")}
          </button>

          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-(--color-primary) text-white"
          >
            {t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
