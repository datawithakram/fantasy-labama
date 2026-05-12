import { getCurrentEvent } from "core-integration/src/store/events/reducers";
import { IClassicStanding } from "core-integration/src/store/leagues/types";
import type { EntryCrestData } from "core-integration/src/store/ui";
import { textTruncate } from "plos/src/styles";
import { Cell, Row } from "react-aria-components";
import { useSelector } from "react-redux";
import { Link } from "react-router";
import { EntryCrest } from "../../../../crests/EntryCrest";
import Movement from "../../../Movement";
import {
  leaguesTableCell,
  LeaguesTableCellVariants,
  leaguesTableRow,
  LeaguesTableRowVariants,
  teamCellContainer,
} from "../../../shared/styles/leaguesTableStyles.css";
import { entryLink, rankCell } from "./standingsClassicTable.css";

interface StandingsClassicRowProps {
  cellProps: LeaguesTableCellVariants;
  myEntryCrestSrc: string | null;
  rowData: IClassicStanding;
  variant: LeaguesTableRowVariants;
}

const StandingsClassicRow = ({
  cellProps,
  myEntryCrestSrc,
  rowData,
  variant,
}: StandingsClassicRowProps) => {
  const now = useSelector(getCurrentEvent);
  const {
    rank,
    entry,
    entry_name: entryName,
    player_name: playerName,
    last_rank: lastRank,
    event_total,
    total,
  } = rowData;

  // Prefer the logged-in entry's crest from entries.byId (can be "", "Pending", or URL).
  // league.standings.results doesn't include "Pending", so fall back to row data for other entries.
  const effectiveCrestSrc = myEntryCrestSrc ?? rowData.club_badge_src ?? null;

  const entryCrestData: EntryCrestData = {
    id: entry,
    name: entryName,
    club_badge_src: effectiveCrestSrc,
  };

  return (
    <Row className={leaguesTableRow[variant]}>
      <Cell className={leaguesTableCell(cellProps)}>
        <span className={rankCell}>
          {rank.toLocaleString()}
          <Movement lastRank={lastRank} rank={rank} />
        </span>
      </Cell>
      <Cell className={leaguesTableCell({ ...cellProps })}>
        <div className={teamCellContainer}>
          <EntryCrest entryCrestData={entryCrestData} dimension={30} />
          <div className={textTruncate}>
            {now ? (
              <Link
                to={`/entry/${entry}/event/${now.id}`}
                className={entryLink}
              >
                <strong>{entryName}</strong>
              </Link>
            ) : (
              <strong>{entryName}</strong>
            )}
            <br />
            <span>{playerName}</span>
          </div>
        </div>
      </Cell>
      <Cell className={leaguesTableCell({ ...cellProps, numeric: true })}>
        {event_total.toLocaleString()}
      </Cell>
      <Cell className={leaguesTableCell({ ...cellProps, numeric: true })}>
        {total.toLocaleString()}
      </Cell>
    </Row>
  );
};

export default StandingsClassicRow;
