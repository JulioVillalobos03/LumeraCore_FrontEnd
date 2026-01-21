import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/common/Spinner";
import type { Role } from "../type";
import { getRolePermissions } from "../../../api/roles.api";
import type { Permission } from "../../permissions/type";

interface Props {
  role: Role | null;
}

export default function RolePermissionsPanel({ role }: Props) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!role) return;

    const load = async () => {
      setLoading(true);
      try {
        setRows(await getRolePermissions(role.id));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [role]);

  if (!role) {
    return (
      <div className="rounded-xl border bg-(--bg-surface) p-6 text-sm text-(--text-secondary)">
        {t("roles.selectRole")}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-(--bg-surface) p-6 space-y-4">
      <h2 className="text-lg font-semibold">
        {t("roles.permissionsFor")}{" "}
        <span className="font-bold">{role.name}</span>
      </h2>

      {loading ? (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      ) : rows.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {rows.map((p) => (
            <div
              key={p.id}
              className="rounded-lg bg-(--bg-app) px-4 py-2 text-sm"
            >
              {p.permission_key}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-(--text-secondary)">
          {t("roles.noPermissions")}
        </p>
      )}
    </div>
  );
}
