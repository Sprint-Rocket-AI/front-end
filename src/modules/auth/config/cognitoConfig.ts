export const cognitoAuthConfig = {
  authority: import.meta.env.VITE_COGNITO_AUTHORITY ?? "https://cognito-idp.us-east-2.amazonaws.com/us-east-2_LvTgAG5Ke",
  client_id: import.meta.env.VITE_COGNITO_CLIENT_ID ?? "43a8bmfjfvabop9im3tikd56lv",
  redirect_uri: import.meta.env.VITE_COGNITO_REDIRECT_URI ?? "https://d84l1y8p4kdic.cloudfront.net",
  response_type: "code",
  scope: "phone openid email",
};

export const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN ?? "https://workspace-duoc.auth.us-east-2.amazoncognito.com";
export const logoutUri = import.meta.env.VITE_COGNITO_LOGOUT_URI ?? "https://d84l1y8p4kdic.cloudfront.net";
