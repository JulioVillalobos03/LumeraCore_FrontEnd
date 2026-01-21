import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner";
import { updateUser } from "../../api/users.api";
import type { CompanyUser } from "./types";

interface Props {
  open: boolean;
  user: CompanyUser | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function UserEditModal({
  open,
  user,
  onClose,
  onSaved,
}: Props) {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (!open || !user) return null;

  const submit = async () => {
    setLoading(true);
    try {
      await updateUser(user.user_id, { name, email });
      onSaved();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-(--bg-surface) p-6 space-y-5">
        <h2 className="text-lg font-semibold">
          {t("users.editTitle")}
        </h2>

        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-(--text-secondary)">
                  {t("users.columns.name")}
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-(--bg-app) px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-(--text-secondary)">
                  {t("users.columns.email")}
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border bg-(--bg-app) px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-(--bg-app) text-sm"
              >
                {t("common.cancel")}
              </button>

              <button
                onClick={submit}
                className="px-4 py-2 rounded-lg bg-(--color-primary) text-white text-sm"
              >
                {t("common.save")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
