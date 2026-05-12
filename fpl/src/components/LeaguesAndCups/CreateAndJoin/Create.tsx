import { RootState } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { getNextEvent } from "core-integration/src/store/events/reducers";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import HorizontalDivider from "plos/src/components/HorizontalDivider";
import ButtonLink from "plos/src/components/links/ButtonLink/ButtonLink";
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

const Create = () => {
  const nxt = useSelector(getNextEvent);
  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  ); // enforced by EntryRoute
  const playerEntry = player.entry;
  const entry = useSelector((state: RootState) => getEntry(state, playerEntry));

  if (!entry) {
    return null;
  }

  return (
    <>
      <HelmetHeadLeagues />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <div className={leaguesMainContent}>
            <SectionHeader title="Choose a League Type to Create" />
            <div className={leagueGridLayout}>
              <LeagueCallToAction
                heading="Classic Scoring"
                description="In a league with classic scoring, teams are ranked based on their total points in the game. You can join or leave a league with classic scoring at any point during the season."
              >
                <ButtonLink to="classic">Create a League & Cup</ButtonLink>
              </LeagueCallToAction>
              <div className={gridDivider}>
                <HorizontalDivider dataContent="or" />
              </div>
              <LeagueCallToAction
                heading="Head-to-Head Scoring"
                description="In a league with head-to-head scoring, every team plays a match against another team in the league each Round. The match result is based on the Round score of each team minus any transfer points spent preparing for the Round. The Head-to-Head schedule is generated at the start of the league's first Round. Once the schedule has been generated the league is locked and teams will not be able to join or leave."
              >
                {nxt ? (
                  <ButtonLink to="h2h">Create Head-to-Head League</ButtonLink>
                ) : (
                  <p>
                    It is no longer possible to create head-to-head leagues as
                    the last deadline has passed.
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

export default Create;
