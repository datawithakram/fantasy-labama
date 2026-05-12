import { RootState, ThunkDispatch } from "core-integration/src/store";
import {
  getEntry,
  getLeagueForEntry,
} from "core-integration/src/store/entries/reducers";
import { fetchEntrySummary } from "core-integration/src/store/entries/thunks";
import { getCurrentEvent } from "core-integration/src/store/events/reducers";
import {
  getClassicLeague,
  getH2HMatches,
  getLeagueCupStatus,
  getLeagueEntries,
} from "core-integration/src/store/leagues/reducers";
import {
  fetchClassicLeagueStandings,
  fetchH2HLeagueMatches,
  fetchLeagueCupStatus,
  fetchLeagueEntries,
} from "core-integration/src/store/leagues/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import Alert from "plos/src/components/alerts/Alert";
import HorizontalDivider from "plos/src/components/HorizontalDivider";
import MoreLink from "plos/src/components/links/MoreLink";
import RouterLink from "plos/src/components/links/RouterLink";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { contentMain, rightSidebarLayout } from "plos/src/layouts";
import { fetchNewsArticle, PulseContentItem } from "plos/src/utils/pulse";
import qs from "qs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router";
import { HelmetHead } from "../../HelmetHead";
import CupArticleErrorBoundary from "../../leagues/CupArticleErrorBoundary";
import { MatchesList, MatchItemSkeleton } from "../../leagues/Matches";
import { MatchesFilters } from "../../leagues/Matches/MatchesFilters";
import { EntryFilter } from "../../leagues/Matches/MatchesFilters/EntryFilter";
import { EventFilter } from "../../leagues/Matches/MatchesFilters/EventFilter";
import { reportButtonWrapper, StandingsHeading } from "../../leagues/shared";
import { getLeagueUrl } from "../../leagues/utils";
import ReportNameButton from "../../ReportNameButton";
import {
  dividerWrapper,
  howCupsWorkTitle,
  howCupsWorkWrapper,
  listItems,
} from "./matchesCup.css";

