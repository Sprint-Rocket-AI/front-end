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

const userManager = new UserManager({
  ...cognitoAuthConfig,
  automaticSilentRenew: true,
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

  console.log("[cognitoAuthService] initializeSession:start", {
    pathname: window.location.pathname,
    search: window.location.search,
    hasStoredUser: Boolean(storedUser),
    isSigninCallback: new URLSearchParams(window.location.search).has("code") && new URLSearchParams(window.location.search).has("state"),
  });

  initPromise = userManager.getUser()
    .then((user) => {
      console.log("[cognitoAuthService] initializeSession:getUser", {
        hasUser: Boolean(user),
        expired: user?.expired ?? null,
        profileKeys: user?.profile ? Object.keys(user.profile) : [],
      });

      currentSession = {
        isAuthenticated: Boolean(user && !user.expired),
        isLoading: false,
        error: null,
        profile: (user?.profile as Record<string, unknown> | undefined) ?? null,
      };

      console.log("[cognitoAuthService] initializeSession:resolved", currentSession);
      initialized = true;
      emitChange();
    })
    .catch((error: unknown) => {
      console.log("[cognitoAuthService] initializeSession:error", error);
      currentSession = {
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Error cargando sesión",
        profile: null,
      };

      console.log("[cognitoAuthService] initializeSession:fallback", currentSession);
      initialized = true;
      emitChange();
    });

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

export const login = () => userManager.signinRedirect();

export const logout = () =>
  userManager.signoutRedirect({ post_logout_redirect_uri: logoutUri });

export const getRoles = (profile?: Record<string, unknown> | null): AppRole[] => getUserRoles(profile);

export const validateRole = (profile: Record<string, unknown> | null | undefined, allowedRoles: readonly AppRole[]) =>
  getUserRoles(profile).some((role) => allowedRoles.includes(role));

export { getToken };