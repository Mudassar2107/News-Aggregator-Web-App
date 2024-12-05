import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

export const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || '/');
  };

  const domain = "dev-hef6f3vawycrvw1i.us.auth0.com";
  const clientId = "G5AHWNj066xuXrwPrRSBgoi0A7Opojqo";
  
  // Get the base URL for GitHub Pages or localhost
  const getBaseUrl = () => {
    if (process.env.NODE_ENV === 'production') {
      return 'https://mudassar2107.github.io/News-Aggregator-Web-App';
    }
    return window.location.origin;
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: `${getBaseUrl()}/#/`,
      }}
      onRedirectCallback={onRedirectCallback}
      logoutParams={{
        returnTo: `${getBaseUrl()}/#/signin`
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;