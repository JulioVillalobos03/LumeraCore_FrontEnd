import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function FinalCtaSection() {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-6 py-28 text-center">
      <h2 className="text-3xl font-heading">
        {t("landing.cta.title")}
      </h2>

      <p className="mt-4 text-(--text-secondary)">
        {t("landing.cta.subtitle")}
      </p>

      <div className="mt-10">
        <Link
          to="/register"
          className="
            inline-flex items-center justify-center
            bg-(--color-primary) text-white
            px-8 py-4 rounded-lg font-medium
            transition-all
            hover:shadow-xl hover:-translate-y-0.5
          "
        >
          {t("landing.cta.button")}
        </Link>
      </div>
    </section>
  );
}
