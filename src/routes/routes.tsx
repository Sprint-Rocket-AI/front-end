import { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import { AuthRoute } from "./AuthRoute";

const ContextBuilderModule = lazy(() => import("../modules/context-builder/ContextBuilderModule"));

export const routes = [
  {
    path: "/",
    element: (
      <AuthRoute>
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-300">
              Loading Context Builder...
            </div>
          }
        >
          <ContextBuilderModule />
        </Suspense>
      </AuthRoute>
    ),
  },
];

export const AppRouter = () => useRoutes(routes);