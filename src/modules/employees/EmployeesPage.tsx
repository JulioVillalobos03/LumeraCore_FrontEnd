import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Employee, EmployeeStatus, CreateEmployeeInput } from "./types";
import { resolveErrorKey } from "../../utils/handleError";
import {
  changeEmployeeStatus,
  createEmployee,
  getEmployee,
  listEmployees,
  updateEmployee,
} from "../../api/employees.api";
import EmployeeFormModal from "./EmployeeFormModal";
import Spinner from "../../components/common/Spinner";
import EmployeesTable from "./components/EmployeesTable";

export default function EmployeesPage() {
  const { t } = useTranslation();

  const [rows, setRows] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<Employee | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await listEmployees());
    } catch (e) {
      setError(t(resolveErrorKey(e)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onCreate = async (payload: CreateEmployeeInput) => {
    try {
      await createEmployee(payload);
      await load();
    } catch (e) {
      setError(t(resolveErrorKey(e)));
      throw e;
    }
  };

  const onEdit = async (payload: CreateEmployeeInput) => {
    if (!selected) return;
    try {
      await updateEmployee(selected.id, payload);
      await load();
    } catch (e) {
      setError(t(resolveErrorKey(e)));
      throw e;
    }
  };

  const openEdit = async (emp: Employee) => {
    try {
      const full = await getEmployee(emp.id);
      setSelected(full);
      setEditOpen(true);
    } catch (e) {
      setError(t(resolveErrorKey(e)));
    }
  };

  const toggleStatus = async (emp: Employee) => {
    const next: EmployeeStatus =
      emp.status === "active" ? "inactive" : "active";

    setRows((prev) =>
      prev.map((r) => (r.id === emp.id ? { ...r, status: next } : r))
    );

    try {
      await changeEmployeeStatus(emp.id, { status: next });
    } catch (e) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === emp.id ? { ...r, status: emp.status } : r
        )
      );
      setError(t(resolveErrorKey(e)));
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-heading">
            {t("employees.title")}
          </h1>
          <p className="text-sm text-(--text-secondary)">
            {t("employees.subtitle")}
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
          {t("employees.create")}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="
          rounded-lg border px-4 py-3 text-sm
          border-(--color-primary)/30
          bg-(--color-primary)/5
        ">
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <Spinner />
      ) : (
        <EmployeesTable
          rows={rows}
          onEdit={openEdit}
          onToggleStatus={toggleStatus}
        />
      )}

      {/* Create */}
      <EmployeeFormModal
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={onCreate}
      />

      {/* Edit */}
      <EmployeeFormModal
        open={editOpen}
        mode="edit"
        initial={selected}
        onClose={() => {
          setEditOpen(false);
          setSelected(null);
        }}
        onSubmit={onEdit}
        title={t("employees.editTitle")}
      />
    </div>
  );
}
