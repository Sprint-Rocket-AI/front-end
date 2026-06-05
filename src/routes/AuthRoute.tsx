import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

interface AuthRouteProps {
  children: ReactElement;
}

export const AuthRoute = ({ children }: AuthRouteProps) => {
  const isAuth = true;
  return isAuth ? children : <Navigate to="/login" replace />;
};