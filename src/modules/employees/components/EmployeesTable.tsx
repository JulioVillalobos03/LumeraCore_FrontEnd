import { useTranslation } from "react-i18next";
import { FiEye, FiEdit2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { Employee } from "../types";

interface Props {
  rows: Employee[];
  onEdit: (e: Employee) => void;
  onToggleStatus: (e: Employee) => void;
}

export default function EmployeesTable({
  rows,
  onEdit,
  onToggleStatus,
}: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();

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
            <th className="p-4 text-right">{t("common.actions")}</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((e) => (
            <tr
              key={e.id}
              className="border-b last:border-b-0 hover:bg-(--bg-app)/40 transition"
            >
              {/* NAME */}
              <td className="p-4 font-medium">
                {e.first_name} {e.last_name}
              </td>

              {/* EMAIL */}
              <td className="p-4">{e.email ?? "-"}</td>

              {/* POSITION */}
              <td className="p-4">{e.position ?? "-"}</td>

              {/* DEPARTMENT */}
              <td className="p-4">{e.department ?? "-"}</td>

              {/* STATUS */}
              <td className="p-4">
                <button
                  onClick={() => onToggleStatus(e)}
                  title={t("employees.toggleStatus")}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors duration-200
                    ${e.status === "active" ? "bg-green-500" : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white
                      transition-transform duration-200
                      ${e.status === "active"
                        ? "translate-x-6"
                        : "translate-x-1"}
                    `}
                  />
                </button>
              </td>

              {/* ACTIONS */}
              <td className="p-4 text-right">
                <div className="inline-flex items-center gap-2">
                  {/* VIEW */}
                  <button
                    onClick={() => navigate(`/app/employees/${e.id}`)}
                    title={t("common.view")}
                    className="
                      inline-flex items-center justify-center
                      rounded-lg p-2
                      text-(--text-secondary)
                      hover:bg-(--bg-app)
                      hover:text-(--text-primary)
                      transition
                    "
                  >
                    <FiEye size={16} />
                  </button>

                  {/* EDIT */}
                  <button
                    onClick={() => onEdit(e)}
                    title={t("common.edit")}
                    className="
                      inline-flex items-center justify-center
                      rounded-lg p-2
                      text-(--text-secondary)
                      hover:bg-(--bg-app)
                      hover:text-(--text-primary)
                      transition
                    "
                  >
                    <FiEdit2 size={16} />
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
}
