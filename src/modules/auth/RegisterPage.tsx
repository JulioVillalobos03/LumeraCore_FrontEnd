import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AnimatedGridBackground from "../../components/common/AnimatedGridBackground";
import LumeraLogo from "../../assets/logos/lumera-core-icon.svg";
import { registerRequest } from "../../api/auth.api";
import { useAuth } from "../../auth/useAuth";
import { useTranslation } from "react-i18next";
import { resolveErrorKey } from "../../utils/handleError";

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSession } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await registerRequest(name, email, password);

      // 🔑 Guardar sesión
      setSession(res.token, res.user);

      // 🚀 Onboarding
      navigate("/onboarding/company", { replace: true });
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
          <p className="mb-8 text-sm text-(--text-secondary)">
            {t("auth.registerSubtitle")}
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

          {/* Name */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder={t("auth.name")}
            required
            className="
              w-full mb-4 px-4 py-3 rounded-lg
              bg-(--bg-app)
              transition-all duration-200
              focus:outline-none
              focus:ring-2 focus:ring-(--color-primary)/40
              focus:shadow-md
              focus:scale-[1.01]
            "
          />

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
              focus:scale-[1.01]
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
              focus:scale-[1.01]
            "
          />

          {/* Register button */}
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
            "
          >
            {loading ? (
              <span className="animate-pulse">
                {t("auth.registering")}
              </span>
            ) : (
              t("auth.registerButton")
            )}
          </button>

          {/* Login link */}
          <p className="mt-6 text-sm text-(--text-secondary)">
            {t("auth.haveAccount")}{" "}
            <Link
              to="/login"
              className="text-(--color-primary) hover:underline"
            >
              {t("auth.login")}
            </Link>
          </p>
        </form>
      </div>
    </AnimatedGridBackground>
  );
}
