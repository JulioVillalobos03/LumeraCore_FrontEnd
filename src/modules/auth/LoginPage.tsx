import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedGridBackground from "../../components/common/AnimatedGridBackground";
import LumeraLogo from "../../assets/logos/lumera-core-icon.svg";
import { useAuth } from "../../auth/useAuth";
import { useTranslation } from "react-i18next";
import { resolveErrorKey } from "../../utils/handleError";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, hasCompany } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);

      if (hasCompany) {
        navigate("/app", { replace: true });
      } else {
        navigate("/onboarding/company", { replace: true });
      }
    } catch (err: unknown) {
      const key = resolveErrorKey(err);
      setError(t(key));
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
            rounded-xl shadow-xl
            text-center
            animate-fade-in
          "
        >
          {/* Logo */}
          <img
            src={LumeraLogo}
            alt="Lumera Core"
            className="mx-auto mb-10 w-[clamp(260px,18vw,400px)]"
          />

          {/* Subtitle */}
          <h2 className="mt-6 mb-4 text-lg text-(--text-secondary)">
            {t("auth.loginSubtitle")}
          </h2>

          {/* Register link */}
          <p className="mb-6 text-sm text-(--text-secondary)">
            {t("auth.noAccount")}{" "}
            <Link
              to="/register"
              className="text-(--color-primary) hover:underline"
            >
              {t("auth.createOne")}
            </Link>
          </p>

          {/* Error */}
          {error && (
            <div
              className="
                mb-5 rounded-lg border px-4 py-3 text-sm text-left
                border-(--color-primary)/30
                bg-(--color-primary)/5
                text-(--text-primary)
                animate-shake
              "
            >
              {error}
            </div>
          )}

          {/* Email */}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder={t("auth.email")}
            required
            className="
              w-full mb-4 px-4 py-3 rounded-lg
              bg-(--bg-app)
              transition-all duration-200
              focus:outline-none
              focus:ring-2 focus:ring-(--color-primary)/40
              focus:shadow-md
            "
          />

          {/* Password */}
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder={t("auth.password")}
            required
            className="
              w-full mb-6 px-4 py-3 rounded-lg
              bg-(--bg-app)
              transition-all duration-200
              focus:outline-none
              focus:ring-2 focus:ring-(--color-primary)/40
              focus:shadow-md
            "
          />

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-(--color-primary) text-white
              py-3 rounded-lg font-medium
              transition-all duration-200
              hover:shadow-lg hover:-translate-y-[1px]
              active:translate-y-0 active:shadow
              disabled:opacity-60 disabled:cursor-not-allowed
              disabled:hover:translate-y-0
            "
          >
            {loading ? (
              <span className="animate-pulse">
                {t("auth.loggingIn")}
              </span>
            ) : (
              t("auth.loginButton")
            )}
          </button>

          {/* Divider */}
          <div className="my-8 flex items-center gap-3">
            <div className="flex-1 h-px bg-(--text-secondary)/30" />
            <span className="text-xs uppercase tracking-wider text-(--text-secondary)">
              {t("auth.continueWith")}
            </span>
            <div className="flex-1 h-px bg-(--text-secondary)/30" />
          </div>

          {/* Google (coming soon) */}
          <button
            type="button"
            disabled
            className="
              w-full flex items-center justify-center gap-3
              bg-[#E5E7EB] text-[#374151]
              py-3 rounded-lg
              opacity-80 cursor-not-allowed
              transition
            "
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 3.1l6-6C34.3 2.7 29.5 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.1 5.5C11.3 13.3 17.2 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.1 24.5c0-1.7-.1-3-.4-4.4H24v8.4h12.7c-.5 2.7-2 5-4.2 6.6l6.5 5c3.8-3.5 6.1-8.6 6.1-15.6z" />
              <path fill="#FBBC05" d="M9.7 28.7c-.5-1.4-.8-2.8-.8-4.2s.3-2.9.8-4.2l-7.1-5.5C.9 18.1 0 21.2 0 24.5s.9 6.4 2.6 9.7l7.1-5.5z" />
              <path fill="#34A853" d="M24 48c5.5 0 10.3-1.8 13.7-4.9l-6.5-5c-1.8 1.2-4.1 1.9-7.2 1.9-6.8 0-12.7-3.8-14.3-9.2l-7.1 5.5C6.5 42.6 14.6 48 24 48z" />
            </svg>

            <span>
              {t("auth.google")}{" "}
              <span className="text-xs text-(--text-secondary)">
                {t("auth.comingSoon")}
              </span>
            </span>
          </button>
        </form>
      </div>
    </AnimatedGridBackground>
  );
}
