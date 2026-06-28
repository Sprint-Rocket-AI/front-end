import { login, useCognitoSession } from "../services/cognitoAuthService";

export const LoginPage = () => {
  const auth = useCognitoSession();

  const handleLogin = () => {
    login();
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 transition-colors duration-300 dark:bg-ink-950">
      {/* Decorative ambient background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-accent-500/10 blur-[120px] dark:bg-accent-500/15" />
        <div className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-assistant-500/5 blur-[120px] dark:bg-assistant-500/10" />
      </div>

      <div className="panel w-full max-w-md relative z-10 animate-slide-up">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-orange-500 block mb-2 animate-pulse">
            Sprint Rocket.AI
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Workspace DUOC
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Plataforma de desarrollo y gestión de actividades
          </p>
        </div>

        {auth.error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
            <span className="font-semibold">Error al iniciar sesión:</span> {auth.error}
          </div>
        )}

        <div className="space-y-4">
          <button
            type="button"
            onClick={handleLogin}
            disabled={auth.isLoading}
            className="action-primary w-full flex items-center justify-center gap-3 py-3.5 shadow-glow-rocket"
          >
            {auth.isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Conectando con Cognito...</span>
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Iniciar Sesión con Cognito</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Ingresa usando tus credenciales institucionales de AWS Cognito
          </p>
        </div>
      </div>
    </div>
  );
};
