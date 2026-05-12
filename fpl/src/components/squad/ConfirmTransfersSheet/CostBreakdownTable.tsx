import { useSelector } from "react-redux";
import { getFreeTransfers } from "core-integration/src/store/squad/reducers";
import {
  containerStyles,
  costCell,
  costTableWrapper,
  tableTitle,
} from "./confirmTransfersSheet.css";
import { ITransferState } from "core-integration/src/store/my-team/types";
import { IElementsById } from "core-integration/src/store/elements/types";
import { ITransfersData } from "core-integration/src/store/squad/types";
import {
  leftAlignedCell,
  tableCell,
  tableStyles,
  tHead,
  totalsCell,
} from "../../../styles/sharedTableStyles.css";

interface CostBreakdownTableProps {
  elementsById: IElementsById;
  transfers: ITransfersData[];
  transferState: ITransferState;
  transferCosts: number;
}

const CostBreakdownTable = ({
  elementsById,
  transfers,
  transferState,
  transferCosts,
}: CostBreakdownTableProps) => {
  const freeTransfers = useSelector(getFreeTransfers);

  return (
    <div className={containerStyles}>
      <h2 className={tableTitle}>Cost breakdown</h2>
      <div className={costTableWrapper}>
        <table className={tableStyles}>
          <thead className={tHead}>
            <tr>
              <th className={leftAlignedCell} scope="col">
                Out
              </th>
              <th className={leftAlignedCell} scope="col">
                In
              </th>
              <th className={costCell} scope="col">
                Cost
              </th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((t, index) => (
              <tr key={t.element_out}>
                <td className={tableCell}>
                  {t.element_out ? elementsById[t.element_out].web_name : "-"}
                </td>
                <td className={tableCell}>
                  {elementsById[t.element_in].web_name}
                </td>
                <td className={tableCell}>
                  {transferCosts && index >= freeTransfers
                    ? transferState.cost
                    : 0}{" "}
                  pts
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className={totalsCell}>&nbsp;</td>
              <th className={totalsCell} align={"left"} scope="row">
                Total cost
              </th>
              <td className={totalsCell}>{transferCosts} pts</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default CostBreakdownTable;
