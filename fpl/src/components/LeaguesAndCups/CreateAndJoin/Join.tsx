import { RootState } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { getNextEvent } from "core-integration/src/store/events/reducers";
import { getSettings } from "core-integration/src/store/game/reducers";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import HorizontalDivider from "plos/src/components/HorizontalDivider";
import ButtonLink from "plos/src/components/links/ButtonLink";
import SectionHeader from "plos/src/components/SectionHeader";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { rightSidebarLayout } from "plos/src/layouts";
import { useSelector } from "react-redux";
import HelmetHeadLeagues from "../../leagues/HelmetHeadLeagues";
import {
  gridDivider,
  leagueGridLayout,
  leaguesMainContent,
} from "../leaguesAndCups.css";
import { LeagueCallToAction } from "./LeagueCallToAction";

const Join = () => {
  const nxt = useSelector(getNextEvent);
  const settings = useSelector(getSettings);
  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  ); // enforced by EntryRoute
  const playerEntry = player.entry;
  const entry = useSelector((state: RootState) => getEntry(state, playerEntry));

  if (!settings || !entry) {
    return null;
  }

  return (
    <>
      <HelmetHeadLeagues />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <div className={leaguesMainContent}>
            <SectionHeader
              title="Choose a League Type to Join"
              description={`You can join up to ${settings.league_join_private_max} invitational leagues and ${settings.league_join_public_max} public leagues.`}
            />
            <div className={leagueGridLayout}>
              <LeagueCallToAction
                heading="Invitational Leagues & Cups"
                description="Join an invitational league and cup if somebody has given you a league code to enter."
              >
                <ButtonLink to="private">
                  Join Invitational League & Cup
                </ButtonLink>
              </LeagueCallToAction>
              <div className={gridDivider}>
                <HorizontalDivider dataContent="or" />
              </div>
              <LeagueCallToAction
                heading="Public Leagues"
                description="Join a public league to play against a small, randomly selected group of other game players."
              >
                {nxt ? (
                  <ButtonLink to="public">Join Public League</ButtonLink>
                ) : (
                  <p>
                    It is no longer possible to join public leagues as the last
                    deadline has passed.
                  </p>
                )}
              </LeagueCallToAction>
            </div>
          </div>
        </SurfaceContainer>
      </div>
    </>
  );
};

export default Join;
