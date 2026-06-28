import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useCognitoSession, validateRole } from "../modules/auth/services/cognitoAuthService";
import { type AppRole } from "../modules/auth/utils/roles";

interface AuthRouteProps {
  children: ReactElement;
  allowedRoles?: AppRole[];
  redirectTo?: string;
}

export const AuthRoute = ({ children, allowedRoles, redirectTo = "/home" }: AuthRouteProps) => {
  const auth = useCognitoSession();

  console.log("[AuthRoute] render", {
    pathname: window.location.pathname,
    search: window.location.search,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    allowedRoles,
    profileKeys: auth.profile ? Object.keys(auth.profile) : [],
  });

  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-ink-950 text-slate-500 dark:text-slate-300">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-accent-500 border-t-transparent mx-auto"></div>
          <p className="text-sm font-medium">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    console.log("[AuthRoute] redirecting to /login", { pathname: window.location.pathname });
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !validateRole(auth.profile, allowedRoles)) {
    console.log("[AuthRoute] redirecting by role", {
      pathname: window.location.pathname,
      redirectTo,
      allowedRoles,
      profile: auth.profile,
    });
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};