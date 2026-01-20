import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Spinner from "../../components/common/Spinner";
import { resolveErrorKey } from "../../utils/handleError";
import { getInventoryById } from "../../api/inventory.api";
import InventoryHistoryTable from "./components/InventoryHistoryTable";

interface InventoryDetail {
  id: string;
  stock: number;
  product: {
    id: string;
    name: string;
    sku: string;
    custom_fields?: Record<string, unknown>;
  };
}

export default function InventoryDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [data, setData] = useState<InventoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await getInventoryById(id);
        setData(res);
      } catch (e) {
        setError(t(resolveErrorKey(e)));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id, t]);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="rounded-lg border px-4 py-3 text-sm
        border-red-500/30 bg-red-500/5">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading">
            {data.product.name}
          </h1>
          <p className="text-sm text-(--text-secondary)">
            {t("inventory.subtitle")}
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-(--text-secondary) hover:underline"
        >
          {t("common.back")}
        </button>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl border bg-(--bg-surface) p-6">
        <Info label={t("inventory.columns.sku")} value={data.product.sku} />
        <Info
          label={t("inventory.columns.stock")}
          value={String(data.stock)}
          strong
        />
      </div>

      {/* Custom fields */}
      <div className="rounded-xl border bg-(--bg-surface) p-6">
        {data.product.custom_fields &&
        Object.keys(data.product.custom_fields).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.product.custom_fields).map(([key, value]) => (
              <div key={key}>
                <p className="text-xs text-(--text-secondary) mb-1">
                  {key.toUpperCase()}
                </p>
                <p className="text-sm font-medium">
                  {String(value ?? "-")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-(--text-secondary)">
            {t("products.customFields")} — {t("common.empty")}
          </p>
        )}
      </div>

      {/* History */}
      <InventoryHistoryTable productId={data.product.id} />
    </div>
  );
}

function Info({
  label,
  value,
  strong = false,
}: {
  label: string;
  value?: string | null;
  strong?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-(--text-secondary) mb-1">{label}</p>
      <p className={`text-sm ${strong ? "font-semibold" : "font-medium"}`}>
        {value ?? "-"}
      </p>
    </div>
  );
}
