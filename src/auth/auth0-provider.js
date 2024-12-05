import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const getBaseUrl = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://mudassar2107.github.io/News-Aggregator-Web-App'
    : 'http://localhost:3000';
};

export function Auth0ProviderWithNavigate({ children }) {
  const navigate = useNavigate();

  const domain = "dev-hef6f3vawycrww1i.us.auth0.com";
  const clientId = "G5AHWNj066xuXrwPrRSBgoi0A7Opojqo";

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || '/');
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: process.env.NODE_ENV === 'production'
          ? 'https://mudassar2107.github.io/News-Aggregator-Web-App/#/'
          : 'http://localhost:3000/#/',
        scope: "openid profile email"
      }}
      onRedirectCallback={onRedirectCallback}
      logoutParams={{
        returnTo: process.env.NODE_ENV === 'production'
          ? 'https://mudassar2107.github.io/News-Aggregator-Web-App/#/signin'
          : 'http://localhost:3000/#/signin',
        client_id: clientId
      }}
    >
      {children}
    </Auth0Provider>
  );
}

export default Auth0ProviderWithNavigate;