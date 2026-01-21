import { useTranslation } from "react-i18next";
import { FiEdit2 } from "react-icons/fi";
import type { CompanyUser } from "../types";

interface Props {
  rows: CompanyUser[];
  onToggleStatus: (u: CompanyUser) => void;
  onEdit?: (u: CompanyUser) => void; // ✅ AGREGADO (opcional)
}

export default function UsersTable({
  rows,
  onToggleStatus,
  onEdit,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="overflow-auto rounded-xl border bg-(--bg-surface)">
      <table className="w-full text-sm">
        <thead className="text-left text-(--text-secondary)">
          <tr className="border-b">
            <th className="p-4">{t("users.columns.name")}</th>
            <th className="p-4">{t("users.columns.email")}</th>
            <th className="p-4">{t("users.columns.role")}</th>
            <th className="p-4">{t("users.columns.status")}</th>
            <th className="p-4 text-right">
              {t("users.columns.actions")}
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((u) => (
            <tr
              key={u.company_user_id}
              className="border-b last:border-b-0 hover:bg-(--bg-app)/40 transition"
            >
              {/* NAME */}
              <td className="p-4 font-medium">{u.name}</td>

              {/* EMAIL */}
              <td className="p-4">{u.email}</td>

              {/* ROLE */}
              <td className="p-4">
                <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs
                  bg-(--bg-app) text-(--text-secondary)">
                  {u.role_name ?? t("users.noRole")}
                </span>
              </td>

              {/* STATUS */}
              <td className="p-4">
                <button
                  onClick={() => onToggleStatus(u)}
                  title={t("users.toggleStatus")}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors duration-200
                    ${u.status === "active"
                      ? "bg-green-500"
                      : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white
                      transition-transform duration-200
                      ${u.status === "active"
                        ? "translate-x-6"
                        : "translate-x-1"}
                    `}
                  />
                </button>
              </td>

              {/* ACTIONS */}
              <td className="p-4 text-right">
                {onEdit && (
                  <button
                    onClick={() => onEdit(u)}
                    className="
                      inline-flex items-center justify-center
                      rounded-lg p-2
                      text-(--text-secondary)
                      hover:bg-(--bg-app)
                      hover:text-(--text-primary)
                      transition
                    "
                    title={t("common.edit")}
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="p-6 text-sm text-(--text-secondary)">
          {t("users.empty")}
        </div>
      )}
    </div>
  );
}
