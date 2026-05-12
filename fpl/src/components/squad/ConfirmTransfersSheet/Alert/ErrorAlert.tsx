import { Alert } from "plos/src/components/alerts";

interface ErrorAlertProps {
  errorCode: string;
}

const ErrorAlert = ({ errorCode }: ErrorAlertProps) => {
  if (!errorCode) return null;

  return (
    <Alert variant="error" isLiveRegion>
      {errorCode === "transfer_cap_exceeded" &&
        "Unable to confirm transfers as they will take you over the limit of 20 transfers in a single Gameweek."}
      {(errorCode === "transfer_element_in_price_mismatch" ||
        errorCode === "transfer_element_out_price_mismatch") &&
        "Unable to confirm transfers as player prices have changed. Please refresh the page and try again."}
    </Alert>
  );
};

export default ErrorAlert;
