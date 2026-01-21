import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { Client } from "./types";
import { getClient } from "../../api/clients.api";
import { resolveErrorKey } from "../../utils/handleError";
import Spinner from "../../components/common/Spinner";

export default function ClientDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ======================
     LOAD CLIENT
     ====================== */
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getClient(id);
        setClient(data);
      } catch (e) {
        setError(t(resolveErrorKey(e)));
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id, t]);

  /* ======================
     STATES
     ====================== */
  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div
        className="
          rounded-lg border px-4 py-3 text-sm
          border-(--color-primary)/30
          bg-(--color-primary)/5
        "
      >
        {error}
      </div>
    );
  }

  if (!client) return null;

  /* ======================
     RENDER
     ====================== */
  return (
    <div className="space-y-6 max-w-8xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading">
            {client.name}
          </h1>
          <p className="text-sm text-(--text-secondary)">
            {t("clients.detail.subtitle")}
          </p>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-(--text-secondary) hover:underline"
        >
          {t("common.back")}
        </button>
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl border bg-(--bg-surface) p-6">
        <Info label={t("clients.columns.email")} value={client.email} />
        <Info label={t("clients.columns.phone")} value={client.phone} />
        <Info label={t("clients.columns.taxId")} value={client.tax_id} />
        <Info label={t("clients.columns.address")} value={client.address} />
        <Info
          label={t("clients.columns.status")}
          value={t(`clients.status.${client.status}`)}
        />
      </div>

      {/* Custom fields */}
      <div className="rounded-xl border bg-(--bg-surface) p-6">
        {client.custom_fields &&
        Object.keys(client.custom_fields).length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(client.custom_fields).map(([key, value]) => (
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
            {t("clients.customFieldsEmpty")}
          </p>
        )}
      </div>
    </div>
  );
}

/* ======================
   Reusable Info row
   ====================== */
function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-xs text-(--text-secondary) mb-1">
        {label}
      </p>
      <p className="text-sm font-medium">
        {value ?? "-"}
      </p>
    </div>
  );
}
