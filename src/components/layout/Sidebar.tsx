import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import LumeraLogo from "../../assets/logos/lumera_core_white.svg";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";

type OpenMenu = "inventory" | "access" | "settings" | null;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const currentYear = new Date().getFullYear();

  /* 🔹 Determinar menú activo */
  const routeMenu: OpenMenu = useMemo(() => {
    if (
      pathname.startsWith("/app/inventory") ||
      pathname.startsWith("/app/products")
    ) return "inventory";

    if (
      pathname.startsWith("/app/roles") ||
      pathname.startsWith("/app/permissions")
    ) return "access";

    if (pathname.startsWith("/app/settings")) return "settings";

    return null;
  }, [pathname]);

  const [openMenu, setOpenMenu] = useState<OpenMenu>(routeMenu);

  const toggleMenu = (menu: OpenMenu) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  return (
    <>
      {/* Overlay SOLO EN MOBILE */}
      <div
        onClick={onClose}
        className={clsx(
          "fixed inset-0 bg-black/40 z-30 lg:hidden transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      <aside
        className={clsx(
          `
          bg-(--blue-dark) text-white
          flex flex-col
          transition-all duration-300
          z-40
          `,
          // MOBILE
          "fixed inset-y-0 left-0 w-64 lg:relative",
          // DESKTOP
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          // DESKTOP WIDTH CONTROL
          open ? "lg:w-64" : "lg:w-0 overflow-hidden"
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
          <div className="space-y-1 text-xs tracking-wide">
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

            <Item
              to="/app/clients"
              label={t("nav.clients")}
              active={pathname.startsWith("/app/clients")}
            />
          </div>

          {/* INVENTORY */}
          <Accordion
            title={t("nav.inventory")}
            open={openMenu === "inventory"}
            onToggle={() => toggleMenu("inventory")}
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
          </Accordion>

          {/* ACCESS */}
          <Accordion
            title={t("nav.access")}
            open={openMenu === "access"}
            onToggle={() => toggleMenu("access")}
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
          </Accordion>

          {/* SETTINGS */}
          <Accordion
            title={t("settings.title")}
            open={openMenu === "settings"}
            onToggle={() => toggleMenu("settings")}
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
          </Accordion>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 text-sm text-white/60">
          {currentYear} © Lumera Core
        </div>
      </aside>
    </>
  );
}

/* =====================
   Accordion
===================== */
function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-2 text-xs uppercase tracking-wide text-white hover:text-white/60"
      >
        <span>{title}</span>
        <span
          className={clsx(
            "transition-transform",
            open ? "rotate-180" : "rotate-0"
          )}
        >
          ▾
        </span>
      </button>

      <div
        className={clsx(
          "mt-1 space-y-1 overflow-hidden transition-all duration-300",
          open ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        {children}
      </div>
    </div>
  );
}

/* =====================
   Item
===================== */
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
        active
          ? "bg-(--blue-muted)"
          : "hover:bg-(--blue-muted)/70"
      )}
    >
      {label}
    </Link>
  );
}
