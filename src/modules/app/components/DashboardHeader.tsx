import { useAuth } from "../../../auth/useAuth";
import { useTranslation } from "react-i18next";

export default function DashboardHeader() {
  const { user, activeCompany } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-heading">
        {t("dashboard.welcome")},{" "}
        <span className="font-semibold">{user?.name}</span>
      </h1>

      <p className="text-sm text-(--text-secondary)">
        {t("dashboard.subtitle", {
          company: activeCompany?.company_name ?? "—",
        })}
      </p>
    </div>
  );
}
