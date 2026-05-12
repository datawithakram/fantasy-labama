import { ErrorBoundary } from "@sentry/react";
import { contentMain } from "plos/src/layouts";
import { ReactNode } from "react";

const ScoutErrorFallback = () => (
  <div className={contentMain}>
    <h4>Problem showing scout content.</h4>
  </div>
);

const ScoutErrorBoundary = ({ children }: { children?: ReactNode }) => (
  <ErrorBoundary fallback={<ScoutErrorFallback />}>{children}</ErrorBoundary>
);

export default ScoutErrorBoundary;
