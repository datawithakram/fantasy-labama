import { User, UserManager, WebStorageStateStore } from "oidc-client-ts";
import React, { ReactNode } from "react";
import { AuthProvider } from "react-oidc-context";
import { getCookie } from "shared-utils/src/cookies";

// Set by the apps in a webview to facilitate seamless login
const appCookieName = "ACCESS_TOKEN";
const appCookieDomain = import.meta.env.VITE_APP_COOKIE_DOMAIN;

// Apply a random time between 5 and 3 minutes. This decreases the chances of there being
// concurrent attempts to refresh the token across multiple tabs.
const accessTokenExpiryTime = Math.floor(Math.random() * 121) + 180;

const userManager = new UserManager({
  authority: import.meta.env.VITE_OIDC_AUTHORITY,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  redirect_uri: `${window.location.origin}/`,
  scope: "openid profile email offline_access", // offline_access is required to refresh tokens
  post_logout_redirect_uri: `${window.location.origin}/`,
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTimeInSeconds: accessTokenExpiryTime,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
});

const isResourceOurAPI = (resource: RequestInfo | URL) => {
  const resourceUrl =
    resource instanceof Request ? resource.url : resource.toString();
  return RegExp(`^(${window.location.origin})?/api/`).test(resourceUrl);
};

const handleAuthIssue = async () => {
  await userManager.removeUser();
  document.cookie = `${appCookieName}=; max-age=0; path=/; domain=${appCookieDomain}; samesite=strict; secure`;
  window.location.href = "/";
  return null;
};

// Ensures getUser only runs one instance at a time and returns the same promise to all callers
let getUserPromise: Promise<User | null> | null = null;

export const getUser = async () => {
  if (getUserPromise) {
    return getUserPromise;
  }
  getUserPromise = (async () => {
    let user = await userManager.getUser();
    if (user) {
      // If renewal has failed for some reason then try here
      if (
        user.expired ||
        (user.expires_in && user.expires_in < accessTokenExpiryTime - 5)
      ) {
        user = await userManager.signinSilent().catch(handleAuthIssue);
      }
    }
    return user;
  })();

  try {
    return await getUserPromise;
  } finally {
    getUserPromise = null;
  }
};

// Monkey patch 'fetch' to add the authorization header to API requests
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  const [resource, config = {}] = args;
  const ourAPI = isResourceOurAPI(resource);
  if (ourAPI) {
    let accessToken;

    // First try and get an access token from a user we have logged in
    const user = await getUser();
    if (user) {
      accessToken = user.access_token;
    }

    // Then see if we can get one from a Cookie (app webview)
    if (!accessToken && document.cookie) {
      accessToken = getCookie(appCookieName);
    }

    // If we have one then pass it in the appropriate header. We have to jump
    // thoough a few hoops to do this due to various nuances of fetch args
    if (accessToken) {
      const header = "X-API-Authorization";
      const bearer = `Bearer ${accessToken}`;
      const resourceIsRequest = resource instanceof Request;
      if (resourceIsRequest) {
        resource.headers.append(header, bearer);
      }
      if (!resourceIsRequest || config.headers) {
        if (config.headers instanceof Headers) {
          config.headers.append(header, bearer);
        } else {
          config.headers = {
            ...config.headers,
            [header]: bearer,
          };
        }
      }
    }
  }

  const response = await originalFetch(resource, config);
  if (ourAPI) {
    if ([401, 403].includes(response.status)) {
      await handleAuthIssue();
    }
  }
  return response;
};

interface PingAuthProviderProps {
  children: ReactNode;
}

const PingAuthProvider: React.FC<PingAuthProviderProps> = ({ children }) => {
  const onSigninCallback = async () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  return (
    <AuthProvider userManager={userManager} onSigninCallback={onSigninCallback}>
      {children}
    </AuthProvider>
  );
};

export default PingAuthProvider;
