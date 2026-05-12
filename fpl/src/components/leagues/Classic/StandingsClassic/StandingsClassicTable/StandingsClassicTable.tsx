import { RootState } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { getCurrentEventStatus } from "core-integration/src/store/events/reducers";
import {
  IClassicStanding,
  IClassicStandingsWithDates,
} from "core-integration/src/store/leagues/types";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { formatRawAsLocal } from "core-integration/src/utils/datetime";
import Alert from "plos/src/components/alerts/Alert";
import ButtonLink from "plos/src/components/links/ButtonLink";
import { Column, Table } from "plos/src/components/Table";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import { TableBody, TableHeader } from "react-aria-components";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import { NextIcon, PrevIcon } from "../../../../icons/Chevrons";
import { numericCol } from "../../../shared";
import {
  LeaguesTableCellVariants,
  LeaguesTableRowVariants,
  nextButton,
  pager,
  rankCol,
} from "../../../shared/styles/leaguesTableStyles.css";
import { getQueryParam, updateQueryParams } from "../utils";
import StandingsClassicRow from "./StandingsClassicRow";
import {
  managerCol,
  standingsClassicTable,
  standingsClassicTableWrapper,
} from "./standingsClassicTable.css";

interface StandingsClassicTableProps {
  standings: IClassicStandingsWithDates | null;
  started: boolean | null;
}

const StandingsClassicTable = ({
  standings,
  started,
}: StandingsClassicTableProps) => {
  const player = useSelector(getPlayerData);

  const myEntry = useSelector((state: RootState) =>
    player?.entry ? getEntry(state, player.entry) : null
  );

  const myEntryCrestSrc = myEntry?.club_badge_src ?? null;

  const statusData = useSelector(getCurrentEventStatus);
  const location = useLocation();

  const pageStandings = getQueryParam({ location, key: "page_standings" });
  const pageStandingsAsNumber = pageStandings ? parseInt(pageStandings, 10) : 1;

  const previousLink = updateQueryParams({
    location,
    newParams: { page_standings: pageStandingsAsNumber - 1 },
  });
  const nextLink = updateQueryParams({
    location,
    newParams: { page_standings: pageStandingsAsNumber + 1 },
  });

  const getRowStyles = ({
    standings,
    rowData,
    idx,
  }: {
    standings: IClassicStandingsWithDates;
    rowData: IClassicStanding;
    idx: number;
  }): {
    variant: LeaguesTableRowVariants;
    cellProps: LeaguesTableCellVariants;
  } => {
    const mine = player !== null && player.entry === rowData.entry;
    const mineIdx = standings.results.findIndex(
      (ls) => player?.entry === ls.entry
    );
    const isRowBeforeMine = idx === mineIdx - 1;
    const showBorder = !mine && !isRowBeforeMine;

    const rowVariant = mine ? "mine" : "default";

    const cellProps = { mine, borderBottom: showBorder };

    return { variant: rowVariant, cellProps };
  };

  return (
    <>
      {started && statusData?.leagues === "Updating" && (
        <Alert isContentCentered>
          League tables are currently being re-calculated. The table below may
          still contain old data.
        </Alert>
      )}
      {standings && standings.lastUpdatedData && (
        <span>
          Last updated:{" "}
          <strong>{formatRawAsLocal(standings.lastUpdatedData)}</strong> (local
          time)
        </span>
      )}
      <div className={standingsClassicTableWrapper}>
        <Table
          className={standingsClassicTable}
          aria-label="Invitational Classic Standings"
        >
          <TableHeader>
            <Column className={rankCol}>Rank</Column>
            <Column isRowHeader className={managerCol}>
              Team & Manager
            </Column>
            <Column className={numericCol}>
              <InfoText label="Gameweek points">GW</InfoText>
            </Column>
            <Column className={numericCol}>Total</Column>
          </TableHeader>
          <TableBody
            renderEmptyState={() =>
              "Standings data will appear here when the league starts"
            }
          >
            {standings &&
              standings.results.map((ls, idx) => {
                const rowProps = getRowStyles({ rowData: ls, idx, standings });
                const isMyRow = player?.entry === ls.entry;
                return (
                  <StandingsClassicRow
                    key={ls.entry}
                    rowData={ls}
                    myEntryCrestSrc={isMyRow ? myEntryCrestSrc : null}
                    {...rowProps}
                  />
                );
              })}
          </TableBody>
        </Table>
      </div>
      {/*  TODO update to new Pager Buttons */}
      <div className={pager}>
        {pageStandingsAsNumber > 1 && (
          <ButtonLink to={previousLink} styleVariant="tonal" size="small">
            <PrevIcon />
            <span>Previous</span>
          </ButtonLink>
        )}
        {standings?.has_next && (
          <ButtonLink
            to={nextLink}
            styleVariant="tonal"
            size="small"
            className={nextButton}
          >
            <span>Next</span>
            <NextIcon />
          </ButtonLink>
        )}
      </div>
    </>
  );
};

export default StandingsClassicTable;
