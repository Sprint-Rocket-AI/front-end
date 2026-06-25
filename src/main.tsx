import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { AuthProvider } from "react-oidc-context";
import App from "./App";
import "./index.css";
import { store } from "./store/store";
import { cognitoAuthConfig } from "./modules/auth/config/cognitoConfig";

const onSigninCallback = (): void => {
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider {...cognitoAuthConfig} onSigninCallback={onSigninCallback}>
        <App />
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
