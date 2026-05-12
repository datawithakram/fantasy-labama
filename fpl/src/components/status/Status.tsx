import {
  getCurrentEventStatus,
  getNextNEvents,
} from "core-integration/src/store/events/reducers";
import type { EntryCrestData } from "core-integration/src/store/ui";
import { Alert } from "plos/src/components/alerts";
import HorizontalDivider from "plos/src/components/HorizontalDivider";
import PageTitle from "plos/src/components/PageTitle";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import {
  contentMain,
  leftSidebarLayout,
  statusMain,
  statusSidebar,
} from "plos/src/layouts";
import { useSelector } from "react-redux";
import AdminPanel from "../EntryInfo/AdminPanel";
import CrestPanel from "../EntryInfo/CrestPanel";
import { useEntryInfo } from "../EntryInfo/hooks/useEntryInfo";
import PointsAndRankings from "../EntryInfo/PointsAndRankings";
import TransfersInfoPanel from "../EntryInfo/TransfersInfoPanel";
import { LeaderboardAd } from "../LeaderboardAd";
import { NewsPlaylist } from "../news/NewsPlaylist";
import { NewsSection } from "../news/NewsSection";
import EventStatus from "../status/EventStatus";
import { UpcomingDeadlines } from "../UpcomingDeadlines";
import EventInfo from "./EventInfo";
import { EventSummary } from "./EventSummary";
import { BestLeagues, ValuableTeams } from "./LeaguesAndTeams";
import { DreamTeamPanel, PlayerAvailability } from "./PlayerTables";
import { statusTwoCol } from "./status.css";
import { TopElementCarousel } from "./TopElementCarousel";
import TransfersTable from "./TransfersTable";
import { StatusProps } from "./types";
// import WscStoriesWidget from "../wsc/WscStoriesWidget";

const Status = ({ entry, now }: StatusProps) => {
  const statusData = useSelector(getCurrentEventStatus);
  const nextEvents = useSelector(getNextNEvents(5));
  const { mine, transfersState } = useEntryInfo(entry.id);

  // Pass only the crest-related subset so CrestPanel stays decoupled from full IEntry.
  const entryCrestData: EntryCrestData = {
    id: entry.id,
    name: entry.name,
    club_badge_src: entry.club_badge_src,
  };

  return (
    <>
      <LeaderboardAd slot="Leaderboard_Status" id="ism-status-ad" />
      <div className={leftSidebarLayout}>
        <div className={statusMain}>
          <SurfaceContainer>
            <div className={contentMain}>
              <PageTitle title={`${now.name} Status`} />
              {statusData?.leagues === "Updated" && (
                <Alert isContentCentered variant="light">
                  League tables have been updated!
                </Alert>
              )}
              {statusData?.leagues === "Updating" && (
                <Alert isContentCentered variant="light">
                  League tables are updating...
                </Alert>
              )}
              <div className={statusTwoCol}>
                <EventStatus />
                <EventInfo now={now} />
              </div>
            </div>
          </SurfaceContainer>
          <div className={statusTwoCol}>
            <TransfersTable />
            <TransfersTable isOut={true} />
          </div>
          {/* TODO: Comment back in when we know how to handle no response data. See https://github.com/ismfg/games/pull/8240#issuecomment-3089258727 */}
          {/* <StatusPanel title="Latest Videos">
            <WscStoriesWidget labels="fpl_stories" />
          </StatusPanel> */}
          <TopElementCarousel now={now} />

          <div className={statusTwoCol}>
            <DreamTeamPanel now={now} />
            <PlayerAvailability />
          </div>
          <div className={statusTwoCol}>
            <ValuableTeams />
            <BestLeagues />
          </div>

          <NewsSection title="Latest from The Scout">
            <NewsPlaylist
              layout="scrollableRow"
              playlistId={4349948}
              variant="scrollable"
            />
          </NewsSection>
        </div>
        <div className={statusSidebar}>
          <EventSummary entry={entry} currentEvent={now} />
          <SurfaceContainer>
            <UpcomingDeadlines events={nextEvents} />
          </SurfaceContainer>
          <SurfaceContainer>
            <div className={contentMain}>
              <PointsAndRankings entry={entry} />
              <HorizontalDivider />
              <CrestPanel entryCrestData={entryCrestData} />
              <HorizontalDivider />
              <TransfersInfoPanel
                entry={entry}
                transfersState={transfersState}
                mine={mine}
              />
              {mine && (
                <>
                  <HorizontalDivider />
                  <AdminPanel />
                </>
              )}
            </div>
          </SurfaceContainer>
        </div>
      </div>
    </>
  );
};

export default Status;
