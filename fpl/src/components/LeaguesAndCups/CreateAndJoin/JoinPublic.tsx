import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { getNextEvent } from "core-integration/src/store/events/reducers";
import { getSettings } from "core-integration/src/store/game/reducers";
import { ISettings } from "core-integration/src/store/game/types";
import { getJoinPublicLeagueError } from "core-integration/src/store/leagues/reducers";
import { joinPublicLeague } from "core-integration/src/store/leagues/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import { ErrorAlert } from "plos/src/components/alerts";
import { Button } from "plos/src/components/buttons/Button";
import HorizontalDivider from "plos/src/components/HorizontalDivider";
import SectionHeader from "plos/src/components/SectionHeader";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { rightSidebarLayout } from "plos/src/layouts";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTrackingContext } from "../../../contexts/TrackingContext";
import HelmetHeadLeagues from "../../leagues/HelmetHeadLeagues";
import {
  formItem,
  gridDivider,
  leagueGridLayout,
  leaguesMainContent,
  noteTextStyle,
} from "../leaguesAndCups.css";
import { LeagueCallToAction } from "./LeagueCallToAction";

const JoinPublic = () => {
  const { fireClickTrackEvent, firePageViewEvent } = useTrackingContext();
  const dispatch = useDispatch<ThunkDispatch>();
  const navigate = useNavigate();

  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  ); // enforced by EntryRoute
  const playerEntry = player.entry;
  const entry = useSelector((state: RootState) => getEntry(state, playerEntry));
  const error = useSelector(getJoinPublicLeagueError);
  const nxt = useSelector(getNextEvent);
  const settings = useSelector(
    (state: RootState) => getSettings(state) as ISettings
  );

  useEffect(() => {
    firePageViewEvent("fantasy leagues & cups", "join public league");
  }, []);

  useEffect(() => {
    if (!nxt) {
      navigate("/", { replace: true });
    }
  }, [navigate, nxt]);

  const handleOnJoinClassic = async () => {
    await dispatch(joinPublicLeague({ scoring: "c" }));
    fireClickTrackEvent(
      {
        event_category: "fantasy league",
        event_component: "fantasy classic clicks",
        event_detail: "join classic cta",
        event_type: "join public league",
      },
      "fantasy join public league"
    );
    navigate("/leagues");
  };
  const handleOnJoinH2H = async () => {
    await dispatch(joinPublicLeague({ scoring: "h" }));
    fireClickTrackEvent(
      {
        event_category: "fantasy league",
        event_component: "fantasy classic clicks",
        event_detail: "join h2h cta",
        event_type: "join public league",
      },
      "fantasy join public league"
    );
    navigate("/leagues");
  };

  const nonFieldError = error?.badRequest?.non_field_errors?.[0];
  const errorMessage =
    nonFieldError?.code === "public_league_max_exceeded"
      ? `You can only enter ${settings.league_join_public_max} public leagues`
      : JSON.stringify(error);

  if (!entry) {
    return null;
  }

  return (
    <>
      <HelmetHeadLeagues />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <div className={leaguesMainContent}>
            {nonFieldError && <ErrorAlert>{errorMessage}</ErrorAlert>}
            <SectionHeader
              title="Join a Public League"
              description={`Public leagues allow you to compete against ${settings.league_max_size_public_classic} randomly assigned game
              players in a classic league and up to ${settings.league_max_size_public_h2h} in head-to-head leagues. You
              can join up to ${settings.league_join_public_max} public leagues.`}
            />
            <div className={leagueGridLayout}>
              <p className={noteTextStyle}>
                Note, you can't remove your team from a public league after the
                league has started, once the challenge is on there's no
                quitting.
              </p>
              <div className={formItem}>
                <LeagueCallToAction
                  heading="Classic Scoring"
                  description="In a league with classic scoring, teams are ranked based on their total points in the game. You can join or leave a league with classic scoring at any point during the season."
                >
                  <Button onPress={handleOnJoinClassic}>
                    Join Classic League
                  </Button>
                </LeagueCallToAction>
              </div>
              <div className={gridDivider}>
                <HorizontalDivider dataContent="or" />
              </div>
              <div className={formItem}>
                <LeagueCallToAction
                  heading="Head-to-Head Scoring"
                  description="In a league with head-to-head scoring, every team plays a match against another team in the league each Round. The match result is based on the Round score of each team minus any transfer points spent preparing for the Round."
                >
                  <Button onPress={handleOnJoinH2H}>
                    Join Head-to-Head League
                  </Button>
                </LeagueCallToAction>
              </div>
            </div>
          </div>
        </SurfaceContainer>
      </div>
    </>
  );
};

export default JoinPublic;
