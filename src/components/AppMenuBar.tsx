import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface AppMenuBarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const documentSubmenuItems = [
  { to: "/documents/builder", label: "Builder" },
  { to: "/documents/view", label: "Ver documentos" },
];

export const AppMenuBar = ({ isDark, onToggleTheme }: AppMenuBarProps) => {
  const location = useLocation();
  const isDocumentsSection = location.pathname.startsWith("/documents");
  const [isDocumentsMenuOpen, setIsDocumentsMenuOpen] = useState(false);

  useEffect(() => {
    setIsDocumentsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:max-w-[80vw] lg:flex-row lg:items-center lg:justify-between lg:px-8 2xl:max-w-[1600px]">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-1 lg:flex-row lg:items-center lg:gap-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-500">Sprint Rocket.AI</p>
            <h1 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">Workspace DUOC</h1>
          </div>

          <nav className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <div className="flex flex-wrap items-center gap-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  [
                    "inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-orange-200 hover:text-orange-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500/20 dark:hover:text-orange-200",
                  ].join(" ")
                }
              >
                Inicio
              </NavLink>
              
              <NavLink
                to="/diagrams"
                className={({ isActive }) =>
                  [
                    "inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold transition",
                    isActive
                      ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-orange-200 hover:text-orange-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500/20 dark:hover:text-orange-200",
                  ].join(" ")
                }
              >
                Diagramas
              </NavLink>
            </div>

            <div className="relative">
              <button
                type="button"
                className={[
                  "inline-flex w-full items-center justify-between gap-3 rounded-full border px-4 py-2 text-sm font-semibold transition sm:w-auto",
                  isDocumentsSection || isDocumentsMenuOpen
                    ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:border-orange-200 hover:text-orange-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500/20 dark:hover:text-orange-200",
                ].join(" ")}
                onClick={() => setIsDocumentsMenuOpen((value) => !value)}
                aria-expanded={isDocumentsMenuOpen}
                aria-haspopup="menu"
              >
                <span>Documentos</span>
                <span className="text-[10px] opacity-70">{isDocumentsMenuOpen ? "▲" : "▼"}</span>
              </button>

              {isDocumentsMenuOpen && (
                <div className="mt-2 flex flex-col gap-2 rounded-[1.25rem] border border-slate-200 bg-white p-2 shadow-lg dark:border-slate-800 dark:bg-slate-950 sm:absolute sm:left-0 sm:mt-3 sm:min-w-[220px] sm:p-3">
                  {documentSubmenuItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        [
                          "inline-flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition",
                          isActive
                            ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-orange-200 hover:text-orange-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500/20 dark:hover:text-orange-200",
                        ].join(" ")
                      }
                    >
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-end">
          <button type="button" className="action-secondary w-full sm:w-auto" onClick={onToggleTheme}>
            {isDark ? "Cambiar a claro" : "Cambiar a oscuro"}
          </button>
        </div>
      </div>
    </header>
  );
};