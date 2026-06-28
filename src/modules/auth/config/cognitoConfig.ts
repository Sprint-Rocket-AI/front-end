export const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY,
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI,
  response_type: "code",
  scope: "phone openid email",
};

export const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
export const logoutUri = import.meta.env.VITE_COGNITO_LOGOUT_URI;
