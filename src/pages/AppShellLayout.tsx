import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { AppMenuBar } from "../components/AppMenuBar";

export const AppShellLayout = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.localStorage.getItem("theme-mode") !== "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    window.localStorage.setItem("theme-mode", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <main className="flex min-h-screen w-full flex-col gap-6">
      <AppMenuBar isDark={isDark} onToggleTheme={() => setIsDark((value) => !value)} />
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 pb-4 sm:px-6 sm:pb-6 lg:max-w-[80vw] lg:px-8 lg:pb-8 2xl:max-w-[1600px]">
        <Outlet />
      </div>
    </main>
  );
};