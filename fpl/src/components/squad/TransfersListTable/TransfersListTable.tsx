import { ThunkDispatch } from "core-integration/src/store";
import { getElementTypesBySquadPosition } from "core-integration/src/store/element-types/reducers";
import { updateElementTypeControl } from "core-integration/src/store/elements/thunks";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import {
  listTableBody,
  listTableHeader,
  listTablePosition,
  listTablePositionCell,
} from "plos/src/styles/listTables.css";
import {
  fixedTable,
  scrollContainer,
  visuallyHidden,
} from "plos/src/styles/utils.css";
import { getElementTypeNameByCount } from "plos/src/utils";
import { positionsByElementType } from "plos/src/utils/positionsByElementType";
import { useDispatch, useSelector } from "react-redux";
import { getStatDetails, statDetails } from "../../../utils/stats";
import {
  transfersTableElement,
  transfersTableFixture,
  transfersTableStat,
} from "./transfersListTable.css";
import TransfersListTableRow from "./TransfersListTableRow";
import { ITransferTableColumn, TransfersListTableProps } from "./types";

const TransfersListTable = ({
  handleOpenElemListSheet,
  proposedElements,
  handleElementClick,
}: TransfersListTableProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const elementTypesByPosition = useSelector(getElementTypesBySquadPosition);
  const currencyDivisor = 10;

  const showElementType = (elementTypeId: number) => {
    dispatch(updateElementTypeControl(elementTypeId));
  };

  const statColumns: ITransferTableColumn[] = [
    { ...getStatDetails("now_cost")!, label: "Current Price", shortName: "CP" },
    { key: "selling_price", label: "Selling Price", shortName: "SP" },
    { key: "purchase_price", label: "Purchase Price", shortName: "PP" },
    statDetails.form,
    statDetails.total_points,
  ];

  return (
    <div className={scrollContainer}>
      <table aria-label="Transfers List" className={fixedTable}>
        <thead>
          <tr>
            <th scope="col" className={transfersTableElement}>
              <div className={listTableHeader}>Player</div>
            </th>
            {statColumns.map((stat) => (
              <th key={stat.key} scope="col" className={transfersTableStat}>
                <InfoText label={stat.label}>{stat.shortName}</InfoText>
              </th>
            ))}
            <th scope="col" className={transfersTableFixture}>
              <InfoText label="Fixture next Gameweek">Fix</InfoText>
            </th>
            <th scope="col" className={transfersTableStat}>
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
                <TransfersListTableRow
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
export default TransfersListTable;
