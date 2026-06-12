const footerLinks = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "API Docs", href: "#" },
];

export const AppFooter = () => {
  return (
    <footer className="mt-auto w-full border-t border-accent-500/10 bg-ink-950/60 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center justify-between gap-2 px-4 py-5 text-sm sm:flex-row sm:px-6 lg:px-8">
        <p className="text-slate-500 dark:text-slate-400">
          <span className="font-bold uppercase tracking-[0.18em] text-orange-500">Sprint Rocket AI</span>
          <span className="mx-2 text-slate-600">·</span>
          <span className="font-mono text-xs text-slate-500">© 2026 Built for high-velocity teams.</span>
        </p>
        <nav className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-500 transition-colors hover:text-slate-200 dark:text-slate-400"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
};
