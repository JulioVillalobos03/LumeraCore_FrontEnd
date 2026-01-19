import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { Employee } from "./types";
import { getEmployee } from "../../api/employees.api";
import { resolveErrorKey } from "../../utils/handleError";
import Spinner from "../../components/common/Spinner";

export default function EmployeeDetailPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            setLoading(true);
            try {
                const data = await getEmployee(id);
                setEmployee(data);
            } catch (e) {
                setError(t(resolveErrorKey(e)));
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, [id, t]);

    if (loading) {
        return <Spinner/>
    }

    if (error) {
        return (
            <div className="rounded-lg border px-4 py-3 text-sm
        border-(--color-primary)/30 bg-(--color-primary)/5">
                {error}
            </div>
        );
    }

    if (!employee) return null;

    return (
        <div className="space-y-6 max-w-8xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading">
                        {employee.first_name} {employee.last_name}
                    </h1>
                    <p className="text-sm text-(--text-secondary)">
                        {t("employees.detail.subtitle")}
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
                <Info label={t("employees.columns.email")} value={employee.email} />
                <Info label={t("employees.columns.phone")} value={employee.phone} />
                <Info label={t("employees.columns.position")} value={employee.position} />
                <Info label={t("employees.columns.department")} value={employee.department} />
                <Info
                    label={t("employees.columns.status")}
                    value={t(`employees.status.${employee.status}`)}
                />
            </div>

            {/* Custom fields */}
            <div className="rounded-xl border bg-(--bg-surface) p-6">

                {employee.custom_fields && Object.keys(employee.custom_fields).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(employee.custom_fields).map(([key, value]) => (
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
                        {t("employees.customFieldsEmpty")}
                    </p>
                )}
            </div>

        </div>
    );
}

function Info({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <p className="text-xs text-(--text-secondary) mb-1">{label}</p>
            <p className="text-sm font-medium">{value ?? "-"}</p>
        </div>
    );
}
