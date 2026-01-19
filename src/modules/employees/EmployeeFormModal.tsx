import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import type { CreateEmployeeInput, CustomField, Employee } from "./types";
import { listCustomFields } from "../../api/customFields.api";
import Spinner from "../../components/common/Spinner";

type Mode = "create" | "edit";

interface Props {
    open: boolean;
    mode: Mode;
    initial?: Employee | null;
    onClose: () => void;
    onSubmit: (payload: CreateEmployeeInput) => Promise<void>;
    title?: string;
}

export default function EmployeeFormModal({
    open,
    mode,
    initial,
    onClose,
    onSubmit,
    title,
}: Props) {
    const { t } = useTranslation();

    const defaultForm: CreateEmployeeInput = useMemo(
        () => ({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            position: "",
            department: "",
            custom_fields: {},
        }),
        []
    );

    const [form, setForm] = useState<CreateEmployeeInput>(defaultForm);
    const [customDefs, setCustomDefs] = useState<CustomField[]>([]);
    const [loadingFields, setLoadingFields] = useState(false);
    const [saving, setSaving] = useState(false);

    /* =======================
       Load custom field defs
       ======================= */
    useEffect(() => {
        if (!open) return;

        const load = async () => {
            setLoadingFields(true);
            try {
                const defs = await listCustomFields("employees");
                setCustomDefs(defs);
            } finally {
                setLoadingFields(false);
            }
        };

        void load();
    }, [open]);

    /* =======================
       Load initial data (edit)
       ======================= */
    useEffect(() => {
        if (!open) return;

        if (mode === "edit" && initial) {
            setForm({
                first_name: initial.first_name ?? "",
                last_name: initial.last_name ?? "",
                email: initial.email ?? "",
                phone: initial.phone ?? "",
                position: initial.position ?? "",
                department: initial.department ?? "",
                custom_fields: initial.custom_fields ?? {},
            });
        } else {
            setForm(defaultForm);
        }
    }, [open, mode, initial, defaultForm]);

    if (!open) return null;

    const update = (key: keyof CreateEmployeeInput, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const updateCustom = (key: string, value: unknown) => {
        setForm((prev) => ({
            ...prev,
            custom_fields: {
                ...(prev.custom_fields ?? {}),
                [key]: value,
            },
        }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            await onSubmit({
                ...form,
                email: form.email || null,
                phone: form.phone || null,
                position: form.position || null,
                department: form.department || null,
                custom_fields:
                    form.custom_fields && Object.keys(form.custom_fields).length > 0
                        ? form.custom_fields
                        : null,
            });

            onClose();
        } finally {
            setSaving(false);
        }
    };

    const modalTitle =
        title ??
        (mode === "create"
            ? t("employees.create")
            : t("employees.editTitle"));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div onClick={onClose} className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 w-full max-w-2xl bg-(--bg-surface) rounded-xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-6">{modalTitle}</h2>

                <form onSubmit={submit} className="space-y-6">
                    {/* Base fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label={t("employees.form.firstName")}
                            value={form.first_name}
                            onChange={(v) => update("first_name", v)}
                            required
                        />
                        <Input
                            label={t("employees.form.lastName")}
                            value={form.last_name}
                            onChange={(v) => update("last_name", v)}
                            required
                        />
                        <Input
                            label={t("employees.form.email")}
                            value={form.email ?? ""}
                            onChange={(v) => update("email", v)}
                            type="email"
                        />
                        <Input
                            label={t("employees.form.phone")}
                            value={form.phone ?? ""}
                            onChange={(v) => update("phone", v)}
                        />
                        <Input
                            label={t("employees.form.position")}
                            value={form.position ?? ""}
                            onChange={(v) => update("position", v)}
                        />
                        <Input
                            label={t("employees.form.department")}
                            value={form.department ?? ""}
                            onChange={(v) => update("department", v)}
                        />
                    </div>

                    {/* Custom fields */}
                    {loadingFields && (
                        <div className="flex justify-center py-6">
                            <Spinner />
                        </div>
                    )}

                    {!loadingFields && customDefs.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-(--text-secondary) mb-3">
                                {t("employees.customFields")}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {customDefs.map((f) => {
                                    const value = form.custom_fields?.[f.field_key];

                                    switch (f.field_type) {
                                        case "select":
                                            return (
                                                <SelectField
                                                    key={f.id}
                                                    label={f.label}
                                                    required={f.required}
                                                    value={String(value ?? "")}
                                                    options={Array.isArray(f.options) ? f.options : []}
                                                    onChange={(v) => updateCustom(f.field_key, v)}
                                                />
                                            );

                                        case "boolean":
                                            return (
                                                <SelectField
                                                    key={f.id}
                                                    label={f.label}
                                                    required={f.required}
                                                    value={String(value ?? "")}
                                                    options={[
                                                        { label: t("common.yes"), value: "true" },
                                                        { label: t("common.no"), value: "false" },
                                                    ]}
                                                    onChange={(v) => updateCustom(f.field_key, v === "true")}
                                                />
                                            );

                                        case "number":
                                            return (
                                                <Input
                                                    key={f.id}
                                                    type="number"
                                                    label={f.label}
                                                    required={f.required}
                                                    value={String(value ?? "")}
                                                    onChange={(v) => updateCustom(f.field_key, Number(v))}
                                                />
                                            );

                                        case "date":
                                            return (
                                                <Input
                                                    key={f.id}
                                                    type="date"
                                                    label={f.label}
                                                    required={f.required}
                                                    value={String(value ?? "")}
                                                    onChange={(v) => updateCustom(f.field_key, v)}
                                                />
                                            );

                                        default:
                                            return (
                                                <Input
                                                    key={f.id}
                                                    label={f.label}
                                                    required={f.required}
                                                    value={String(value ?? "")}
                                                    onChange={(v) => updateCustom(f.field_key, v)}
                                                />
                                            );
                                    }
                                })}

                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-(--bg-app) hover:bg-(--bg-app)/80 transition text-sm"
                        >
                            {t("employees.form.cancel")}
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="px-4 py-2 rounded-lg bg-(--color-primary) text-white hover:opacity-90 transition text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {saving
                                ? t("employees.form.saving")
                                : t("employees.form.save")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* =======================
   Reusable Input
   ======================= */
function Input({
    label,
    value,
    onChange,
    type = "text",
    required = false,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
    required?: boolean;
}) {
    return (
        <label className="block">
            <span className="block text-xs text-(--text-secondary) mb-1">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </span>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className="
          w-full px-4 py-2.5 rounded-lg
          bg-(--bg-app)
          border border-transparent
          transition-all duration-200 ease-out
          focus:outline-none
          focus:border-(--color-primary)
          focus:ring-2 focus:ring-(--color-primary)/30
        "
            />
        </label>
    );
}


function SelectField({
    label,
    value,
    options,
    onChange,
    required = false,
}: {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (v: string) => void;
    required?: boolean;
}) {
    return (
        <label className="block">
            <span className="block text-xs text-(--text-secondary) mb-1">
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
            </span>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                className="
          w-full px-4 py-2.5 rounded-lg
          bg-(--bg-app)
          border border-transparent
          transition-all duration-200
          focus:outline-none
          focus:border-(--color-primary)
          focus:ring-2 focus:ring-(--color-primary)/30
        "
            >
                <option value="">
                    — {label} —
                </option>

                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </label>
    );
}
