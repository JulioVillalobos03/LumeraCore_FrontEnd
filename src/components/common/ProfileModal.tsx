import { useAuth } from "../../auth/useAuth";
import { useTranslation } from "react-i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function ProfileModal({ open, onClose }: Props) {
    const { t } = useTranslation();
  const { user, activeCompany } = useAuth();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Modal */}
      <div
        className="
          relative z-10 w-full max-w-md
          bg-(--bg-surface)
          rounded-xl shadow-lg
          p-6
        "
      >
        <h2 className="text-lg font-semibold mb-4">
          {t("profile.title")}
        </h2>

        <div className="space-y-3 text-sm">
          <div>
            <p className="text-(--text-secondary)">{t("profile.name")}</p>
            <p className="font-medium">{user?.name}</p>
          </div>

          <div>
            <p className="text-(--text-secondary)">{t("profile.email")}</p>
            <p className="font-medium">{user?.email}</p>
          </div>

          {activeCompany && (
            <div>
              <p className="text-(--text-secondary)">{t("profile.company")}</p>
              <p className="font-medium">
                {activeCompany.company_name}
              </p>
            </div>
          )}

          {activeCompany && (
            <div>
              <p className="text-(--text-secondary)">{t("profile.role")}</p>
              <p className="font-medium">
                {activeCompany.role_name}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg
              bg-(--bg-app)
              hover:bg-(--bg-app)/80
              transition
              text-sm
            "
          >
            {t("profile.close")}
          </button>
        </div>
      </div>
    </div>
  );
}
