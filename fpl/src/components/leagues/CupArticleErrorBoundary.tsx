import { ErrorBoundary } from "@sentry/react";
import { ReactNode } from "react";

const CupArticleErrorBoundary = ({ children }: { children?: ReactNode }) => (
  <ErrorBoundary fallback={<p>Problem showing cup information.</p>}>
    {children}
  </ErrorBoundary>
);

export default CupArticleErrorBoundary;
