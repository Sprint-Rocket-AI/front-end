import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { DocumentsPage } from "../pages/DocumentsPage";
import { HomePage } from "../pages/HomePage";
import { AppShellLayout } from "../pages/AppShellLayout";
import { AuthRoute } from "./AuthRoute";

const ContextBuilderModule = lazy(() => import("../modules/context-builder/ContextBuilderModule"));

export const routes = [
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
        element: <HomePage />,
      },
      {
        path: "context-builder",
        element: <Navigate to="/documents/builder" replace />,
      },
      {
        path: "documents",
        element: <Navigate to="/documents/builder" replace />,
      },
      {
        path: "documents/builder",
        element: (
          <Suspense
            fallback={
              <div className="panel flex min-h-[240px] items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-300">
                Cargando Context Builder...
              </div>
            }
          >
            <ContextBuilderModule />
          </Suspense>
        ),
      },
      {
        path: "documents/view",
        element: <DocumentsPage />,
      },
    ],
  },
];

export const AppRouter = () => useRoutes(routes);