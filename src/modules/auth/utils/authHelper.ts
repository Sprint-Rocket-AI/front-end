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
    const parsedUser = JSON.parse(storedUser) as StoredOidcUser;

    return parsedUser;
  } catch (error) {
    console.error("[authHelper] Error parsing OIDC user", error);
    return null;
  }
};

export const getToken = (): string => {
  const storedUser = getStoredOidcUser();
  const token =  storedUser?.id_token;

  if (!token) {
    throw new Error("No se encontró token");
  }

  return `Bearer ${token}`;
};

export const getProfile = (): Record<string, unknown> | null => getStoredOidcUser()?.profile ?? null;