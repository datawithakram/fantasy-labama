import { ThunkDispatch } from "core-integration/src/store";
import { getEvents } from "core-integration/src/store/events/reducers";
import { getFixturesByEvent } from "core-integration/src/store/fixtures/reducers";
import { fetchFixturesFuture } from "core-integration/src/store/fixtures/thunks";
import {
  getTeams,
  getTeamsById,
} from "core-integration/src/store/teams/reducers";
import PageTitle from "plos/src/components/PageTitle";
import Subheading from "plos/src/components/Subheading";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { WebViewContext } from "plos/src/contexts/WebViewContext";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTrackingContext } from "../../contexts/TrackingContext";
import { FixturesToggle } from "../Fixtures/FixturesToggle";
import { fixturePage } from "../Fixtures/fixturesWrapper.css";
import { HelmetHead } from "../HelmetHead";
import {
  displayMessageStyles,
  explainerContainerStyles,
  headerContainerStyles,
  tableWrapperStyles,
} from "./fdrContainer.css";
import FDRKey from "./FDRKey";
import FDRTableNav from "./FDRTableNav";
import { formatFixturesByEventAndTeam, sortTeamsByEventDiff } from "./helpers";
import { COLUMN_WIDTH, FDRTable, useHorizontalColumnScroll } from "./FDRTable";
import { IFixturesWithDifficultyByEventAndTeam } from "./types";

const FDRContainer = () => {
  const reduxDispatch = useDispatch<ThunkDispatch>();
  const teams = useSelector(getTeams);
  const teamsById = useSelector(getTeamsById);
  const events = useSelector(getEvents);
  const fixturesByEvent = useSelector(getFixturesByEvent);

  const [teamFixtures, setTeamFixtures] =
    useState<IFixturesWithDifficultyByEventAndTeam>({});
  const [sortedTeams, setSortedTeams] = useState(teams);
  const [activeHeadingIndex, setActiveEventId] = useState(0);

  const nextEventIndex = events.findIndex((event) => event.is_next);
  const filteredEvents =
    nextEventIndex !== -1 ? events.slice(nextEventIndex) : undefined;

  const { firePageViewEvent } = useTrackingContext();

  useEffect(() => {
    firePageViewEvent("fantasy fixtures & fdr", "fdr view");
  }, []);

  const { isWebView } = useContext(WebViewContext);

  useEffect(() => {
    reduxDispatch(fetchFixturesFuture());
  }, [reduxDispatch]);

  useEffect(() => {
    if (Object.keys(fixturesByEvent).length) {
      setTeamFixtures(formatFixturesByEventAndTeam(fixturesByEvent));
    }
  }, [fixturesByEvent]);

  function handleHeadingSort(eventId: number, sortType: string) {
    setActiveEventId(eventId);
    setSortedTeams(
      sortTeamsByEventDiff(teamFixtures, eventId, sortType, sortedTeams)
    );
  }

  const { wrapperRef, canScrollPrev, canScrollNext, scrollByColumn } =
    useHorizontalColumnScroll(COLUMN_WIDTH);

  return (
    <>
      <HelmetHead
        title="Fixture Difficulty Rating | Fantasy Premier League"
        description="For help planning your FPL transfer and team selection strategy, view our fixture difficulty rating (FDR). For more information, visit the official website of the Premier League."
      />
      <main className={fixturePage}>
        {!isWebView && (
          <>
            <PageTitle title="Fixtures & Results" />
            <FixturesToggle selected="fdr" />
          </>
        )}

        {filteredEvents ? (
          <div className={tableWrapperStyles}>
            <div className={headerContainerStyles}>
              <FDRKey />
              <FDRTableNav
                showPrevBtn={canScrollPrev}
                showNextBtn={canScrollNext}
                onHandlePrevClick={() => scrollByColumn("prev")}
                onHandleNextClick={() => scrollByColumn("next")}
              />
            </div>
            <SurfaceContainer>
              <FDRTable
                activeHeadingIndex={activeHeadingIndex}
                onHeadingSort={handleHeadingSort}
                teams={sortedTeams}
                events={filteredEvents}
                teamFixtures={teamFixtures}
                teamsById={teamsById}
                ref={wrapperRef}
              />
            </SurfaceContainer>
          </div>
        ) : (
          <div className={displayMessageStyles}>
            <Subheading>Fixture Difficulty Rating (FDR)</Subheading>
            <p>
              The FDR table will display here when next season's Fantasy Premier
              League game is live.
            </p>
          </div>
        )}

        <SurfaceContainer>
          <div className={explainerContainerStyles}>
            <Subheading>FDR Explained</Subheading>
            <p>
              The FDR is based on a complex algorithm developed by FPL experts.
            </p>
            <p>
              A set of formulas process key Opta data variables, along with each
              team's home and away form for the past six matches, to generate a
              rank for the perceived difficulty of each Gameweek opponent.
            </p>
            <p>
              The FDR is designed to help FPL managers plan their transfer and
              team selection strategy. It is reviewed on a weekly basis and
              updated as the season progresses.
            </p>
          </div>
        </SurfaceContainer>
      </main>
    </>
  );
};

export default FDRContainer;
