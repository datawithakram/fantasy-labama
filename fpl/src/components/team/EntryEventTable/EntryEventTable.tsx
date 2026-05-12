import {
  getElementStats,
  getElementStatsByIdentifier,
} from "core-integration/src/store/element-stats/reducers";
import { IElementStat } from "core-integration/src/store/element-stats/types";
import { getElementTypesBySquadPosition } from "core-integration/src/store/element-types/reducers";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import {
  listTableBody,
  listTableElementColumn,
  listTableHeader,
  listTablePosition,
  listTablePositionCell,
  listTableStatColumn,
} from "plos/src/styles/listTables.css";
import { fixedTable, scrollContainer } from "plos/src/styles/utils.css";
import { getStatAbbr } from "plos/src/utils/elementStats";
import { getStartingAndBenchPlayers } from "plos/src/utils/getStartingAndBenchPlayers";
import { positionsByElementType } from "plos/src/utils/positionsByElementType";
import { useSelector } from "react-redux";
import EntryEventTableRow from "./EntryEventTableRow/EntryEventTableRow";
import { EntryEventTableProps } from "./types";

const EntryEventTable = ({
  dataById,
  elementsById,
  picks,
  chipName,
  renderDreamTeam,
}: EntryEventTableProps) => {
  const stats = useSelector(getElementStats);
  const statsByName: Record<string, IElementStat> = useSelector(
    getElementStatsByIdentifier
  );
  const elementTypesByPosition = useSelector(getElementTypesBySquadPosition);

  const { benchPlayers, playersByElementType } = getStartingAndBenchPlayers(
    picks,
    elementsById,
    chipName
  );

  // Table structure: Player column + Points column + dynamic stat columns
  const ELEMENT_COLUMN_COUNT = 1;
  const POINTS_COLUMN_COUNT = 1;
  const totalColumns =
    ELEMENT_COLUMN_COUNT + POINTS_COLUMN_COUNT + stats.length;

  return (
    <div className={scrollContainer}>
      <table aria-label="Points List" className={fixedTable}>
        <thead>
          <tr>
            <th className={listTableElementColumn} scope="col">
              <div className={listTableHeader}>Player</div>
            </th>
            <th className={listTableStatColumn} scope="col">
              <InfoText label="Points">Pts</InfoText>
            </th>
            {stats.map((s) => (
              <th className={listTableStatColumn} scope="col" key={s.name}>
                <InfoText label={s.label}>
                  {getStatAbbr(s.name, statsByName)}
                </InfoText>
              </th>
            ))}
          </tr>
        </thead>

        {Object.keys(positionsByElementType).map((et) => {
          const positions = positionsByElementType[et];
          const positionPicks = playersByElementType[et];

          // Skip if no starting players in this position
          if (positionPicks.length === 0) {
            return null;
          }

          return (
            <tbody className={listTableBody} key={et}>
              <tr>
                <th
                  scope="rowgroup"
                  className={listTablePositionCell}
                  colSpan={totalColumns}
                >
                  <div className={listTablePosition}>
                    {positionPicks.length > 1
                      ? elementTypesByPosition[positions[0]].thisType
                          .plural_name
                      : elementTypesByPosition[positions[0]].thisType
                          .singular_name}
                  </div>
                </th>
              </tr>
              {positionPicks.map((p) => (
                <EntryEventTableRow
                  key={p.element}
                  pick={p}
                  element={elementsById[p.element]}
                  stats={stats}
                  data={
                    dataById
                      ? dataById[p.element].stats
                      : elementsById[p.element]
                  }
                  chipName={chipName}
                  renderDreamTeam={renderDreamTeam}
                />
              ))}
            </tbody>
          );
        })}

        {benchPlayers.length > 0 && (
          <tbody className={listTableBody}>
            <tr>
              <th
                scope="rowgroup"
                className={listTablePositionCell}
                colSpan={totalColumns}
              >
                <div className={listTablePosition}>Substitutes</div>
              </th>
            </tr>
            {benchPlayers.map((p) => (
              <EntryEventTableRow
                key={p.element}
                pick={p}
                element={elementsById[p.element]}
                stats={stats}
                data={
                  dataById ? dataById[p.element].stats : elementsById[p.element]
                }
                chipName={chipName}
                renderDreamTeam={renderDreamTeam}
              />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default EntryEventTable;
