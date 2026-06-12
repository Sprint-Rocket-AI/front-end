import { Suspense, lazy } from "react";
import { useRoutes } from "react-router-dom";
import { DocumentsPage } from "../pages/DocumentsPage";
import { DiagramPage } from "../pages/DiagramPage";
import { DiagramsListPage } from "../pages/DiagramsListPage";
import { HomePage } from "../pages/HomePage";
import { AppShellLayout } from "../pages/AppShellLayout";
import { ChatIAPage } from "../pages/ChatIAPage";
import { AuthRoute } from "./AuthRoute";

const ContextBuilderModule = lazy(() => import("../modules/context-builder/ContextBuilderModule"));
const CheckpointModule = lazy(() => import("../modules/checkpoint/CheckpointModule"));

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
        path: "checkpoint",
        element: (
          <Suspense
            fallback={
              <div className="panel flex min-h-[240px] items-center justify-center text-sm font-medium text-slate-500 dark:text-slate-300">
                Cargando Checkpoint...
              </div>
            }
          >
            <CheckpointModule />
          </Suspense>
        ),
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
      {
        path: "chat",
        element: <ChatIAPage />,
      }
    ],
  },
];

export const AppRouter = () => useRoutes(routes);