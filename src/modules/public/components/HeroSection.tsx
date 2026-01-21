import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative">
      {/* Decorative gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-(--color-primary)/10 via-transparent to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-14 items-center">
        {/* Left */}
        <div className="animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-heading leading-tight max-w-xl">
            {t("landing.hero.titleLine1")} <br />
            <span className="text-(--color-primary)">
              {t("landing.hero.titleHighlight")}
            </span>
          </h1>

          <p className="mt-6 text-lg text-(--text-secondary) max-w-lg">
            {t("landing.hero.subtitle")}
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              to="/register"
              className="
                inline-flex items-center justify-center
                bg-(--color-primary) text-white
                px-7 py-3 rounded-lg font-medium
                transition-all
                hover:shadow-lg hover:-translate-y-0.5
              "
            >
              {t("landing.hero.ctaPrimary")}
            </Link>

            <a
              href="#features"
              className="
                inline-flex items-center justify-center
                px-7 py-3 rounded-lg
                border border-(--color-primary)/30
                text-(--text-primary)
                hover:bg-(--color-primary)/5
                transition
              "
            >
              {t("landing.hero.ctaSecondary")}
            </a>
          </div>
        </div>

        {/* Right (visual block) */}
        <div className="relative animate-fade-in">
          <div
            className="
              rounded-2xl bg-(--bg-surface)
              border shadow-xl
              p-6 md:p-8
            "
          >
            <div className="space-y-4">
              <div className="h-4 w-1/3 bg-(--color-primary)/20 rounded" />
              <div className="h-3 w-full bg-(--bg-app) rounded" />
              <div className="h-3 w-5/6 bg-(--bg-app) rounded" />
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="h-16 bg-(--bg-app) rounded" />
                <div className="h-16 bg-(--bg-app) rounded" />
                <div className="h-16 bg-(--bg-app) rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
