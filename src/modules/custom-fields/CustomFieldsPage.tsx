import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner";
import { listCustomFields } from "../../api/customFields.api";
import type { CustomField } from "../../types/custom-field";
import CreateCustomFieldModal from "./CreateCustomFieldsModel";
import type { CustomFieldEntity } from "../../types/entities";

interface Props {
  entity: CustomFieldEntity;
}

const ENTITY_TITLE_KEY: Record<string, string> = {
  employees: "employees.title",
  clients: "clients.title",
  products: "products.title",
};

export default function CustomFieldsPage({ entity }: Props) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<CustomField[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listCustomFields(entity);
      setRows(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [entity]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-heading">{t("customFields.title")}</h1>
          <p className="text-sm text-(--text-secondary)">{t(ENTITY_TITLE_KEY[entity])}</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-(--color-primary) text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
        >
          {t("customFields.create")}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : (
        <div className="rounded-xl border bg-(--bg-surface) overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-(--text-secondary)">
              <tr className="border-b">
                <th className="p-4">{t("customFields.form.label")}</th>
                <th className="p-4">{t("customFields.form.key")}</th>
                <th className="p-4">{t("customFields.form.type")}</th>
                <th className="p-4">{t("customFields.form.required")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((f) => (
                <tr key={f.id} className="border-b last:border-b-0">
                  <td className="p-4 font-medium">{f.label}</td>
                  <td className="p-4 text-xs">{f.field_key}</td>
                  <td className="p-4">{f.field_type}</td>
                  <td className="p-4">{f.required ? "✔" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="p-6 text-sm text-(--text-secondary)">
              {t("customFields.empty")}
            </div>
          )}
        </div>
      )}

      <CreateCustomFieldModal
        open={open}
        entity={entity}
        onClose={() => setOpen(false)}
        onCreated={load}
      />
    </div>
  );
}
