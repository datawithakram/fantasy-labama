import { RootState, ThunkDispatch } from "core-integration/src/store";
import { fetchEntrySummary } from "core-integration/src/store/entries/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import ButtonLink from "plos/src/components/links/ButtonLink";
import PageTitle from "plos/src/components/PageTitle";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import EnterIcon from "plos/src/img/icons/enter.svg?react";
import PlusIcon from "plos/src/img/icons/plus-icon.svg?react";
import RefreshIcon from "plos/src/img/icons/refresh.svg?react";
import { rightSidebarLayout } from "plos/src/layouts";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEntryInfo } from "../EntryInfo/hooks/useEntryInfo";
import { LeaderboardAd } from "../LeaderboardAd";
import HelmetHeadLeagues from "../leagues/HelmetHeadLeagues";
import {
  leaguesActionButton,
  leaguesActionButtons,
  leaguesMainContent,
} from "./leaguesAndCups.css";
import { LeaguesAndCupsToggle } from "./LeaguesAndCupsToggle";
import LeagueType from "./LeagueType";

const MyLeagues = () => {
  const dispatch = useDispatch<ThunkDispatch>();

  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  ); // enforced by EntryRoute
  const playerEntry = player.entry;

  const {
    broadcasterLeagues,
    filteredSystemClassicLeagues,
    privateClassicLeagues,
    privateH2HLeagues,
    publicClassicLeagues,
    publicH2HLeagues,
  } = useEntryInfo(player.entry);

  useEffect(() => {
    dispatch(fetchEntrySummary(playerEntry));
  }, [dispatch, playerEntry]);

  return (
    <>
      <LeaderboardAd slot="Leaderboard_Leagues" id="ism-leagues-ad" />
      <HelmetHeadLeagues />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <div className={leaguesMainContent}>
            <PageTitle title="Leagues &amp; Cups" />
            <LeaguesAndCupsToggle selected={"leagues"} />
            <div className={leaguesActionButtons}>
              <div className={leaguesActionButton}>
                <ButtonLink to="/leagues/join" fullWidth>
                  <EnterIcon width={16} height={16} />
                  Join a League
                </ButtonLink>
              </div>
              <div className={leaguesActionButton}>
                <ButtonLink to="/leagues/create" fullWidth>
                  <PlusIcon width={16} height={16} />
                  Create a League
                </ButtonLink>
              </div>
              <div className={leaguesActionButton}>
                <ButtonLink
                  to="/leagues/renew"
                  styleVariant="outlined"
                  fullWidth
                >
                  <RefreshIcon width={16} height={16} />
                  Renew Your Leagues
                </ButtonLink>
              </div>
            </div>
            <LeagueType
              title="Invitational Classic Leagues"
              leagues={privateClassicLeagues}
            />
            <LeagueType
              title="General Leagues"
              leagues={filteredSystemClassicLeagues}
            />
            {broadcasterLeagues.length > 0 && (
              <LeagueType
                title="Broadcaster Leagues"
                leagues={broadcasterLeagues}
              />
            )}
            {privateH2HLeagues.length > 0 && (
              <LeagueType
                title="Invitational Head-to-Head Leagues"
                leagues={privateH2HLeagues}
              />
            )}
            {publicClassicLeagues.length > 0 && (
              <LeagueType
                title="Public Classic Leagues"
                leagues={publicClassicLeagues}
              />
            )}
            {publicH2HLeagues.length > 0 && (
              <LeagueType
                title="Public Head-to-Head Leagues"
                leagues={publicH2HLeagues}
              />
            )}
          </div>
        </SurfaceContainer>
      </div>
    </>
  );
};

export default MyLeagues;
