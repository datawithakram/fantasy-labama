import { Alert } from "plos/src/components/alerts";

const LatestAlert = () => {
  const showAlert = false;
  if (!showAlert) {
    return null;
  }
  return (
    <Alert variant="default" isContentCentered>
      Gameweek 17 will remain open after the conclusion of Sunday’s matches.
      More information will follow in due course.
    </Alert>
  );
};

export default LatestAlert;
