import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getCurrentEvent } from "core-integration/src/store/events/reducers";
import { fetchEventStatus } from "core-integration/src/store/events/thunks";
import {
  getClassicLeague,
  getClassicStandings,
} from "core-integration/src/store/leagues/reducers";
import { fetchClassicLeagueStandings } from "core-integration/src/store/leagues/thunks";
import Alert from "plos/src/components/alerts/Alert";
import MoreLink from "plos/src/components/links/MoreLink";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { rightSidebarLayout } from "plos/src/layouts";
import qs from "qs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import { useTrackingContext } from "../../../../contexts/TrackingContext";
import { getShortNameFromId } from "../../../../utils/events";
import { HelmetHead } from "../../../HelmetHead";
import { LeaderboardAd } from "../../../LeaderboardAd";
import ReportNameButton from "../../../ReportNameButton";
import { reportButtonWrapper, StandingsHeading } from "../../shared";
import { getCupUrl } from "../../utils";
import { NewEntriesClassicTable } from "./NewEntriesClassicTable";
import {
  standingsMainContent,
  standingsMainWrapper,
} from "./standingsClassic.css";
import { StandingsClassicTable } from "./StandingsClassicTable";
import { StandingsFilters } from "./StandingsFilters";

const StandingsClassic = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const { search } = useLocation();
  const { leagueId } = useParams();

  const { firePageViewEvent } = useTrackingContext();

  const leagueNumber = parseInt(leagueId!, 10) || 0;

  const query = qs.parse(search, {
    ignoreQueryPrefix: true,
  });
  const phase = parseInt(query.phase as string, 10) || 1;
  const pageNewEntries = parseInt(query.page_new_entries as string, 10) || 1;
  const pageStandings = parseInt(query.page_standings as string, 10) || 1;

  const now = useSelector(getCurrentEvent);
  const league = useSelector((state: RootState) =>
    getClassicLeague(state, leagueNumber)
  );

  const standings = useSelector((state: RootState) =>
    getClassicStandings(state, leagueNumber, phase, pageStandings)
  );

  useEffect(() => {
    firePageViewEvent("fantasy leagues & cups", "standings classic");
  }, []);

  useEffect(() => {
    const fetchLeagueStandings = () => {
      if (leagueNumber) {
        dispatch(
          fetchClassicLeagueStandings(
            leagueNumber,
            pageNewEntries,
            pageStandings,
            phase
          )
        );
      }
    };

    fetchLeagueStandings();
    dispatch(fetchEventStatus());
  }, [dispatch, leagueNumber, pageNewEntries, pageStandings, phase]);

  if (!league) {
    return null;
  }

  const started = now && league.start_event <= now.id;

  return (
    <>
      <HelmetHead
        title={`${league.name} - Classic League Standings | Fantasy Premier League`}
        description={`To view the ${league.name} invitational classic league standings, as well as creating & joining new leagues, visit the official website of the Premier League.`}
      />
      <LeaderboardAd
        id="div-gpt-ad-1501757861635-0"
        slot="DesktopFPLLeague"
        targetValue={`fplClassicLeague${league.id}`}
      />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <div className={standingsMainWrapper}>
            <StandingsHeading
              league={league}
              leagueNumber={leagueNumber}
              type="classic"
            />
            <div className={standingsMainContent}>
              {league.has_cup && (
                <MoreLink
                  to={getCupUrl(league.id, league.cup_league)}
                  variant="light"
                >
                  View Cup {league.cup_league ? "Matches" : "Info"}
                </MoreLink>
              )}
              {league.start_event > 1 && (
                <Alert isContentCentered>
                  {started
                    ? `League scoring started in Gameweek ${getShortNameFromId(
                        league.start_event,
                        true
                      )}`
                    : `League scoring will start in Gameweek ${getShortNameFromId(
                        league.start_event,
                        true
                      )}`}
                </Alert>
              )}
              {started && <StandingsFilters />}
              <StandingsClassicTable standings={standings} started={started} />
              <div className={reportButtonWrapper.mobile}>
                <ReportNameButton league={league} />
              </div>
              <NewEntriesClassicTable leagueNumber={leagueNumber} />
            </div>
          </div>
        </SurfaceContainer>
      </div>
    </>
  );
};

export default StandingsClassic;
