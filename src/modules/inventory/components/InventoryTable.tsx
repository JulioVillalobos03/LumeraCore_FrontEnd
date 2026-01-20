import { useTranslation } from "react-i18next";
import { FiEye } from "react-icons/fi";
import type { InventoryItem } from "../types";
import { useNavigate } from "react-router-dom";

interface Props {
    rows: InventoryItem[];
}

export default function InventoryTable({ rows }: Props) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="overflow-auto rounded-xl border bg-(--bg-surface)">
            <table className="w-full text-sm">
                <thead className="text-left text-(--text-secondary)">
                    <tr className="border-b">
                        <th className="p-4">{t("inventory.columns.sku")}</th>
                        <th className="p-4">{t("inventory.columns.product")}</th>
                        <th className="p-4">{t("inventory.columns.stock")}</th>
                        <th className="p-4 text-center">
                            {t("employees.columns.actions")}
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((item) => (
                        <tr
                            key={item.id}
                            className="border-b last:border-b-0 hover:bg-(--bg-app)/50"
                        >
                            <td className="p-4 font-medium">{item.sku}</td>
                            <td className="p-4">{item.name}</td>
                            <td className="p-4">{item.stock}</td>

                            {/* Actions */}
                            <td className="p-4 text-center">
                                
                                <button
                                className="
                                        inline-flex items-center justify-center
                                        h-9 w-9 rounded-lg
                                        text-(--text-secondary)
                                        hover:text-(--color-primary)
                                        hover:bg-(--color-primary)/10
                                        transition-colors duration-200
                                        focus:outline-none
                                        focus-visible:ring-2
                                        focus-visible:ring-(--color-primary)/40
                                    "
                                    title={t("common.view")}
                                    onClick={() => navigate(`/app/inventory/${item.id}`)}
                                    >
                                        <FiEye size={18} />
                                    </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {rows.length === 0 && (
                <div className="p-6 text-sm text-(--text-secondary)">
                    {t("inventory.empty")}
                </div>
            )}
        </div>
    );
}
