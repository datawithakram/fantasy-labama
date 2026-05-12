import { initSentry, SentryEnvironment } from "core-integration/src/sentry";

const sentryEnvironment = import.meta.env.VITE_SENTRY_ENVIRONMENT;

// In dev mode, check for test URL param to bypass URL filtering
const isTestMode =
  import.meta.env.DEV &&
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("testError") === "true";

const allowUrls = isTestMode
  ? undefined
  : [/premierleague\.com/, /ismgames\.com/];

if (sentryEnvironment) {
  initSentry({
    dsn: "https://81d88aa7bc0b46739acf531684529abf@o118622.ingest.us.sentry.io/1462585",
    environment: sentryEnvironment as SentryEnvironment,
    allowUrls,
    ignoreErrors: [
      /Unexpected token/,
      /from accessing a cross-origin frame/,
      /NetworkError when attempting to fetch/,
      /Failed to fetch/,
      /Unexpected end of input/,
      /Service Unavailable/,
      /contextMenuMessageHandler/,
      /find variable: webkit/,
      /NPObject deleted/,
      /touchDownX/,
      /SecurityError/,
      /ntp is not defined/,
      /Permission denied to access property/,
      /NPMethod called on non-NPObject/,
      /\[Immer\] minified error nr: 18 'ES5'/,
      /NoModificationAllowedError/,
      /Trust Tokens/,
      /send-redemption-record/,
      /GVLError/,
      /token-redemption/,
      /Importing a module script failed/,
      // TODO: Keep an eye on https://github.com/adobe/react-spectrum/pull/7742 and remove this once it's merged
      // See https://premierleague.atlassian.net/browse/FPL-1728 for more details
      /ResizeObserver loop completed with undelivered notifications/,
    ],
  });
}
