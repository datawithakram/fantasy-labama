import type { EntryCrestData } from "core-integration/src/store/ui";
import HorizontalDivider from "plos/src/components/HorizontalDivider";
import AdminPanel from "./AdminPanel";
import CrestPanel from "./CrestPanel";
import CupsPanel from "./CupsPanel";
import { entryInfoWrapper } from "./entryInfo.css";
import EntryTitleAndReport from "./EntryTitleAndReport";
import FanLeague from "./FanLeague";
import { useEntryInfo } from "./hooks/useEntryInfo";
import LeaguesPanel from "./LeaguesPanel";
import PointsAndRankings from "./PointsAndRankings";
import TransfersInfoPanel from "./TransfersInfoPanel";
import { EntryInfoProps } from "./types";

const EntryInfo = ({ entryId, showLeaguesAndCups = true }: EntryInfoProps) => {
  const {
    entry,
    mine,
    transfersState,
    broadcasterLeagues,
    filteredSystemClassicLeagues,
    privateClassicLeagues,
    privateH2HLeagues,
    publicClassicLeagues,
    publicH2HLeagues,
    broadcasterCupLeagues,
    filteredSystemCupLeagues,
    privateClassicCupLeagues,
    publicClassicCupLeagues,
    hasCupLeagues,
    fanLeagueData,
  } = useEntryInfo(entryId);

  if (!entry) {
    return null;
  }

  // If viewing somebody else's EntryInfo we want to only show the CrestPanel
  // if they have an approved crest
  const showCrest = mine
    ? true
    : entry.club_badge_src && entry.club_badge_src !== "Pending";

  // Pass only the crest-related subset so CrestPanel stays decoupled from full IEntry.
  const entryCrestData: EntryCrestData = {
    id: entry.id,
    name: entry.name,
    club_badge_src: entry.club_badge_src,
  };

  return (
    <div className={entryInfoWrapper}>
      <EntryTitleAndReport entry={entry} />
      <HorizontalDivider />
      <PointsAndRankings entry={entry} />
      <HorizontalDivider />
      {showCrest && (
        <>
          <CrestPanel entryCrestData={entryCrestData} />
          <HorizontalDivider />
        </>
      )}
      {fanLeagueData.team && (
        <>
          <FanLeague fanLeagueData={fanLeagueData} />
          <HorizontalDivider />
        </>
      )}
      {showLeaguesAndCups && (
        <>
          <LeaguesPanel
            entry={entry}
            broadcasterLeagues={broadcasterLeagues}
            filteredSystemClassicLeagues={filteredSystemClassicLeagues}
            privateClassicLeagues={privateClassicLeagues}
            privateH2HLeagues={privateH2HLeagues}
            publicClassicLeagues={publicClassicLeagues}
            publicH2HLeagues={publicH2HLeagues}
          />
          <HorizontalDivider />
          <CupsPanel
            broadcasterCupLeagues={broadcasterCupLeagues}
            entry={entry}
            filteredSystemCupLeagues={filteredSystemCupLeagues}
            privateClassicCupLeagues={privateClassicCupLeagues}
            publicClassicCupLeagues={publicClassicCupLeagues}
            hasCupLeagues={hasCupLeagues}
          />
          <HorizontalDivider />
        </>
      )}
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
  );
};

export default EntryInfo;
