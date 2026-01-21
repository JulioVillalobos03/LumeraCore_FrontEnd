import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner";
import RolesTable from "./components/RolesTable";
import RolePermissionsPanel from "./components/RolePermissionsPanel";
import { listRoles } from "../../api/roles.api";
import type { Role } from "./type";
import RoleFormModal from "./RoleFormModal";

export default function RolesPage() {
  const { t } = useTranslation();

  const [rows, setRows] = useState<Role[]>([]);
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setRows(await listRoles());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-heading">
            {t("roles.title")}
          </h1>
          <p className="text-sm text-(--text-secondary)">
            {t("roles.subtitle")}
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-(--color-primary) text-white px-4 py-2 rounded-lg"
        >
          {t("roles.create")}
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RolesTable
            rows={rows}
            selectedRoleId={selected?.id ?? null}
            onSelect={setSelected}
          />

          <div className="lg:col-span-2">
            <RolePermissionsPanel role={selected} />
          </div>
        </div>
      )}

      <RoleFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSaved={load}
      />
    </div>
  );
}
