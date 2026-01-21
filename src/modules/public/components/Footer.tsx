import { useTranslation } from "react-i18next";
import LumeraLogo from "../../../assets/logos/lumera_core_white.svg";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-(--blue-dark) text-white">
      {/* Decorative top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        {/* Brand */}
        <div className="space-y-4">
          <img
            src={LumeraLogo}
            alt="Lumera Core"
            className="w-40 opacity-90"
          />

          <p className="text-sm text-white/70 max-w-sm leading-relaxed mt-6">
            {t("footer.description")}
          </p>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wider text-white/60">
            {t("footer.product")}
          </p>

          <ul className="space-y-2 text-sm">
            <li className="hover:text-white/80 transition">
              {t("footer.features")}
            </li>
            <li className="hover:text-white/80 transition">
              {t("footer.security")}
            </li>
            <li className="hover:text-white/80 transition">
              {t("footer.roadmap")}
            </li>
          </ul>
        </div>

        {/* Contact / Legal */}
        <div className="space-y-3">
          <p className="text-xs uppercase text-white tracking-wider">
            {t("footer.company")}
          </p>

          <ul className="space-y-2 text-sm">
            <li className="hover:text-white/80 transition">
              {t("footer.about")}
            </li>
            <li className="hover:text-white/80 transition">
              {t("footer.privacy")}
            </li>
            <li className="hover:text-white/80 transition">
              {t("footer.terms")}
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-2 justify-between text-xs text-white/50">
          <span>
            © {year} Lumera Core
          </span>
          <span>
            {t("footer.madeWith")}
          </span>
        </div>
      </div>
    </footer>
  );
}
