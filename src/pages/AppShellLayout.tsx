import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppMenuBar } from "../components/AppMenuBar";
import { AppFooter } from "../components/AppFooter";
import { ThemeContext } from "../commons/context/ThemeContext";
import { useRemindersWebSocket } from "../commons/hooks/useRemindersWebSocket";

export const AppShellLayout = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.localStorage.getItem('theme-mode') !== 'light';
  });
  const navigate = useNavigate();
  const location = useLocation();

  useRemindersWebSocket();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    window.localStorage.setItem('theme-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark((v) => !v);

  return (
    <ThemeContext.Provider value={{ isDark, toggle }}>
      <main className="flex min-h-screen w-full flex-col">
        <AppMenuBar isDark={isDark} onToggleTheme={toggle} />
        <div className="mx-auto flex w-full flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
        <AppFooter />
        {location.pathname !== '/chat' && (
          <button
            type="button"
            onClick={() => navigate('/chat')}
            className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-assistant-gradient text-2xl text-white shadow-glow-assistant transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-assistant-500/40"
            title="Abrir Chat IA"
          >
            🚀
          </button>
        )}
      </main>
    </ThemeContext.Provider>
  );
};
