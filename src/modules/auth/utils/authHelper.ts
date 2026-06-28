import { cognitoAuthConfig } from "../config/cognitoConfig";

export type StoredOidcUser = {
  access_token?: string;
  id_token?: string;
  profile?: Record<string, unknown>;
  expired?: boolean;
};

export const getOidcStorageKey = () =>
  `oidc.user:${cognitoAuthConfig.authority}:${cognitoAuthConfig.client_id}`;

export const getStoredOidcUser = (): StoredOidcUser | null => {
  const storedUser = window.localStorage.getItem(getOidcStorageKey());

  console.log("[authHelper] getStoredOidcUser", {
    storageKey: getOidcStorageKey(),
    found: Boolean(storedUser),
  });

  if (!storedUser) {
    return null;
  }

  try {
    const parsedUser = JSON.parse(storedUser) as StoredOidcUser;

    console.log("[authHelper] parsed OIDC user", {
      hasAccessToken: Boolean(parsedUser.access_token),
      hasIdToken: Boolean(parsedUser.id_token),
      expired: parsedUser.expired,
      profileKeys: parsedUser.profile ? Object.keys(parsedUser.profile) : [],
    });

    return parsedUser;
  } catch (error) {
    console.error("[authHelper] Error parsing OIDC user", error);
    return null;
  }
};

export const getToken = (): string | null => {
  const storedUser = getStoredOidcUser();
  const token = storedUser?.access_token ?? storedUser?.id_token ?? null;

  console.log("[authHelper] getToken", {
    hasToken: Boolean(token),
    tokenSource: storedUser?.access_token ? "access_token" : storedUser?.id_token ? "id_token" : null,
  });

  return token;
};

export const getProfile = (): Record<string, unknown> | null => getStoredOidcUser()?.profile ?? null;