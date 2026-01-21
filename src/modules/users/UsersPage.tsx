import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner";
import UsersTable from "./components/UsersTable";
import UserFormModal from "./UserFormModal";
import UserEditModal from "./UserEditModal";
import type { CompanyUser } from "./types";
import { changeUserStatus, listUsers } from "../../api/users.api";

export default function UsersPage() {
  const { t } = useTranslation();

  const [rows, setRows] = useState<CompanyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [editUser, setEditUser] = useState<CompanyUser | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setRows(await listUsers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const toggleStatus = async (u: CompanyUser) => {
    const next = u.status === "active" ? "inactive" : "active";

    setRows((prev) =>
      prev.map((r) =>
        r.company_user_id === u.company_user_id
          ? { ...r, status: next }
          : r
      )
    );

    try {
      await changeUserStatus(u.company_user_id, next);
    } catch {
      await load();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading">
          {t("users.title")}
        </h1>

        <button
          onClick={() => setOpenCreate(true)}
          className="bg-(--color-primary) text-white px-4 py-2 rounded-lg text-sm"
        >
          {t("users.create")}
        </button>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <UsersTable
          rows={rows}
          onToggleStatus={toggleStatus}
          onEdit={(u) => setEditUser(u)}
        />
      )}

      {/* Crear */}
      <UserFormModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSaved={load}
      />

      {/* Editar */}
      <UserEditModal
        open={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
        onSaved={load}
      />
    </div>
  );
}
