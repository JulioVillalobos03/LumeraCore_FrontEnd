import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner";
import { listPermissions } from "../../api/permissions.api";
import PermissionsTable from "./components/PermissionsTable";
import type { Permission } from "./type";
import CreatePermissionModal from "./components/CreatePermissionModal";
import AssignPermissionModal from "./components/AssigPermissionModal";

export default function PermissionsPage() {
  const { t } = useTranslation();

  const [rows, setRows] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<Permission | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setRows(await listPermissions());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-heading">{t("permissions.title")}</h1>
          <p className="text-sm text-(--text-secondary)">
            {t("permissions.subtitle")}
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="
            bg-(--color-primary) text-white
            px-4 py-2 rounded-lg text-sm
            hover:opacity-90 transition
          "
        >
          {t("permissions.create")}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <Spinner />
      ) : (
        <PermissionsTable rows={rows} onAssign={(p) => setSelected(p)} />
      )}

      {/* Create */}
      <CreatePermissionModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={load}
      />

      {/* Assign */}
      <AssignPermissionModal
        open={!!selected}
        permission={selected}
        onClose={() => setSelected(null)}
        onSaved={load}
      />
    </div>
  );
}