const MatchesCup = () => {
  const reduxDispatch = useDispatch<ThunkDispatch>();
  const { search } = useLocation();
  const navigate = useNavigate();
  const { leagueId } = useParams();

  const leagueNumber = Number(leagueId!) || 0;
  const query = qs.parse(search, {
    ignoreQueryPrefix: true,
  });
  const entryNumber = Number(query.entry) || 0;
  const eventNumber = Number(query.event) || 0;
  const pageMatches = Number(query.page_matches) || 1;

  const buildMatchesUrl = (
    leagueNumber: number,
    eventNumber: number,
    entryNumber: number,
    pageMatches: number
  ) => {
    let url = `/leagues/${leagueNumber}/cup?page_matches=${pageMatches}`;
    if (entryNumber) {
      url += `&entry=${entryNumber}`;
    }
    if (eventNumber) {
      url += `&event=${eventNumber}`;
    }
    return url;
  };

  const player = useSelector(getPlayerData);

  const cupStatus = useSelector((state: RootState) =>
    leagueNumber ? getLeagueCupStatus(state, leagueNumber) : null
  );

  const entry = useSelector((state: RootState) =>
    entryNumber ? getEntry(state, entryNumber) : null
  );

  const leagueEntry = useSelector((state: RootState) =>
    entry ? getLeagueForEntry(state, entry.id, leagueNumber) : null
  );

  const myLeagueEntry = useSelector((state: RootState) =>
    player?.entry ? getLeagueForEntry(state, player.entry, leagueNumber) : null
  );

  const now = useSelector(getCurrentEvent);

  const league = useSelector((state: RootState) =>
    leagueNumber ? getClassicLeague(state, leagueNumber) : null
  );

  const matches = useSelector((state: RootState) =>
    cupStatus?.league
      ? getH2HMatches(
          state,
          cupStatus.league,
          entryNumber,
          eventNumber,
          pageMatches
        )
      : null
  );

  const leagueEntries = useSelector((state: RootState) =>
    cupStatus?.league ? getLeagueEntries(state, cupStatus.league) : null
  );

  const didNotQualify = leagueEntry && leagueEntry.cup_qualified === false;
  const notStarted = leagueEntry && leagueEntry.cup_qualified === null;
  // Event where we can show entries for large cups
  const largeCupEvent = 32;

  const [cupArticle, setCupArticle] = useState<any>(null);

  // Can we fetch matches?
  const canFetchMatches = () => {
    if (!cupStatus) {
      return false;
    }
    // Asking for a specific entry is fine as long as qualified
    if (entryNumber) {
      return leagueEntry?.cup_qualified;
    }
    // Can always request a cup that isn't large
    if (!cupStatus.is_large) {
      return true;
    }
    // Asking for a late event in a large league is fine
    if (eventNumber >= largeCupEvent) {
      return true;
    }
    // We are able to show the current round or first round draw
    if (now && now.id >= largeCupEvent && cupStatus.qualification_event) {
      navigate(
        buildMatchesUrl(
          leagueNumber,
          Math.max(now.id, cupStatus.qualification_event + 1),
          0,
          1
        ),
        {
          replace: true,
        }
      );
    }
    // We are able to show the logged in entry. We are safe to use non null
    // assertion on player.entry if myLeagueEntry
    else if (myLeagueEntry && myLeagueEntry?.cup_qualified) {
      navigate(buildMatchesUrl(leagueNumber, 0, player!.entry!, 1), {
        replace: true,
      });
    }
    return false;
  };
  const fetchMatches = canFetchMatches();

  // API calls ...

  // This is currently the 'best' way to get a league which is needed by
  // child components for things like name
  useEffect(() => {
    if (leagueNumber && !league) {
      reduxDispatch(fetchClassicLeagueStandings(leagueNumber, 1, 1, 1));
    }
  }, [league, leagueNumber, reduxDispatch]);

  // Get any requested entry if different to the logged in entry as there
  // is a chance we won't have it
  useEffect(() => {
    if (entryNumber && player?.entry !== entryNumber) {
      reduxDispatch(fetchEntrySummary(entryNumber));
    }
  }, [entryNumber, player, reduxDispatch]);

  // Get the cup status for the parent league
  useEffect(() => {
    if (leagueNumber) {
      reduxDispatch(fetchLeagueCupStatus(leagueNumber));
    }
  }, [leagueNumber, reduxDispatch]);

  // Get a list of league entries for filtering. We need to know the cup
  // status before we can do this
  useEffect(() => {
    if (cupStatus && cupStatus.league && !cupStatus.is_large) {
      reduxDispatch(fetchLeagueEntries(cupStatus.league));
    }
  }, [cupStatus, reduxDispatch]);

  // Get the list of matches.
  useEffect(() => {
    if (cupStatus && cupStatus.league && fetchMatches) {
      reduxDispatch(
        fetchH2HLeagueMatches(
          cupStatus.league,
          entryNumber,
          eventNumber,
          pageMatches
        )
      );
    }
  }, [
    cupStatus,
    fetchMatches,
    entryNumber,
    eventNumber,
    pageMatches,
    reduxDispatch,
  ]);

  // If ever we want to test this, here is a test article id that you can
  // insert into your dev DB game_cup table, pulse_article_id column - 10509429
  useEffect(() => {
    if (cupStatus?.pulse_article_id) {
      fetchNewsArticle(cupStatus.pulse_article_id)
        .then((article: PulseContentItem) => setCupArticle(article))
        .catch((error) => {
          console.error("Failed to fetch cup article:", error);
          setCupArticle(null);
        });
    }
  }, [cupStatus]);

  // We are still waiting for required data so delay rendering ...
  if (!cupStatus || !now || !league || (entryNumber && !entry)) {
    return null;
  }

  const cupStartText =
    now.id === cupStatus.qualification_event ? "will start" : "started";

  // This function wil be called if there are no matches, it attempts to
  // work out why!
  const getNoMatchesMessage = () => {
    if (eventNumber && eventNumber > now.id) {
      return `Cup matches for Gameweek ${eventNumber} will be available at the
      end of Gameweek ${eventNumber - 1}`;
    }
    if (cupStatus.is_large && now.id < largeCupEvent) {
      return `Cup matches will be available after Gameweek ${largeCupEvent}`;
    }
    if (notStarted || cupStatus.qualification_event === now.id) {
      return "The draw for the first round is yet to be made";
    }
    if (entryNumber && eventNumber) {
      return "This team has been eliminated";
    }
    return "";
  };

  const handleEntryFilterChange = (entryId: number) =>
    navigate(buildMatchesUrl(leagueNumber, eventNumber, entryId, 1));

  const handleEventFilterChange = (eventId: number) => {
    if (eventId) {
      return navigate(buildMatchesUrl(leagueNumber, eventId, entryNumber, 1));
    }
    return navigate(buildMatchesUrl(leagueNumber, 0, entryNumber, 1));
  };

  const DEFAULT_FILTERS = {
    event: 0,
    entry: 0,
  };

  const handleResetFilters = () => {
    navigate(
      buildMatchesUrl(
        leagueNumber,
        DEFAULT_FILTERS.event,
        DEFAULT_FILTERS.entry,
        1
      )
    );
  };

  return (
    <>
      <HelmetHead
        title={`${league.name} - Cup Matches | Fantasy Premier League`}
        description={`To view the ${league.name} cup matches, as well as creating & joining new leagues, visit the official website of the Premier League.`}
      />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <StandingsHeading
            type="classic"
            league={league}
            leagueNumber={leagueNumber}
          />
          <div className={contentMain}>
            <MoreLink
              to={getLeagueUrl(league.id, league.scoring)}
              variant="light"
            >
              View league standings
            </MoreLink>
            {didNotQualify ? (
              <Alert>
                This team did not qualify for the cup.{" "}
                <RouterLink to={buildMatchesUrl(league.id, 0, 0, 1)}>
                  View cup matches
                </RouterLink>
              </Alert>
            ) : (
              <>
                <MatchesFilters
                  defaultFilters={DEFAULT_FILTERS}
                  handleResetFilters={handleResetFilters}
                  entryNumber={entryNumber}
                  eventNumber={eventNumber}
                  isDisabled={!matches}
                >
                  <>
                    {!cupStatus.is_large && leagueEntries && (
                      <EntryFilter
                        selectedEntryId={entryNumber}
                        entries={leagueEntries}
                        handleFilterChange={handleEntryFilterChange}
                      />
                    )}
                    {cupStatus.qualification_event &&
                      !notStarted &&
                      (!cupStatus.is_large || now.id >= largeCupEvent) && (
                        <EventFilter
                          selectedEventId={eventNumber}
                          handleFilterChange={handleEventFilterChange}
                          startEvent={
                            cupStatus.is_large &&
                            cupStatus.qualification_event + 1 < largeCupEvent
                              ? largeCupEvent
                              : cupStatus.qualification_event + 1
                          }
                        />
                      )}
                  </>
                </MatchesFilters>
              </>
            )}
            {matches ? (
              matches.results.length ? (
                <>
                  <MatchesList
                    selectedEntry={entryNumber}
                    isAllMine={
                      entryNumber === player?.entry && eventNumber === 0
                    }
                    matches={matches}
                    isCup={true}
                    pageMatches={pageMatches}
                    toPrevious={buildMatchesUrl(
                      leagueNumber,
                      eventNumber,
                      entryNumber,
                      pageMatches - 1
                    )}
                    toNext={buildMatchesUrl(
                      leagueNumber,
                      eventNumber,
                      entryNumber,
                      pageMatches + 1
                    )}
                  />
                </>
              ) : (
                <Alert isInline isCentered>
                  {getNoMatchesMessage()}
                </Alert>
              )
            ) : (
              Array.from({ length: 5 }, (_, i) => <MatchItemSkeleton key={i} />)
            )}
            <div className={reportButtonWrapper.mobile}>
              <ReportNameButton league={league} />
            </div>

            {cupStatus.qualification_event && (
              <div className={dividerWrapper}>
                <HorizontalDivider
                  dataContent={`The cup ${cupStartText} in GW${
                    cupStatus.qualification_event + 1
                  }`}
                />
              </div>
            )}

            <div className={howCupsWorkWrapper}>
              <h2 className={howCupsWorkTitle}>How the Cup works</h2>
              <p>
                Each qualifying team will be randomly drawn against another in
                the first round. The winner (the team with the highest Gameweek
                score minus any transfer points), will progress to the second
                round and another random draw, the losers are out! This process
                continues until the final round when the two remaining teams
                contest the cup final.
              </p>
              <p>
                If a cup match is drawn, then the following tie-breaks will be
                applied until a winner is found:
              </p>
              <ol>
                <li className={listItems}>Most goals scored in the Gameweek</li>
                <li className={listItems}>
                  Fewest goals conceded in the Gameweek
                </li>
                <li className={listItems}>Virtual coin toss</li>
              </ol>
            </div>

            {cupArticle && (
              <CupArticleErrorBoundary>
                <div dangerouslySetInnerHTML={{ __html: cupArticle.body }} />
              </CupArticleErrorBoundary>
            )}
          </div>
        </SurfaceContainer>
      </div>
    </>
  );
};

export default MatchesCup;
