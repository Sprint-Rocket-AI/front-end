import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import { DocumentsPage } from "../pages/DocumentsPage";
import { DiagramPage } from "../pages/DiagramPage";
import { DiagramsListPage } from "../pages/DiagramsListPage";
import { HomePage } from "../pages/HomePage";
import { AppShellLayout } from "../pages/AppShellLayout";
import { ChatIAPage } from "../modules/chat/pages/ChatIAPage";
import { AuthRoute } from "./AuthRoute";
import { LoginPage } from "../modules/auth/pages/LoginPage";

const ContextBuilderModule = lazy(() => import("../modules/context-builder/ContextBuilderModule"));

export const routes = [
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      // <AuthRoute>
      <AppShellLayout />
      // </AuthRoute>
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
      {
        path: "diagrams",
        element: <DiagramsListPage />,
      },
      {
        path: "diagram/:id",
        element: <DiagramPage />,
      },
    ],
  },
  {
    path: "/chat/:sessionId?",
    element: (
      <AuthRoute>
        <ChatIAPage />
      </AuthRoute>
    ),
  },
];

export const AppRouter = () => useRoutes(routes);
