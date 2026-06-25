import { cognitoAuthConfig } from "../config/cognitoConfig";

export const getOidcToken = (): string | null => {
  const { authority, client_id: clientId } = cognitoAuthConfig;
  const oidcKey = `oidc.user:${authority}:${clientId}`;
  const oidcUserStr = sessionStorage.getItem(oidcKey);
  
  if (oidcUserStr) {
    try {
      const oidcUser = JSON.parse(oidcUserStr);
      return oidcUser?.id_token || null;
    } catch (e) {
      console.error("Error parsing OIDC user", e);
    }
  }
  return null;
};

