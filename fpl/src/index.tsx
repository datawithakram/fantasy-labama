// Sentry initialization should be imported first!
// https://docs.sentry.io/platforms/javascript/guides/react/#apply-instrumentation-to-your-app
import "./instrument";

import { captureException, ErrorBoundary } from "@sentry/react";
import configureStore from "core-integration/src/configureStore";
import { ErrorFallback } from "plos/src/components/ErrorFallback";
import { WebViewProvider } from "plos/src/contexts/WebViewContext";
import "react-app-polyfill/ie11";
import "react-app-polyfill/stable";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { initializeGtm } from "shared-utils/src/gtm";
import App from "./components/App";
import PingAuthProvider from "./components/ping/PingAuthProvider";
import * as serviceWorker from "./serviceWorker";

initializeGtm(import.meta.env.VITE_GTM_ID);

const container = document.getElementById("root")!;
const root = createRoot(container);

// Initialize store with error handling
// Errors during store initialization happen before React renders,
// so they won't be caught by ErrorBoundary
let store;
try {
  store = configureStore();
} catch (error) {
  // Report to Sentry since ErrorBoundary won't catch this
  const eventId = captureException(error);
  // Render error UI directly
  root.render(<ErrorFallback eventId={eventId} />);
  // Re-throw to prevent app from continuing in broken state
  throw error;
}

root.render(
  <ErrorBoundary
    fallback={({ eventId }) => <ErrorFallback eventId={eventId} />}
  >
    <BrowserRouter>
      <Provider store={store}>
        <PingAuthProvider>
          <WebViewProvider>
            <App />
          </WebViewProvider>
        </PingAuthProvider>
      </Provider>
    </BrowserRouter>
  </ErrorBoundary>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
