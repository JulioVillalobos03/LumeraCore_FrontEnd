import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import LumeraLogo from "../../assets/logos/lumera_core_white.svg";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  // 🔹 Accordions
  const isSettingsRoute = pathname.startsWith("/app/settings");
  const isInventoryRoute = pathname.startsWith("/app/inventory") || pathname.startsWith("/app/products");
  const isAccessRoute =
    pathname.startsWith("/app/roles") ||
    pathname.startsWith("/app/permissions");

  const [settingsOpen, setSettingsOpen] = useState(isSettingsRoute);
  const [inventoryOpen, setInventoryOpen] = useState(isInventoryRoute);
  const [accessOpen, setAccessOpen] = useState(isAccessRoute);

  return (
    <>
      {/* Overlay móvil */}
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 bg-black/40 z-30 md:hidden transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={clsx(
          `
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-(--blue-dark) text-white
          flex flex-col
          transform transition-transform duration-300
          `,
          open ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
      >
        {/* Logo */}
        <img
          src={LumeraLogo}
          alt="Lumera Core"
          className="mx-auto mt-10 mb-10 w-[clamp(100px,18vw,150px)]"
        />

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-6">
          {/* MAIN */}
          <div className="space-y-1 text-xs tracking-wide transition">
            <Item
              to="/app"
              label={t("nav.dashboard")}
              active={pathname === "/app"}
            />

            <Item
              to="/app/employees"
              label={t("nav.employees")}
              active={pathname.startsWith("/app/employees")}
            />

            <Item
              to="/app/users"
              label={t("nav.users")}
              active={pathname.startsWith("/app/users")}
            />
          </div>

          {/* INVENTORY */}
          <div>
            <button
              onClick={() => setInventoryOpen((v) => !v)}
              className={clsx(
                "w-full flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wide transition",
                "text-white hover:text-white/60"
              )}
            >
              <span>{t("nav.inventory")}</span>
              <span
                className={clsx(
                  "transition-transform",
                  inventoryOpen ? "rotate-180" : "rotate-0"
                )}
              >
                ▾
              </span>
            </button>

            <div
              className={clsx(
                "mt-1 space-y-1 overflow-hidden transition-all duration-300",
                inventoryOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <Item
                to="/app/products"
                label={t("nav.products")}
                active={pathname.startsWith("/app/products")}
                nested
              />

              <Item
                to="/app/inventory"
                label={t("inventory.title")}
                active={pathname === "/app/inventory"}
                nested
              />

              <Item
                to="/app/inventory/movements"
                label={t("inventory.movements.short_title")}
                active={pathname.startsWith("/app/inventory/movements")}
                nested
              />
            </div>
          </div>

          {/* ACCESS (Roles & Permissions) */}
          <div>
            <button
              onClick={() => setAccessOpen((v) => !v)}
              className={clsx(
                "w-full flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wide transition",
                "text-white hover:text-white/60"
              )}
            >
              <span>{t("nav.access")}</span>
              <span
                className={clsx(
                  "transition-transform",
                  accessOpen ? "rotate-180" : "rotate-0"
                )}
              >
                ▾
              </span>
            </button>

            <div
              className={clsx(
                "mt-1 space-y-1 overflow-hidden transition-all duration-300",
                accessOpen ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <Item
                to="/app/roles"
                label={t("nav.roles")}
                active={pathname.startsWith("/app/roles")}
                nested
              />

              <Item
                to="/app/permissions"
                label={t("nav.permissions")}
                active={pathname.startsWith("/app/permissions")}
                nested
              />
            </div>
          </div>

          {/* SETTINGS */}
          <div>
            <button
              onClick={() => setSettingsOpen((v) => !v)}
              className={clsx(
                "w-full flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wide transition",
                "text-white hover:text-white/60"
              )}
            >
              <span>{t("settings.title")}</span>
              <span
                className={clsx(
                  "transition-transform",
                  settingsOpen ? "rotate-180" : "rotate-0"
                )}
              >
                ▾
              </span>
            </button>

            <div
              className={clsx(
                "mt-1 space-y-1 overflow-hidden transition-all duration-300",
                settingsOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              )}
            >
              <Item
                to="/app/settings/custom-fields/employees"
                label={t("settings.customFields.employees")}
                active={pathname.startsWith(
                  "/app/settings/custom-fields/employees"
                )}
                nested
              />

              <Item
                to="/app/settings/custom-fields/clients"
                label={t("settings.customFields.clients")}
                active={pathname.startsWith(
                  "/app/settings/custom-fields/clients"
                )}
                nested
              />

              <Item
                to="/app/settings/custom-fields/products"
                label={t("settings.customFields.products")}
                active={pathname.startsWith(
                  "/app/settings/custom-fields/products"
                )}
                nested
              />

              <Item
                to="/app/settings/custom-fields/inventory"
                label={t("settings.customFields.inventory")}
                active={pathname.startsWith(
                  "/app/settings/custom-fields/inventory"
                )}
                nested
              />
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 text-sm text-white/60">
          © Lumera ERP
        </div>
      </aside>
    </>
  );
}

function Item({
  to,
  label,
  active,
  nested = false,
}: {
  to: string;
  label: string;
  active: boolean;
  nested?: boolean;
}) {
  return (
    <Link
      to={to}
      className={clsx(
        "block rounded transition",
        nested ? "ml-4 px-4 py-2 text-sm" : "px-4 py-2",
        active ? "bg-(--blue-muted)" : "hover:bg-(--blue-muted)/70"
      )}
    >
      {label}
    </Link>
  );
}
