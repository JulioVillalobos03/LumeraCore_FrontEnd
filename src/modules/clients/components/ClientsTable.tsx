import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEdit2 } from "react-icons/fi";
import type { Client } from "../types";

interface Props {
  rows: Client[];
  onEdit: (c: Client) => void;
  onToggleStatus: (c: Client) => void;
}

export default function ClientsTable({
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
            <th className="p-4">{t("clients.columns.name")}</th>
            <th className="p-4">{t("clients.columns.email")}</th>
            <th className="p-4">{t("clients.columns.phone")}</th>
            <th className="p-4">{t("clients.columns.status")}</th>
            <th className="p-4 text-right">{t("common.actions")}</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((c) => (
            <tr
              key={c.id}
              className="border-b last:border-b-0 hover:bg-(--bg-app)/40 transition"
            >
              <td className="p-4 font-medium">{c.name}</td>
              <td className="p-4">{c.email ?? "-"}</td>
              <td className="p-4">{c.phone ?? "-"}</td>

              {/* STATUS */}
              <td className="p-4">
                <button
                  onClick={() => onToggleStatus(c)}
                  title={t("clients.toggleStatus")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors duration-200
                    ${c.status === "active" ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white
                      transition-transform duration-200
                      ${c.status === "active" ? "translate-x-6" : "translate-x-1"}`}
                  />
                </button>
              </td>

              {/* ACTIONS */}
              <td className="p-4 text-right">
                <div className="inline-flex items-center gap-2">
                  {/* VIEW */}
                  <button
                    onClick={() => navigate(`/app/clients/${c.id}`)}
                    className="
                      inline-flex items-center justify-center
                      rounded-lg p-2
                      text-(--text-secondary)
                      hover:bg-(--bg-app)
                      hover:text-(--text-primary)
                      transition
                    "
                    title={t("common.view")}
                  >
                    <FiEye size={16} />
                  </button>

                  {/* EDIT */}
                  <button
                    onClick={() => onEdit(c)}
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="p-6 text-sm text-(--text-secondary)">
          {t("clients.empty")}
        </div>
      )}
    </div>
  );
}
