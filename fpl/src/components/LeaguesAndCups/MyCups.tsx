import { RootState } from "core-integration/src/store";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import ButtonLink from "plos/src/components/links/ButtonLink";
import SectionHeader from "plos/src/components/SectionHeader";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import PlusIcon from "plos/src/img/icons/plus-icon.svg?react";
import { rightSidebarLayout } from "plos/src/layouts";
import { useSelector } from "react-redux";
import { useEntryInfo } from "../EntryInfo/hooks/useEntryInfo";
import { HelmetHead } from "../HelmetHead";
import { LeaderboardAd } from "../LeaderboardAd";
import CupTypeTable from "./CupType/CupTypeTable/CupTypeTable";
import {
  leaguesActionButton,
  leaguesActionButtons,
  leaguesMainContent,
} from "./leaguesAndCups.css";
import { LeaguesAndCupsToggle } from "./LeaguesAndCupsToggle";

const MyCups = () => {
  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  ); // enforced by EntryRoute

  const {
    broadcasterCupLeagues,
    filteredSystemCupLeagues,
    privateClassicCupLeagues,
    publicClassicCupLeagues,
    hasCupLeagues,
  } = useEntryInfo(player.entry);

  return (
    <>
      <LeaderboardAd slot="Leaderboard_Leagues" id="ism-leagues-ad" />
      <HelmetHead
        title="Play FPL League & General Cups | Fantasy Premier League"
        description="Challenge yourself against other FPL players in your leagues, country and the overall Fantasy Premier League. Find out more, visit the official website of the Premier League."
      />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <div className={leaguesMainContent}>
            <SectionHeader title="Leagues & Cups" />
            <LeaguesAndCupsToggle selected={"cups"} />
            {hasCupLeagues ? (
              <>
                {privateClassicCupLeagues.length > 0 && (
                  <CupTypeTable
                    leagues={privateClassicCupLeagues.sort((a, b) =>
                      a.name.localeCompare(b.name)
                    )}
                    title="League cups"
                  />
                )}
                {publicClassicCupLeagues.length > 0 && (
                  <CupTypeTable
                    leagues={publicClassicCupLeagues}
                    title="Public cups"
                  />
                )}
                {filteredSystemCupLeagues.length > 0 && (
                  <CupTypeTable
                    leagues={filteredSystemCupLeagues}
                    title="General cups"
                  />
                )}
                {broadcasterCupLeagues.length > 0 && (
                  <CupTypeTable
                    leagues={broadcasterCupLeagues}
                    title="Broadcaster cups"
                  />
                )}
              </>
            ) : (
              <>
                <p>None of your leagues have a cup yet.</p>
                <div className={leaguesActionButtons}>
                  <div className={leaguesActionButton}>
                    <ButtonLink to="/leagues/join" fullWidth>
                      Join League
                    </ButtonLink>
                  </div>
                  <div className={leaguesActionButton}>
                    <ButtonLink to="/leagues/create" fullWidth>
                      <PlusIcon />
                      Create League
                    </ButtonLink>
                  </div>
                </div>
              </>
            )}
          </div>
        </SurfaceContainer>
      </div>
    </>
  );
};

export default MyCups;
