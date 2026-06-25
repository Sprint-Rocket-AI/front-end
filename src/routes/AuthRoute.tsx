import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";

interface AuthRouteProps {
  children: ReactElement;
}

export const AuthRoute = ({ children }: AuthRouteProps) => {
  const auth = useAuth();

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

  return auth.isAuthenticated ? children : <Navigate to="/login" replace />;
};