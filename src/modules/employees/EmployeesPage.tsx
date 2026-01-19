import { useEffect, useMemo, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/common/Spinner";


export default function EmployeesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
      const data = await listEmployees();
      setRows(data);
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
    setError(null);
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

    setError(null);
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
    const full = await getEmployee(emp.id); // 👈 trae custom_fields
    setSelected(full);
    setEditOpen(true);
  } catch (e) {
    setError(t(resolveErrorKey(e)));
  }
};

  const toggleStatus = async (emp: Employee) => {
    const next: EmployeeStatus =
      emp.status === "active" ? "inactive" : "active";

    // optimistic UI
    setRows((prev) =>
      prev.map((r) => (r.id === emp.id ? { ...r, status: next } : r))
    );

    try {
      await changeEmployeeStatus(emp.id, { status: next });
    } catch (e) {
      // rollback
      setRows((prev) =>
        prev.map((r) => (r.id === emp.id ? { ...r, status: emp.status } : r))
      );
      setError(t(resolveErrorKey(e)));
    }
  };

  const table = useMemo(() => {
    if (loading) {
      return <Spinner />;
    }

    return (
      <div className="overflow-auto rounded-xl border bg-(--bg-surface)">
        <table className="w-full text-sm">
          <thead className="text-left text-(--text-secondary)">
            <tr className="border-b">
              <th className="p-4">{t("employees.columns.name")}</th>
              <th className="p-4">{t("employees.columns.email")}</th>
              <th className="p-4">{t("employees.columns.position")}</th>
              <th className="p-4">{t("employees.columns.department")}</th>
              <th className="p-4">{t("employees.columns.status")}</th>
              <th className="p-4 text-right">{t("employees.columns.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((e) => (
              <tr
                key={e.id}
                className="border-b last:border-b-0 hover:bg-(--bg-app)/50"
              >
                <td className="p-4 font-medium">
  <button
    onClick={() => navigate(`/app/employees/${e.id}`)}
    className="hover:underline text-left"
  >
    {e.first_name} {e.last_name}
  </button>
</td>


                <td className="p-4">{e.email ?? "-"}</td>
                <td className="p-4">{e.position ?? "-"}</td>
                <td className="p-4">{e.department ?? "-"}</td>

                {/* Status badge */}
                <td className="p-4">
                  <span
                    className={`
                      inline-flex items-center gap-2
                      rounded-full px-2.5 py-1 text-xs font-medium
                      ${
                        e.status === "active"
                          ? "bg-green-500/10 text-green-700"
                          : "bg-gray-500/10 text-gray-700"
                      }
                    `}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        e.status === "active" ? "bg-green-600" : "bg-gray-500"
                      }`}
                    />
                    {t(`employees.status.${e.status}`)}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-4 text-right">
                  <div className="inline-flex items-center gap-3">
                    {/* Edit (corporativo) */}
                    <button
                      onClick={() => openEdit(e)}
                      className="
                        text-sm font-medium
                        text-(--text-secondary)
                        hover:text-(--text-primary)
                        transition
                      "
                    >
                      {t("employees.actions.edit")}
                    </button>

                    {/* Toggle status */}
                    <button
                      onClick={() => void toggleStatus(e)}
                      className={`
                        relative inline-flex h-6 w-11 items-center
                        rounded-full transition-colors duration-200
                        ${e.status === "active" ? "bg-green-500" : "bg-gray-300"}
                      `}
                      aria-label="Toggle employee status"
                    >
                      <span
                        className={`
                          inline-block h-4 w-4 transform rounded-full bg-white
                          transition-transform duration-200
                          ${e.status === "active" ? "translate-x-6" : "translate-x-1"}
                        `}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="p-6 text-sm text-(--text-secondary)">
            {t("employees.empty")}
          </div>
        )}
      </div>
    );
  }, [loading, rows, t]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-heading">{t("employees.title")}</h1>
          <p className="text-sm text-(--text-secondary)">{t("employees.subtitle")}</p>
        </div>

        <button
          className="
            bg-(--color-primary) text-white
            px-4 py-2 rounded-lg text-sm
            hover:opacity-90 transition
          "
          onClick={() => setCreateOpen(true)}
        >
          {t("employees.create")}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="
            rounded-lg border px-4 py-3 text-sm
            border-(--color-primary)/30
            bg-(--color-primary)/5
          "
        >
          {error}
        </div>
      )}

      {/* Table */}
      {table}

      {/* Create modal */}
      <EmployeeFormModal
        open={createOpen}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSubmit={onCreate}
      />

      {/* Edit modal */}
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
