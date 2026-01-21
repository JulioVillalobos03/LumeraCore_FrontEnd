import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "../../components/common/Spinner";
import ClientsTable from "./components/ClientsTable";
import ClientFormModal from "./ClientFormModal";
import type { Client } from "./types";
import {
    listClients,
    createClient,
    updateClient,
    changeClientStatus,
} from "../../api/clients.api";

export default function ClientsPage() {
    const { t } = useTranslation();

    const [rows, setRows] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<Client | null>(null);


    const load = async () => {
        setLoading(true);
        try {
            setRows(await listClients());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void load();
    }, []);

    const submit = async (data: Partial<Client>) => {
        if (selected) {
            await updateClient(selected.id, data);
        } else {
            await createClient(data);
        }
        await load();
        setSelected(null);
    };

    const toggleStatus = async (c: Client) => {
        const next = c.status === "active" ? "inactive" : "active";
        await changeClientStatus(c.id, next);
        await load();
    };

    return (
        <div className="space-y-5">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-heading">{t("clients.title")}</h1>
                    <p className="text-sm text-(--text-secondary)">
                        {t("clients.subtitle")}
                    </p>
                </div>

                <button
                    onClick={() => setOpen(true)}
                    className="bg-(--color-primary) text-white px-4 py-2 rounded-lg"
                >
                    {t("clients.create")}
                </button>
            </div>

            {loading ? (
                <Spinner />
            ) : (
                <ClientsTable
                    rows={rows}
                    onEdit={(c) => {
                        setSelected(c);
                        setOpen(true);
                    }}
                    onToggleStatus={toggleStatus}
                />
            )}

            <ClientFormModal
                open={open}
                initial={selected}
                onClose={() => {
                    setOpen(false);
                    setSelected(null);
                }}
                onSubmit={submit}
            />
        </div>
    );
}
