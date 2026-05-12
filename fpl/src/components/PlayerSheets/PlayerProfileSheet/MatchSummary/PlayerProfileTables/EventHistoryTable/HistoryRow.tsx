import { IElementStat } from "core-integration/src/store/element-stats/types";
import { IElementHistory } from "core-integration/src/store/elements/types";
import { ITeamsById } from "core-integration/src/store/teams/types";
import { integerToMoney } from "core-integration/src/utils/money";
import { Cell, Row } from "plos/src/components/Table";
import {
  stickyTableCell,
  tableCell,
} from "../../../../../styles/sharedTableStyles.css";
import HistoryOppCell from "../custom-cells/HistoryOppCell/HistoryOppCell";
import { HistoryResult } from "../custom-cells/HistoryResult";

interface HistoryRowProps {
  history: IElementHistory;
  teamsById: ITeamsById;
  statsByName: Record<string, IElementStat>;
  statNames: string[];
}

const HistoryRow = ({
  history,
  teamsById,
  statsByName,
  statNames,
}: HistoryRowProps) => {
  const oppTeam = teamsById[history.opponent_team];
  return (
    <Row>
      <Cell className={tableCell}>{history.round}</Cell>
      <Cell className={stickyTableCell}>
        <HistoryOppCell oppTeam={oppTeam} history={history} />
      </Cell>
      <Cell className={tableCell}>
        <HistoryResult history={history} />
      </Cell>
      <Cell className={tableCell}>{history.total_points}</Cell>
      {statNames.map((n) => (
        <Cell className={tableCell} key={n}>
          {history[statsByName[n].name]}
        </Cell>
      ))}
      <Cell className={tableCell}>{history.transfers_balance}</Cell>
      <Cell className={tableCell}>{history.selected}</Cell>
      <Cell className={tableCell}>£{integerToMoney(history.value, 10)}</Cell>
    </Row>
  );
};

export default HistoryRow;
