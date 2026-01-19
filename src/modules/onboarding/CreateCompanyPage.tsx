import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";
import AnimatedGridBackground from "../../components/common/AnimatedGridBackground";
import LumeraLogo from "../../assets/logos/lumera-core-icon.svg";
import { createCompany } from "../../api/company.api";
import { useTranslation } from "react-i18next";

type BackendError = { message?: string };

export default function CreateCompanyPage() {
    const { t } = useTranslation();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await createCompany(name);
      navigate("/app", { replace: true });
    } catch (err: unknown) {
      const ax = err as AxiosError<BackendError>;
      setError(ax.response?.data?.message ?? "Could not create company");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedGridBackground>
      <div className="min-h-screen flex items-center justify-center px-4">
        <form
          onSubmit={onSubmit}
          className="
            w-full max-w-2xl
            bg-(--bg-surface)
            p-6 sm:p-8 md:p-14
            rounded-xl shadow-lg
            text-center
          "
        >
          <img
            src={LumeraLogo}
            alt="Lumera Core"
            className="mx-auto mb-10 w-[clamp(260px,18vw,400px)]"
          />

          <h2 className="text-xl sm:text-2xl font-heading mb-8">
            {t("onboarding.title")}
          </h2>

          {error && (
            <div className="mb-5 rounded-lg border px-4 py-3 text-sm text-left
                            border-(--color-primary)/30 bg-(--color-primary)/5">
              {error}
            </div>
          )}

          {/* Company name */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder={t("onboarding.companyPlaceholder")}
            className="
              w-full mb-6
              px-4 py-2.5
              text-sm sm:text-base
              border border-transparent rounded-lg
              bg-(--bg-app)
              transition-all duration-200 ease-out
              focus:outline-none
              focus:border-(--color-primary)
              focus:ring-2 focus:ring-(--color-primary)/30
              focus:shadow-[0_0_0_4px_rgba(193,18,31,0.12)]
              focus:scale-[1.01]
            "
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-(--color-primary) text-white
              py-2.5 sm:py-3
              text-sm sm:text-base
              rounded-lg font-medium
              hover:opacity-90 transition
              disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            {loading ? t("onboarding.creating") : t("onboarding.createButton")}
          </button>
        </form>
      </div>
    </AnimatedGridBackground>
  );
}
