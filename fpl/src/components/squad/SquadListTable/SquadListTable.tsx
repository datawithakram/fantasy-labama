import { ThunkDispatch } from "core-integration/src/store";
import { getElementTypesBySquadPosition } from "core-integration/src/store/element-types/reducers";
import { updateElementTypeControl } from "core-integration/src/store/elements/thunks";
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
import {
  fixedTable,
  scrollContainer,
  visuallyHidden,
} from "plos/src/styles/utils.css";
import { getElementTypeNameByCount } from "plos/src/utils";
import { positionsByElementType } from "plos/src/utils/positionsByElementType";
import { useDispatch, useSelector } from "react-redux";
import { getStatColumns, statDetails } from "../../../utils/stats";
import SquadListTableRow from "./SquadListTableRow";
import { SquadListTableProps } from "./types";

const SquadListTable = ({
  handleOpenElemListSheet,
  proposedElements,
  handleElementClick,
}: SquadListTableProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const elementTypesByPosition = useSelector(getElementTypesBySquadPosition);
  const currencyDivisor = 10;

  const showElementType = (elementTypeId: number) => {
    dispatch(updateElementTypeControl(elementTypeId));
  };

  const statColumns = getStatColumns([
    statDetails.now_cost,
    statDetails.selected_by_percent,
    statDetails.total_points,
  ]);

  return (
    <div className={scrollContainer}>
      <table aria-label="Squad List" className={fixedTable}>
        <thead>
          <tr>
            <th scope="col" className={listTableElementColumn}>
              <div className={listTableHeader}>Player</div>
            </th>
            {statColumns.map((stat) => (
              <th key={stat.key} scope="col" className={listTableStatColumn}>
                <InfoText label={stat.label}>{stat.shortName}</InfoText>
              </th>
            ))}
            <th scope="col" className={listTableFixtureColumn}>
              <InfoText label="Fixture next Gameweek">Fix</InfoText>
            </th>
            <th scope="col" className={listTableStatColumn}>
              <span className={visuallyHidden}>Remove</span>
            </th>
          </tr>
        </thead>

        {Object.keys(positionsByElementType).map((et) => {
          const positions = positionsByElementType[et];

          return (
            <tbody className={listTableBody} key={et}>
              <tr>
                <th
                  scope="rowgroup"
                  className={listTablePositionCell}
                  colSpan={statColumns.length + 3}
                >
                  <div className={listTablePosition}>
                    {getElementTypeNameByCount(
                      positions,
                      elementTypesByPosition
                    )}
                  </div>
                </th>
              </tr>
              {positions.map((pos) => (
                <SquadListTableRow
                  key={pos}
                  currencyDivisor={currencyDivisor}
                  elementTypesByPosition={elementTypesByPosition}
                  pos={pos}
                  proposedElements={proposedElements}
                  showElementType={showElementType}
                  handleOpenElemListSheet={handleOpenElemListSheet}
                  handleElementClick={handleElementClick}
                  statColumns={statColumns}
                />
              ))}
            </tbody>
          );
        })}
      </table>
    </div>
  );
};
export default SquadListTable;
