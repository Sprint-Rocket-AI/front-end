import { NavLink } from "react-router-dom";

interface AppMenuBarProps {
  documentsCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

const navigationItems = [
  { to: "/", label: "Inicio" },
  { to: "/context-builder", label: "Builder" },
  { to: "/documents", label: "Documentos" },
];

export const AppMenuBar = ({ documentsCount, isDark, onToggleTheme }: AppMenuBarProps) => (
  <header className="panel sticky top-4 z-20 flex flex-col gap-4 border border-slate-200/80 bg-white/90 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:top-6 lg:flex-row lg:items-center lg:justify-between">
    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-orange-500">Context Builder</p>
        <h1 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">Workspace documental</h1>
      </div>

      <nav className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              [
                "inline-flex shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold transition",
                isActive
                  ? "border-orange-200 bg-orange-50 text-orange-600 dark:border-orange-500/20 dark:bg-orange-500/10 dark:text-orange-200"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-orange-200 hover:text-orange-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-orange-500/20 dark:hover:text-orange-200",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>

    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-end">
      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        {documentsCount} registros
      </span>
      <button type="button" className="action-secondary w-full sm:w-auto" onClick={onToggleTheme}>
        {isDark ? "Cambiar a claro" : "Cambiar a oscuro"}
      </button>
    </div>
  </header>
);