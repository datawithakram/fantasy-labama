import { UNSAFE_PortalProvider } from "@react-aria/overlays";
import useScrollToTop from "core-integration/src/hooks/useScrollToTop";
import { ThunkDispatch } from "core-integration/src/store";
import { getBootstrapped } from "core-integration/src/store/bootstrap/reducers";
import { bootstrap } from "core-integration/src/store/bootstrap/thunks";
import { getServerError } from "core-integration/src/store/global/reducers";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { fetchRegions } from "core-integration/src/store/regions/thunks";
import FixtureBroadcasters from "plos/src/components/Fixtures/Fixture/FixtureBroadcasters";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { WebViewContext } from "plos/src/contexts/WebViewContext";
import { maxWidthContainer } from "plos/src/layouts";
import "plos/src/styles/globals.css";
import { darkTheme, lightTheme } from "plos/src/styles/theme.css";
import "./custom-colors.css";
import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useDispatch, useSelector } from "react-redux";
import { getCookie } from "shared-utils/src/cookies";
import { getSSOCookieName } from "shared-utils/src/ping";
import { AdobeProvider, useAdobeContext } from "../contexts/AdobeContext";
import { SaveProvider } from "../contexts/SaveContext";
import { TrackingProvider } from "../contexts/TrackingContext";
import "../fonts.css";
import { AdobePopupContainer } from "./AdobePopupContainer";
import CrestSheetManager from "./crestSheets/CrestSheet/CrestSheetManager";
import GameHeader from "./GameHeader";
import { AutoJoinDialog } from "./leagues/AutoJoinDialog";
import { getUser } from "./ping/PingAuthProvider";
import { PlayerProfileSheet } from "./PlayerSheets/PlayerProfileSheet";
import Routes from "./Routes";
import ServerError from "./ServerError";

export const Loading = () => (
  <SurfaceContainer>
    <p>Loading ...</p>
  </SurfaceContainer>
);

const App = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const [theme, setTheme] = useState(lightTheme);
  const overlayPortalRef = useRef<HTMLDivElement>(null);
  const { isWebView } = useContext(WebViewContext);
  const { ready } = useAdobeContext();

  const bootstrapped = useSelector(getBootstrapped);
  const player = useSelector(getPlayerData);
  const serverError = useSelector(getServerError);

  const auth = useAuth();

  const ssoCookieName = getSSOCookieName(isWebView);
  const global_sso_id = ssoCookieName ? getCookie(ssoCookieName) : "";

  // Seamless Login Logout
  useEffect(() => {
    if (ssoCookieName) {
      if (!auth.isLoading) {
        if (player && global_sso_id === "") {
          auth.signoutRedirect({
            post_logout_redirect_uri: `${window.location.origin}/`,
          });
        }
      }
    }
  }, [auth.isLoading, global_sso_id, player]);

  // Seamless Login Login
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const user = await getUser();

      if (cancelled) return;

      if (!auth.isLoading) {
        if (global_sso_id) {
          if (user) {
            // If user we check the ID of the User to the global_sso_id and if they don't match
            // we initialise our login flow
            if (user.profile.sub !== global_sso_id) {
              await auth.removeUser();
              auth.signinRedirect();
            }
          } else {
            // If no user but global_sso_id cookie exists, log the user in
            auth.signinRedirect();
          }
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [auth.isLoading, auth.user, global_sso_id]);

  useEffect(() => {
    if (!auth.isLoading) {
      // Bootstrap on initial render and when user changes (this handles when we redirect after Ping signin)
      dispatch(bootstrap());
      dispatch(fetchRegions());
    }
  }, [dispatch, auth.isLoading, auth.user]);

  useEffect(() => {
    // Check for system preference
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setTheme(prefersDark ? darkTheme : lightTheme);

    // Set up a listener for preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setTheme(e.matches ? darkTheme : lightTheme);
    };

    // Prefer modern API, fallback to old one
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Legacy API for older browsers/test environments
      (mediaQuery as any).addListener(handleChange);
    }

    // Clean up
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Legacy API for older browsers/test environments
        (mediaQuery as any).removeListener(handleChange);
      }
    };
  }, []);

  // Bootstrapped & Adobe SDK is ready (whether initialized or not)
  const loaded = !auth.isLoading && bootstrapped && ready;

  // Handle scroll restoration
  useScrollToTop();

  return (
    <React.StrictMode>
      <div className={theme}>
        <div className="ism">
          <AdobePopupContainer />
          <UNSAFE_PortalProvider getContainer={() => overlayPortalRef.current}>
            {!isWebView && <GameHeader />}
            {serverError ? (
              <ServerError error={serverError} />
            ) : loaded ? (
              <FixtureBroadcasters>
                <div className={maxWidthContainer}>
                  <Routes />
                </div>
              </FixtureBroadcasters>
            ) : (
              <Loading />
            )}
            <AutoJoinDialog />
            <PlayerProfileSheet />
            <CrestSheetManager />
          </UNSAFE_PortalProvider>
          <div id="overlay-portal" ref={overlayPortalRef} />
        </div>
      </div>
    </React.StrictMode>
  );
};

const AppContainer = () => {
  return (
    <AdobeProvider>
      <SaveProvider>
        <TrackingProvider>
          <App />
        </TrackingProvider>
      </SaveProvider>
    </AdobeProvider>
  );
};

export default AppContainer;
