import { Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export default function PublicRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, hasCompany } = useAuth();

  if (isAuthenticated) {
    return hasCompany
      ? <Navigate to="/app" replace />
      : <Navigate to="/onboarding/company" replace />;
  }

  return children;
}
