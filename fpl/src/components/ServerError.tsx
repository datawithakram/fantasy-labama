import { IServerError } from "core-integration/src/store/global/types";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { contentMain } from "plos/src/layouts";
import * as React from "react";
import { UpdatingContent } from "./news/UpdatingContent";

interface IProps {
  error: IServerError;
}

const HomeOrHelp = () => (
  <p>
    You can return to the <a href="/">home page</a> and try again or{" "}
    <a href="/help">contact us</a> for further help.
  </p>
);

const renderError = (e: IServerError) => {
  switch (e.code) {
    case 401:
    case 403:
      return (
        <div className={contentMain}>
          <h4>Permission denied</h4>
          <p>
            Sorry, but you don't have permission to perform the request action.
          </p>
          <HomeOrHelp />
        </div>
      );
    case 404:
      return (
        <div className={contentMain}>
          <h4>Page not found</h4>
          <p>Sorry, but the page you were looking for can't be found.</p>
          <HomeOrHelp />
        </div>
      );
    case 502:
    case 503:
    case 504:
      return e.details.match(/being updated/) ? (
        <UpdatingContent />
      ) : (
        <div className={contentMain}>
          <h4>Unavailable</h4>
          <p>
            Sorry, but we are unable to load the requested page at this time.
          </p>
          <p>Please try again in a few minutes.</p>
        </div>
      );
    default:
      return (
        <div className={contentMain}>
          <h2>Error</h2>
          <p>
            Sorry, but there has been an unexpected error processing your
            request.
          </p>
          <HomeOrHelp />
        </div>
      );
  }
};

const ServerError: React.FC<IProps> = ({ error }) => {
  return <SurfaceContainer>{renderError(error)}</SurfaceContainer>;
};

export default ServerError;
