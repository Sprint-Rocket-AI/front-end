import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

interface AppMenuBarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const navItems = [
  { to: "/", label: "Inicio", end: true },
  { to: "/diagrams", label: "Diagramas", end: false },
];

const documentSubmenuItems = [
  { to: "/documents/builder", label: "Builder" },
  { to: "/documents/view", label: "Ver documentos" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  ["nav-link", isActive ? "nav-link-active" : ""].join(" ");

export const AppMenuBar = ({ isDark, onToggleTheme }: AppMenuBarProps) => {
  const location = useLocation();
  const isDocumentsSection = location.pathname.startsWith("/documents");
  const [isDocumentsMenuOpen, setIsDocumentsMenuOpen] = useState(false);
  const docsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDocumentsMenuOpen(false);
  }, [location.pathname]);

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (docsRef.current && !docsRef.current.contains(e.target as Node)) {
        setIsDocumentsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white/95 backdrop-blur-lg transition-colors duration-300 dark:border-accent-500/10 dark:bg-ink-950/95">
      <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        {/* Marca */}
        <div className="flex min-w-0 items-center gap-8">
          <NavLink to="/" className="flex flex-col leading-tight">
            <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-orange-500">
              Sprint Rocket.AI
            </span>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Workspace DUOC
            </span>
          </NavLink>

          {/* Navegación */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}

            <div className="relative" ref={docsRef}>
              <button
                type="button"
                onClick={() => setIsDocumentsMenuOpen((v) => !v)}
                aria-expanded={isDocumentsMenuOpen}
                aria-haspopup="menu"
                className={["nav-link gap-1.5", isDocumentsSection ? "nav-link-active" : ""].join(" ")}
              >
                Documentos
                <span className="text-[9px] opacity-60">{isDocumentsMenuOpen ? "▲" : "▼"}</span>
              </button>

              {isDocumentsMenuOpen && (
                <div className="absolute left-0 top-full mt-3 flex min-w-[220px] flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg backdrop-blur-xl transition-colors duration-300 dark:border-accent-500/20 dark:bg-ink-900/95 dark:shadow-elevated animate-fade-in">
                  {documentSubmenuItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        [
                          "rounded-xl px-4 py-2.5 text-sm font-medium transition",
                          isActive
                            ? "bg-orange-50 text-orange-600 dark:bg-accent-500/15 dark:text-accent-300"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-100",
                        ].join(" ")
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Acciones derecha */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            className="action-ghost !border-slate-200 !text-slate-600 hover:!bg-slate-50 dark:!border-white/10 dark:!bg-white/5 dark:!text-slate-200 dark:hover:!border-accent-500/40 dark:hover:!bg-white/10"
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-assistant-gradient text-sm font-bold text-white shadow-glow-assistant">
            JD
          </div>
        </div>
      </div>

      {/* Navegación móvil */}
      <nav className="flex items-center gap-5 overflow-x-auto border-t border-slate-200 px-4 py-2 transition-colors duration-300 dark:border-accent-500/10 lg:hidden">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
            {item.label}
          </NavLink>
        ))}
        <NavLink to="/documents/builder" className={navLinkClass}>
          Documentos
        </NavLink>
      </nav>
    </header>
  );
};
