import { getElementTypesBySquadPosition } from "core-integration/src/store/element-types/reducers";
import { getFixturesForNextEventByTeam } from "core-integration/src/store/fixtures/reducers";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import {
  listTableBody,
  listTableElementColumn,
  listTableFixtureColumn,
  listTableHeader,
  listTablePosition,
  listTablePositionCell,
  listTableStatColumn,
} from "plos/src/styles/listTables.css";
import { fixedTable, scrollContainer } from "plos/src/styles/utils.css";
import { getStartingAndBenchPlayers } from "plos/src/utils/getStartingAndBenchPlayers";
import { positionsByElementType } from "plos/src/utils/positionsByElementType";
import { useSelector } from "react-redux";
import { getStatColumns, statDetails } from "../../../utils/stats";
import MyTeamTableRow from "./MyTeamTableRow";
import { MyTeamTableProps } from "./types";

const MyTeamTable = ({
  picks,
  elementsById,
  chipInPlayName,
  handleElementClick,
  renderDreamTeam,
}: MyTeamTableProps) => {
  const fixturesForNextEventByTeam = useSelector(getFixturesForNextEventByTeam);
  const teamsById = useSelector(getTeamsById);

  const elementTypesByPosition = useSelector(getElementTypesBySquadPosition);

  const { benchPlayers, playersByElementType } = getStartingAndBenchPlayers(
    picks,
    elementsById,
    chipInPlayName
  );

  const statColumns = getStatColumns([
    statDetails.event_points,
    statDetails.total_points,
  ]);

  return (
    <div className={scrollContainer}>
      <table aria-label="Pick Team List" className={fixedTable}>
        <thead>
          <tr>
            <th scope="col" className={listTableElementColumn}>
              <div className={listTableHeader}>Player</div>
            </th>

            <th scope="col" className={listTableStatColumn}>
              Form
            </th>
            {statColumns.map((stat) => (
              <th key={stat.key} scope="col" className={listTableStatColumn}>
                <InfoText label={stat.label}>{stat.shortName}</InfoText>
              </th>
            ))}
            <th scope="col" className={listTableFixtureColumn}>
              <InfoText label="Fixture next Gameweek">Fix</InfoText>
            </th>
          </tr>
        </thead>

        {Object.keys(positionsByElementType).map((et) => {
          const positions = positionsByElementType[et];
          const positionPicks = playersByElementType[et] || [];

          // Skip if no players in this position
          if (positionPicks.length === 0) {
            return null;
          }

          return (
            <tbody className={listTableBody} key={et}>
              <tr>
                <th
                  scope="rowgroup"
                  className={listTablePositionCell}
                  colSpan={statColumns.length + 3}
                >
                  <div className={listTablePosition}>
                    {elementTypesByPosition[positions[0]].thisType.plural_name}
                  </div>
                </th>
              </tr>
              {positionPicks.map((p) => (
                <MyTeamTableRow
                  key={p.element}
                  pick={p}
                  chipInPlayName={chipInPlayName}
                  element={elementsById[p.element]}
                  fixturesForNextEventByTeam={fixturesForNextEventByTeam}
                  teamsById={teamsById}
                  handleElementClick={handleElementClick}
                  renderDreamTeam={renderDreamTeam}
                  statColumns={statColumns}
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
                colSpan={statColumns.length + 3}
              >
                <div className={listTablePosition}>Substitutes</div>
              </th>
            </tr>
            {benchPlayers.map((p) => (
              <MyTeamTableRow
                key={p.element}
                pick={p}
                chipInPlayName={chipInPlayName}
                element={elementsById[p.element]}
                fixturesForNextEventByTeam={fixturesForNextEventByTeam}
                teamsById={teamsById}
                handleElementClick={handleElementClick}
                renderDreamTeam={renderDreamTeam}
                statColumns={statColumns}
              />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
};
export default MyTeamTable;
