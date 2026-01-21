import { useTranslation } from "react-i18next";
import { FiEdit2, FiEye } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import type { Product } from "../types";

interface Props {
  rows: Product[];
  onEdit: (p: Product) => void;
  onToggleStatus: (p: Product) => void;
}

export default function ProductsTable({
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
            <th className="p-4">{t("products.columns.name")}</th>
            <th className="p-4">SKU</th>
            <th className="p-4">{t("products.columns.price")}</th>
            <th className="p-4">{t("products.columns.status")}</th>
            <th className="p-4 text-right">
              {t("products.columns.actions")}
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((p) => (
            <tr
              key={p.id}
              className="border-b last:border-b-0 hover:bg-(--bg-app)/40 transition"
            >
              {/* NAME */}
              <td className="p-4 font-medium">{p.name}</td>

              {/* SKU */}
              <td className="p-4 text-xs">{p.sku ?? "-"}</td>

              {/* PRICE */}
              <td className="p-4">${p.price}</td>

              {/* STATUS */}
              <td className="p-4">
                <button
                  onClick={() => onToggleStatus(p)}
                  title={t("products.toggleStatus")}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    transition-colors duration-200
                    ${p.status === "active"
                      ? "bg-green-500"
                      : "bg-gray-300"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white
                      transition-transform duration-200
                      ${p.status === "active"
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
                    onClick={() => navigate(`/app/products/${p.id}`)}
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
                    onClick={() => onEdit(p)}
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
          {t("products.empty")}
        </div>
      )}
    </div>
  );
}
