import { Menu } from "lucide-react";
import { useAuth } from "../../auth/useAuth";
import ProfileModal from "../common/ProfileModal";
import { useTranslation } from "react-i18next";
import { setLanguage } from "../../i18n";
import { useEffect, useRef, useState } from "react";

interface Props {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: Props) {
  const { i18n, t } = useTranslation();
  const current = i18n.language;

  const { user, activeCompany, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <header className="h-16 bg-(--bg-surface) border-b flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded hover:bg-(--bg-app)"
          >
            <Menu size={20} />
          </button>

          <span className="font-semibold">
            {activeCompany?.company_name ?? "Dashboard"}
          </span>
        </div>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-full bg-(--color-primary) text-white flex items-center justify-center text-sm font-semibold"
          >
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-(--bg-surface) border rounded-lg shadow-lg text-sm z-50">
              <div className="px-4 py-3 border-b">
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-(--text-secondary)">
                  {user?.email}
                </p>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  setProfileOpen(true);
                }}
                className="w-full text-left px-4 py-2 hover:bg-(--bg-app)"
              >
                {t("profile.title")}
              </button>

              <div className="px-2 py-2 border-t">
                <button
                  onClick={() => setLanguage("es")}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-(--bg-app) ${
                    current === "es" ? "font-semibold" : ""
                  }`}
                >
                  Español
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-(--bg-app) ${
                    current === "en" ? "font-semibold" : ""
                  }`}
                >
                  English
                </button>
              </div>

              <button
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-(--bg-app)"
              >
                {t("profile.logout")}
              </button>
            </div>
          )}
        </div>
      </header>

      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
    </>
  );
}
