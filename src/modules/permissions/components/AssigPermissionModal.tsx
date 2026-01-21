import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { assignPermissionToRole } from "../../../api/permissions.api";
import type { Permission } from "../type";
import type { Role } from "../../roles/type";
import { listRoles } from "../../../api/roles.api";

interface Props {
  open: boolean;
  permission: Permission | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}

export default function AssignPermissionModal({
  open,
  permission,
  onClose,
  onSaved,
}: Props) {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [roleId, setRoleId] = useState("");

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      const data = await listRoles();
      setRoles(data);
    };

    void load();
  }, [open]);

  if (!open || !permission) return null;

  const submit = async () => {
    if (!roleId) return;

    await assignPermissionToRole({
      roleId,
      permissionId: permission.id,
    });

    await onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 w-full max-w-md rounded-xl bg-(--bg-surface) p-6 space-y-5">
        <h2 className="text-lg font-semibold">
          {t("permissions.assignTitle")}
        </h2>

        <p className="text-sm text-(--text-secondary)">
          {permission.permission_key}
        </p>

        <select
          value={roleId}
          onChange={(e) => setRoleId(e.target.value)}
          className="w-full rounded-lg border bg-(--bg-app) px-3 py-2 text-sm"
        >
          <option value="">
            {t("permissions.selectRole")}
          </option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-(--bg-app) text-sm"
          >
            {t("common.cancel")}
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded-lg bg-(--color-primary) text-white text-sm"
          >
            {t("common.save")}
          </button>
        </div>
      </div>
    </div>
  );
}
