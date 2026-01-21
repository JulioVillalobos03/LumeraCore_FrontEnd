import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LumeraLogo from "../../assets/logos/lumera-core-icon.svg";

export default function PublicNavbar() {
  const { t } = useTranslation();
  return (
    <header className="w-full bg-(--bg-surface)">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="font-bold text-lg text-(--blue-dark)">
          <img
            src={LumeraLogo}
            alt="Lumera Core"
            className="w-50 opacity-90"
          />
        </div>

        {/* Links 
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a href="#product" className="hover:text-(--color-primary)">Product</a>
          <a href="#features" className="hover:text-(--color-primary)">Features</a>
          <a href="#marketplace" className="hover:text-(--color-primary)">Marketplace</a>
          <a href="#company" className="hover:text-(--color-primary)">Company</a>
        </nav>
        */}

        {/* Login */}
        <Link
          to="/login"
          className="text-sm font-medium hover:text-(--color-primary)"
        >
          {t("auth.login")}  →
        </Link>
      </div>
    </header>
  );
}
