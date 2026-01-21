import { useTranslation } from "react-i18next";
import type { Permission } from "../type";

interface Props {
  rows: Permission[];
  onAssign: (p: Permission) => void;
}

export default function PermissionsTable({ rows, onAssign }: Props) {
  const { t } = useTranslation();

  return (
    <div className="overflow-auto rounded-xl border bg-(--bg-surface)">
      <table className="w-full text-sm">
        <thead className="text-left text-(--text-secondary)">
          <tr className="border-b">
            <th className="p-4">{t("permissions.columns.key")}</th>
            <th className="p-4 text-right">{t("common.actions")}</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((p) => (
            <tr
              key={p.id}
              className="border-b last:border-b-0 hover:bg-(--bg-app)/40 transition"
            >
              <td className="p-4 font-mono text-xs">
                {p.permission_key}
              </td>

              <td className="p-4 text-right">
                <button
                  onClick={() => onAssign(p)}
                  className="
                    px-3 py-1.5 rounded-lg text-xs
                    bg-(--bg-app)
                    hover:bg-(--bg-app)/70
                    transition
                  "
                >
                  {t("permissions.assign")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="p-6 text-sm text-(--text-secondary)">
          {t("permissions.empty")}
        </div>
      )}
    </div>
  );
}
