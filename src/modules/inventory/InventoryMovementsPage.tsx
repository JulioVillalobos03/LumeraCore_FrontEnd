import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Spinner from "../../components/common/Spinner";
import { resolveErrorKey } from "../../utils/handleError";
import { listInventoryMovements } from "../../api/inventory.api";
import type { InventoryMovement } from "./types";
import InventoryMovementsTable from "./components/InventoryMovementsTable";

export default function InventoryMovementsPage() {
  const { t } = useTranslation();

  const [rows, setRows] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setRows(await listInventoryMovements());
    } catch (e) {
      setError(t(resolveErrorKey(e)));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-heading">
          {t("inventory.movements.title")}
        </h1>
        <p className="text-sm text-(--text-secondary)">
          {t("inventory.movements.subtitle")}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border px-4 py-3 text-sm border-red-500/30 bg-red-500/5">
          {error}
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <InventoryMovementsTable rows={rows} />
      )}
    </div>
  );
}
