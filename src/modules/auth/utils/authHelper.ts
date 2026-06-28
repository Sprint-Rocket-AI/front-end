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

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as StoredOidcUser;
  } catch (error) {
    console.error("Error parsing OIDC user", error);
    return null;
  }
};

export const getToken = (): string | null => {
  const storedUser = getStoredOidcUser();
  return storedUser?.access_token ?? storedUser?.id_token ?? null;
};

export const getProfile = (): Record<string, unknown> | null => getStoredOidcUser()?.profile ?? null;