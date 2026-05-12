import { Fixtures } from "plos/src/components/Fixtures";
import PageTitle from "plos/src/components/PageTitle";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { useEffect } from "react";
import { useParams } from "react-router";
import { useTrackingContext } from "../../contexts/TrackingContext";
import { HelmetHead } from "../HelmetHead";
import { FixturesToggle } from "./FixturesToggle";
import { fixturePage } from "./fixturesWrapper.css";

const FixturesWrapper = () => {
  const { eventId = 0 } = useParams();

  const { firePageViewEvent } = useTrackingContext();

  useEffect(() => {
    firePageViewEvent("fantasy fixtures & fdr", "fixtures view");
  }, []);

  return (
    <>
      <HelmetHead
        title="View Latest Premier League Fixtures | Fantasy Premier League"
        description="To view the latest Gameweek fixtures and help choose your next Fantasy Premier League team, visit the official website of the Premier League."
      />
      <main className={fixturePage}>
        <PageTitle title="Fixtures & Results" />
        <FixturesToggle selected="fixtures" />
        <section>
          <SurfaceContainer>
            <Fixtures eventId={Number(eventId)} hideTitle />
          </SurfaceContainer>
        </section>
      </main>
    </>
  );
};

export default FixturesWrapper;
