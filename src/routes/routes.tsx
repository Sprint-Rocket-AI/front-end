import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { ChatIAPage } from "../modules/chat/pages/ChatIAPage";
import { APP_ROLES } from "../modules/auth/utils/roles";
import { LoginPage } from "../modules/auth/pages/LoginPage";
import { AppShellLayout } from "../pages/AppShellLayout";
import { DiagramPage } from "../pages/DiagramPage";
import { DiagramsListPage } from "../pages/DiagramsListPage";
import { DocumentsPage } from "../pages/DocumentsPage";
import { HomePage } from "../pages/HomePage";
import { AuthRoute } from "./AuthRoute";
import { useCognitoSession } from "../modules/auth/services/cognitoAuthService";

const ContextBuilderModule = lazy(() => import("../modules/context-builder/ContextBuilderModule"));

const LoginRoute = () => {
  const auth = useCognitoSession();

  if (auth.isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <LoginPage />;
};

export const routes = [
  {
    path: "/login",
    element: <LoginRoute />,
  },
  {
    path: "/",
    element: (
      <AuthRoute>
        <AppShellLayout />
      </AuthRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="home" replace />,
      },
      {
        path: "home",
        element: <HomePage />,
      },
      {
        path: "documents/builder",
        element: (
          <AuthRoute allowedRoles={[APP_ROLES.ADMIN]}>
            <Suspense
              fallback={
                <div className="panel flex min-h-[240px] items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-300">
                  Cargando Context Builder...
                </div>
              }
            >
              <ContextBuilderModule />
            </Suspense>
          </AuthRoute>
        ),
      },
      {
        path: "documents/view",
        element: (
          <AuthRoute allowedRoles={[APP_ROLES.ADMIN]}>
            <DocumentsPage />
          </AuthRoute>
        ),
      },
      {
        path: "diagrams",
        element: (
          <AuthRoute allowedRoles={[APP_ROLES.ADMIN, APP_ROLES.DEV]}>
            <DiagramsListPage />
          </AuthRoute>
        ),
      },
      {
        path: "diagram/:id",
        element: (
          <AuthRoute allowedRoles={[APP_ROLES.ADMIN, APP_ROLES.DEV]}>
            <DiagramPage />
          </AuthRoute>
        ),
      },
    ],
  },
  {
    path: "/chat/:sessionId?",
    element: (
      <AuthRoute allowedRoles={[APP_ROLES.ADMIN, APP_ROLES.DEV]}>
        <ChatIAPage />
      </AuthRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];

export const AppRouter = () => useRoutes(routes);
