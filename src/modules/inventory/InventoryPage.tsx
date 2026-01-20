import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner";
import { resolveErrorKey } from "../../utils/handleError";
import InventoryTable from "./components/InventoryTable";
import InventoryAdjustModal from "./components/InventoryAdjustModal";
import { adjustInventory, listInventory } from "../../api/inventory.api";
import type { InventoryItem } from "./types";

export default function InventoryPage() {
    const { t } = useTranslation();
    const [rows, setRows] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [adjustOpen, setAdjustOpen] = useState(false);

    const load = async () => {
        setLoading(true);
        setError(null);
        try {
            setRows(await listInventory());
        } catch (e) {
            setError(t(resolveErrorKey(e)));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    const onAdjust = async (data: {
        product_id: string;
        type: "in" | "out";
        quantity: number;
        notes?: string;
    }) => {
        try {
            await adjustInventory(data);
            await load();
            setAdjustOpen(false);
        } catch (e) {
            setError(t(resolveErrorKey(e)));
        }
    };

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-heading">
                        {t("inventory.title")}
                    </h1>
                    <p className="text-sm text-(--text-secondary)">
                        {t("inventory.subtitle")}
                    </p>
                </div>

                <button
                    className="
            bg-(--color-primary) text-white
            px-4 py-2 rounded-lg text-sm
            hover:opacity-90 transition
          "
                    onClick={() => setAdjustOpen(true)}
                >
                    {t("inventory.adjust.button")}
                </button>
            </div>

            {error && (
                <div className="rounded-lg border px-4 py-3 text-sm border-red-500/30 bg-red-500/5">
                    {error}
                </div>
            )}

            {loading ? <Spinner /> :
                <InventoryTable
                    rows={rows}     
                />
            }

            <InventoryAdjustModal
                open={adjustOpen}
                onClose={() => setAdjustOpen(false)}
                onSubmit={onAdjust}
            />


        </div>
    );
}
