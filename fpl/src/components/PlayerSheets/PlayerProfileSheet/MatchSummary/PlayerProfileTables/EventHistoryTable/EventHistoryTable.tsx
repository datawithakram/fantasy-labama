import { RootState } from "core-integration/src/store";
import { getElementStatsByIdentifier } from "core-integration/src/store/element-stats/reducers";
import { IElementStat } from "core-integration/src/store/element-stats/types";
import {
  getElement,
  getHistory,
  getHistoryTotals,
} from "core-integration/src/store/elements/reducers";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import { formatNumberToLocaleString } from "core-integration/src/utils/number";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import {
  getElementStat,
  getElementStatNames,
  getStatAbbr,
} from "plos/src/utils/elementStats";
import { TableBody, TableHeader } from "react-aria-components";
import { useSelector } from "react-redux";
import {
  headerCell,
  tableWrapper,
  tHead,
  totalsCell,
  totalsHeaderCell,
} from "../../../../../styles/sharedTableStyles.css";
import { statDetails } from "../../../../../utils/stats";
import {
  oppHeaderCell,
  per90Cell,
  per90HeaderCell,
  tableHeader,
} from "../tableStyles.css";
import HistoryRow from "./HistoryRow";

interface EventHistoryTableProps {
  elementId: number;
}

const EventHistoryTable = ({ elementId }: EventHistoryTableProps) => {
  const statsByName: Record<string, IElementStat> = useSelector(
    getElementStatsByIdentifier
  );
  const teamsById = useSelector(getTeamsById);
  const history = useSelector((state: RootState) =>
    getHistory(state, elementId)
  );

  const historyTotals = useSelector((state: RootState) =>
    getHistoryTotals(state, elementId)
  );
  const element = useSelector((state: RootState) =>
    getElement(state, elementId)
  );

  if (!element) {
    return null;
  }

  const statNames = getElementStatNames();
  const { now_cost } = statDetails;

  return (
    <div>
      <h2 className={tableHeader}>This Season</h2>
      {history.length > 0 ? (
        <div className={tableWrapper}>
          <Table aria-label="Gameweek history">
            <TableHeader className={tHead}>
              <Row>
                <Column className={headerCell}>GW</Column>
                <Column className={oppHeaderCell} isRowHeader>
                  Opponent
                </Column>
                <Column className={headerCell}>Result</Column>
                <Column className={headerCell}>
                  <InfoText label="Points">Pts</InfoText>
                </Column>
                {statNames.map((n) => (
                  <Column className={headerCell} key={n}>
                    <InfoText label={statsByName[n].label}>
                      {getStatAbbr(n, statsByName)}
                    </InfoText>
                  </Column>
                ))}
                <Column className={headerCell}>
                  <InfoText label="Net Transfers">NT</InfoText>
                </Column>
                <Column className={headerCell}>
                  <InfoText label="Teams selected by">TSB</InfoText>
                </Column>
                <Column className={headerCell}>
                  <InfoText label={now_cost.label}>
                    {now_cost.shortName}
                  </InfoText>
                </Column>
              </Row>
            </TableHeader>
            <TableBody>
              {[...history].reverse().map((h) => (
                <HistoryRow
                  key={h.fixture}
                  history={h}
                  teamsById={teamsById}
                  statsByName={statsByName}
                  statNames={statNames}
                />
              ))}
              <Row aria-label="Totals row">
                <Cell />
                <Cell className={totalsHeaderCell}>Totals</Cell>
                <Cell />
                <Cell className={totalsCell}>{historyTotals.total_points}</Cell>
                {statNames.map((n) => (
                  <Cell className={totalsCell} key={n}>
                    {formatNumberToLocaleString(
                      historyTotals[statsByName[n].name]
                    )}
                  </Cell>
                ))}
                <Cell className={totalsCell}>-</Cell>
                <Cell className={totalsCell}>-</Cell>
                <Cell className={totalsCell}>-</Cell>
              </Row>
              <Row aria-label="Per 90 minutes row">
                <Cell />
                <Cell className={per90HeaderCell}>Per 90</Cell>
                <Cell />
                <Cell className={per90Cell}>-</Cell>
                {statNames.map((n) => {
                  const elementStat = getElementStat(n);
                  return (
                    <Cell className={per90Cell} key={n}>
                      {elementStat?.per90Stat &&
                      elementStat.per90Stat !== "starts_per_90"
                        ? element[elementStat.per90Stat]
                        : "-"}
                    </Cell>
                  );
                })}
                <Cell className={per90Cell}>-</Cell>
                <Cell className={per90Cell}>-</Cell>
                <Cell className={per90Cell}>-</Cell>
              </Row>
            </TableBody>
          </Table>
        </div>
      ) : (
        <SurfaceContainer>
          <p>Data will appear here once the season is underway.</p>
        </SurfaceContainer>
      )}
    </div>
  );
};

export default EventHistoryTable;
