import { useTranslation } from "react-i18next";
import { LANDING_FEATURES } from "../constants/landingcontent.map";

export default function FeaturesSection() {
  const { t } = useTranslation();


  return (
    <section id="features" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-heading">
          {t("landing.features.title")}
        </h2>
        <p className="mt-4 text-(--text-secondary)">
          {t("landing.features.subtitle")}
        </p>
      </div>

      <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {LANDING_FEATURES.map((f, i) => (
          <div
            key={f.key}
            className="
              bg-(--bg-surface)
              border rounded-xl p-6
              transition-all
              hover:shadow-lg hover:-translate-y-1
              animate-fade-in-up
            "
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="text-(--color-primary) text-xl mb-4">{f.icon}</div>

            <h3 className="font-semibold text-lg">
              {t(`landing.features.items.${f.key}.title`)}
            </h3>

            <p className="mt-2 text-sm text-(--text-secondary)">
              {t(`landing.features.items.${f.key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
