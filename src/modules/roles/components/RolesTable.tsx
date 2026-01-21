import { useTranslation } from "react-i18next";
import type { Role } from "../type";

interface Props {
  rows: Role[];
  selectedRoleId: string | null;
  onSelect: (role: Role) => void;
}

export default function RolesTable({
  rows,
  selectedRoleId,
  onSelect,
}: Props) {
  const { t } = useTranslation();

  return (
    <div className="overflow-auto rounded-xl border bg-(--bg-surface)">
      <table className="w-full text-sm">
        <thead className="text-left text-(--text-secondary)">
          <tr className="border-b">
            <th className="p-4">{t("roles.columns.name")}</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r) => {
            const active = r.id === selectedRoleId;

            return (
              <tr
                key={r.id}
                onClick={() => onSelect(r)}
                className={`
                  cursor-pointer border-b last:border-b-0 transition
                  hover:bg-(--bg-app)/40
                  ${active ? "bg-(--bg-app)" : ""}
                `}
              >
                <td className="p-4 font-medium">{r.name}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {rows.length === 0 && (
        <div className="p-6 text-sm text-(--text-secondary)">
          {t("roles.empty")}
        </div>
      )}
    </div>
  );
}
