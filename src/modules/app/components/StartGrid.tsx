import { Users, Briefcase, Package, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatCard from "./StatCard";

export default function StatsGrid() {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        label={t("dashboard.stats.employees")}
        value="12"
        icon={<Users size={20} />}
        accent="blue"
      />

      <StatCard
        label={t("dashboard.stats.clients")}
        value="34"
        icon={<UserCheck size={20} />}
        accent="green"
      />

      <StatCard
        label={t("dashboard.stats.products")}
        value="18"
        icon={<Package size={20} />}
        accent="primary"
      />

      <StatCard
        label={t("dashboard.stats.activeUsers")}
        value="5"
        icon={<Briefcase size={20} />}
        accent="gray"
      />
    </div>
  );
}
