import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function QuickActions() {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border bg-(--bg-surface) p-5 space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-(--text-secondary)">
        {t("dashboard.quickActions")}
      </h3>

      <div className="flex flex-wrap gap-3">
        <Action to="/app/employees" label={t("dashboard.actions.employees")} />
        <Action to="/app/clients" label={t("dashboard.actions.clients")} />
        <Action to="/app/products" label={t("dashboard.actions.products")} />
        <Action to="/app/users" label={t("dashboard.actions.users")} />
      </div>
    </div>
  );
}

function Action({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="
        rounded-lg border px-4 py-2 text-sm
        hover:bg-(--bg-app)
        transition
      "
    >
      {label}
    </Link>
  );
}
