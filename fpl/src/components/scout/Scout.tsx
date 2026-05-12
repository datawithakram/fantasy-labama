// import Subheading from "plos/src/components/Subheading";
// import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
// import WscStoriesWidget from "../wsc/WscStoriesWidget";
import PageTitle from "plos/src/components/PageTitle";
import { contentMain, pagePadding } from "plos/src/layouts";
import { breakpoints } from "plos/src/styles";
import { useEffect } from "react";
import { useTrackingContext } from "../../contexts/TrackingContext";
import { HelmetHead } from "../HelmetHead";
import { NewsPlaylist } from "../news/NewsPlaylist";
import { NewsSection } from "../news/NewsSection";
import { NewsTagExpressionList } from "../news/NewsTagExpressionList";
import ScoutErrorBoundary from "./ScoutErrorBoundary";
import ScoutNav from "./ScoutNav/ScoutNav";

export const Scout = () => {
  const { firePageViewEvent } = useTrackingContext();

  useEffect(() => {
    firePageViewEvent("fantasy scout");
  }, []);

  const scoutContentExpression =
    '("series:fantasy")and("content-creator:The-Scout")';

  return (
    <div className={pagePadding}>
      <HelmetHead
        title="The Scout, Fantasy Football Tips &amp; Advice | Fantasy Premier League"
        description="To get tips and find out about the latest form and stats for Fantasy Premier League players, read what The Scout has to say, on the official website of the Premier League."
      />
      <div className={contentMain}>
        <ScoutNav />
        <NewsSection>
          <>
            <PageTitle title="The Scout" />
            <NewsTagExpressionList
              layout="scrollableRow"
              tagExpression={scoutContentExpression}
              variant="scrollable"
            />
          </>
        </NewsSection>

        <NewsSection title="Latest FPL Videos">
          <NewsTagExpressionList
            contentType="VIDEO"
            layout="sixColGrid"
            tagExpression={scoutContentExpression}
          />
        </NewsSection>

        {/* TODO: Comment back in when we know how to handle no response data. See https://github.com/ismfg/games/pull/8240#issuecomment-3089258727 */}
        {/* <SurfaceContainer>
            <WscStoriesWidget labels="fpl_stories" />
        </SurfaceContainer> */}

        <NewsSection title="More FPL News">
          <NewsPlaylist
            // threeColGrid makes for large thumbnails on large screens, so we need to increase the sizes at some breakpoints
            // https://jakearchibald.com/2015/anatomy-of-responsive-images/#varying-size-and-density
            imgSizes={`(min-width: ${breakpoints[8]}) 600px, (min-width: ${breakpoints[5]}) 400px, 300px`}
            layout="threeColGrid"
            playlistId={4349941}
            variant="compact"
          />
        </NewsSection>
      </div>
    </div>
  );
};

const ScoutWrapper = () => (
  <ScoutErrorBoundary>
    <Scout />
  </ScoutErrorBoundary>
);

export default ScoutWrapper;
