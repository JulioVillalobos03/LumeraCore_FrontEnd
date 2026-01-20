import { useTranslation } from "react-i18next";
import type { InventoryMovement } from "../types";

interface Props {
  rows: InventoryMovement[];
}

export default function InventoryMovementsTable({ rows }: Props) {
  const { t } = useTranslation();

  return (
    <div className="overflow-auto rounded-xl border bg-(--bg-surface)">
      <table className="w-full text-sm">
        <thead className="text-left text-(--text-secondary)">
          <tr className="border-b">
            <th className="p-4">{t("inventory.movements.columns.date")}</th>
            <th className="p-4">{t("inventory.movements.columns.product")}</th>
            <th className="p-4">{t("inventory.movements.columns.type")}</th>
            <th className="p-4">{t("inventory.movements.columns.quantity")}</th>
            <th className="p-4">{t("inventory.movements.columns.user")}</th>
            <th className="p-4">{t("inventory.movements.columns.notes")}</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((m) => (
            <tr
              key={m.id}
              className="border-b last:border-b-0 hover:bg-(--bg-app)/50"
            >
              <td className="p-4 text-xs">
                {new Date(m.created_at).toLocaleString()}
              </td>

              <td className="p-4 font-medium">
                {m.product_name}
              </td>

              <td className="p-4">
                <span
                  className={`
                    inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium
                    ${
                      m.movement_type === "in"
                        ? "bg-green-500/10 text-green-700"
                        : "bg-red-500/10 text-red-700"
                    }
                  `}
                >
                  {t(`inventory.movements.types.${m.movement_type}`)}
                </span>
              </td>

              <td className="p-4 font-medium">
                {m.quantity}
              </td>

              <td className="p-4">
                {m.created_by_name ?? "-"}
              </td>

              <td className="p-4 text-xs text-(--text-secondary)">
                {m.notes ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="p-6 text-sm text-(--text-secondary)">
          {t("inventory.movements.empty")}
        </div>
      )}
    </div>
  );
}
