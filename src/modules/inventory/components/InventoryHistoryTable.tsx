import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../../components/common/Spinner";
import type { InventoryMovement } from "../types";
import { getInventoryHistory } from "../../../api/inventory.api";


export default function InventoryHistoryTable({
  productId,
}: {
  productId: string;
}) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setRows(await getInventoryHistory(productId));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [productId]);

  if (loading) return <Spinner />;

  return (
    <div className="rounded-xl border bg-(--bg-surface)">
      <div className="p-4 border-b">
        <h3 className="text-sm font-medium">
          {t("inventory.movements.title")}
        </h3>
      </div>

      <table className="w-full text-sm">
        <thead className="text-left text-(--text-secondary)">
          <tr className="border-b">
            <th className="p-3">{t("inventory.movements.columns.type")}</th>
            <th className="p-3">{t("inventory.movements.columns.quantity")}</th>
            <th className="p-3">{t("inventory.movements.columns.date")}</th>
            <th className="p-3">{t("inventory.movements.columns.notes")}</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((m) => (
            <tr key={m.id} className="border-b last:border-0">
              <td className="p-3">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                    ${m.movement_type === "in"
                      ? "bg-green-500/10 text-green-700"
                      : "bg-red-500/10 text-red-700"
                    }`}
                >
                  {t(`inventory.adjust.${m.movement_type}`)}
                </span>
              </td>
              <td className="p-3 font-medium">{m.quantity}</td>
              <td className="p-3 text-xs text-(--text-secondary)">
                {new Date(m.created_at).toLocaleString()}
              </td>
              <td className="p-3 text-(--text-secondary)">
                {m.notes ?? "—"}
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="p-4 text-sm text-(--text-secondary)">
          {t("inventory.movements.empty")}
        </div>
      )}
    </div>
  );
}
