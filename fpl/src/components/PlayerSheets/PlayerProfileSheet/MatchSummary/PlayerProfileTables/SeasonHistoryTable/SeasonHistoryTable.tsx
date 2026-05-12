import { RootState } from "core-integration/src/store";
import { getElementStatsByIdentifier } from "core-integration/src/store/element-stats/reducers";
import { IElementStat } from "core-integration/src/store/element-stats/types";
import {
  getElement,
  getSeasonHistory,
} from "core-integration/src/store/elements/reducers";
import { integerToMoney } from "core-integration/src/utils/money";
import { formatNumberToLocaleString } from "core-integration/src/utils/number";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import { getElementStatNames, getStatAbbr } from "plos/src/utils/elementStats";
import { useSelector } from "react-redux";
import {
  headerCell,
  stickyHeaderCell,
  stickyTableCell,
  tableCell,
  tableStyles,
  tableWrapper,
  tHead,
} from "../../../../../styles/sharedTableStyles.css";
import { tableHeader } from "../tableStyles.css";

interface SeasonHistoryTableProps {
  elementId: number;
}

const SeasonHistoryTable = ({ elementId }: SeasonHistoryTableProps) => {
  const statsByName: Record<string, IElementStat> = useSelector(
    getElementStatsByIdentifier
  );

  const element = useSelector((state: RootState) =>
    getElement(state, elementId)
  );

  const seasonHistory = useSelector((state: RootState) =>
    getSeasonHistory(state, elementId).slice().reverse()
  );

  if (!element || seasonHistory?.length === 0) {
    return null;
  }

  const statNames = getElementStatNames();

  return (
    <div>
      <h2 className={tableHeader}>Previous Seasons</h2>
      <div className={tableWrapper}>
        <table className={tableStyles}>
          <thead className={tHead}>
            <tr>
              <th className={stickyHeaderCell} scope="col">
                Season
              </th>
              <th className={headerCell} scope="col">
                Pts
              </th>
              {statNames.map((n) => (
                <th className={headerCell} key={n} scope="col">
                  <InfoText label={statsByName[n].label}>
                    {getStatAbbr(n, statsByName)}
                  </InfoText>
                </th>
              ))}
              <th className={headerCell} scope="col">
                <InfoText label="Price at start of season">£S</InfoText>
              </th>
              <th className={headerCell} scope="col">
                <InfoText label="Price at end of season">£E</InfoText>
              </th>
            </tr>
          </thead>
          <tbody>
            {seasonHistory.map((h) => (
              <tr key={h.season_name}>
                <td className={stickyTableCell}>{h.season_name}</td>
                <td className={tableCell}>{h.total_points}</td>
                {statNames.map((n) => (
                  <td className={tableCell} key={n}>
                    {formatNumberToLocaleString(h[statsByName[n].name])}
                  </td>
                ))}
                <td className={tableCell}>
                  £{integerToMoney(h.start_cost, 10)}
                </td>
                <td className={tableCell}>£{integerToMoney(h.end_cost, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SeasonHistoryTable;
