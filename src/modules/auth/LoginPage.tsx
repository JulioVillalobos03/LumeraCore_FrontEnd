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


            // 🔑 DECISIÓN AQUÍ (NO EN /)
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
            rounded-xl shadow-lg
            text-center
          "
                >
                    <img
                        src={LumeraLogo}
                        alt="Lumera Core"
                        className="mx-auto mb-10 w-[clamp(260px,18vw,400px)]"
                    />

                    {error && (
                        <div className="mb-5 rounded-lg border px-4 py-3 text-sm text-left
              border-(--color-primary)/30 bg-(--color-primary)/5 text-(--text-primary)">
                            {error}
                        </div>
                    )}

                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder={t("auth.email")}
                        required
                        className="w-full mb-4 px-4 py-2.5 rounded-lg bg-(--bg-app)"
                    />

                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder={t("auth.password")}
                        required
                        className="w-full mb-6 px-4 py-2.5 rounded-lg bg-(--bg-app)"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="
                        w-full bg-(--color-primary) text-white
                        py-2.5 rounded-lg font-medium
                        disabled:opacity-60
                        "
                    >
                        {loading ? t("auth.loggingIn") : t("auth.loginButton")}
                    </button>

                    <p className="mt-6 text-sm text-(--text-secondary)">
                        {t("auth.noAccount")}{" "}
                        <Link to="/register" className="text-(--color-primary) hover:underline">
                            {t("auth.createOne")}
                        </Link>
                    </p>
                </form>
            </div>
        </AnimatedGridBackground>
    );
}
