import { useTranslation } from "react-i18next";
import { LANDING_STEPS } from "../constants/landingcontent.map";

export default function HowItWorksSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-(--bg-surface)">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading">
            {t("landing.how.title")}
          </h2>
          <p className="mt-4 text-(--text-secondary)">
            {t("landing.how.subtitle")}
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-12 text-center">
          {LANDING_STEPS.map((s, i) => (
            <div
              key={s.key}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div
                className="
                  mx-auto mb-4
                  h-12 w-12 rounded-full
                  bg-(--color-primary)/10
                  flex items-center justify-center
                  text-(--color-primary)
                  font-bold
                "
              >
                {i + 1}
              </div>

              <h4 className="font-semibold">
                {t(`landing.how.steps.${s.key}.title`)}
              </h4>

              <p className="mt-2 text-sm text-(--text-secondary)">
                {t(`landing.how.steps.${s.key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
