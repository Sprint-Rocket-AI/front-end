import { useEffect, useSyncExternalStore } from "react";
import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { cognitoAuthConfig, logoutUri } from "../config/cognitoConfig";
import { getStoredOidcUser, getToken } from "../utils/authHelper";
import { getUserRoles, type AppRole } from "../utils/roles";

type CognitoSession = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  profile: Record<string, unknown> | null;
};

type OidcUser = Awaited<ReturnType<typeof userManager.getUser>>;

const userManager = new UserManager({
  ...cognitoAuthConfig,
  automaticSilentRenew: true,
  stateStore: new WebStorageStateStore({ store: window.localStorage }),
  userStore: new WebStorageStateStore({ store: window.localStorage }),
});

let currentSession: CognitoSession = {
  isAuthenticated: false,
  isLoading: true,
  error: null,
  profile: null,
};

const listeners = new Set<() => void>();
let initialized = false;
let initPromise: Promise<void> | null = null;
const storedUser = getStoredOidcUser();

const hasSigninCallback = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.has("code") && searchParams.has("state");
};

const syncSessionFromUser = (user: OidcUser) => {
  currentSession = {
    isAuthenticated: Boolean(user && !user.expired),
    isLoading: false,
    error: null,
    profile: (user?.profile as Record<string, unknown> | undefined) ?? null,
  };
};

const resolveCurrentUser = async () => {
  if (!hasSigninCallback()) {
    return userManager.getUser();
  }

  await userManager.signinRedirectCallback(window.location.href);
  window.history.replaceState({}, document.title, window.location.pathname);
  return userManager.getUser();
};

if (storedUser) {
  currentSession = {
    isAuthenticated: true,
    isLoading: false,
    error: null,
    profile: storedUser.profile ?? null,
  };
}

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

const updateSession = (partial: Partial<CognitoSession>) => {
  currentSession = { ...currentSession, ...partial };
  emitChange();
};

userManager.events.addUserLoaded((user) => {
  updateSession({
    isAuthenticated: true,
    isLoading: false,
    error: null,
    profile: (user.profile as Record<string, unknown> | undefined) ?? null,
  });
});

userManager.events.addUserUnloaded(() => {
  updateSession({
    isAuthenticated: false,
    isLoading: false,
    profile: null,
  });
});

userManager.events.addSilentRenewError((error) => {
  updateSession({ error: error?.message ?? "Error renovando sesión" });
});

const initializeSession = () => {
  if (initialized) {
    return Promise.resolve();
  }

  if (initPromise) {
    return initPromise;
  }

  updateSession({ isLoading: true });

  initPromise = (async () => {
    try {
      const user = await resolveCurrentUser();

      syncSessionFromUser(user);
    } catch (error: unknown) {
      currentSession = {
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Error cargando sesión",
        profile: null,
      };
    } finally {
      initialized = true;
      emitChange();
    }
  })();

  return initPromise;
};

export const initializeCognitoSession = () => initializeSession();

export const subscribeCognitoSession = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getCognitoSessionSnapshot = (): CognitoSession => currentSession;

export const useCognitoSession = (): CognitoSession => {
  useEffect(() => {
    void initializeSession();
  }, []);

  return useSyncExternalStore(subscribeCognitoSession, getCognitoSessionSnapshot, getCognitoSessionSnapshot);
};

export const login = () => userManager.signinRedirect({ extraQueryParams: { lang: "es" } });

export const logout = () =>
  userManager.signoutRedirect({ post_logout_redirect_uri: logoutUri });

export const getRoles = (profile?: Record<string, unknown> | null): AppRole[] => getUserRoles(profile);

export const validateRole = (profile: Record<string, unknown> | null | undefined, allowedRoles: readonly AppRole[]) =>
  getUserRoles(profile).some((role) => allowedRoles.includes(role));

export { getToken };