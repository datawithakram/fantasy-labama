import { getElements } from "core-integration/src/store/elements/reducers";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import orderBy from "lodash/orderBy";
import { Column, Table } from "plos/src/components/Table";
import TransferredOutIcon from "plos/src/img/icons/transfer-arrow-left.svg?react";
import TransferredInIcon from "plos/src/img/icons/transfer-arrow-right.svg?react";
import { fixedTable } from "plos/src/styles/utils.css";
import { TableBody, TableHeader } from "react-aria-components";
import { useSelector } from "react-redux";
import { StatusPanel } from "../StatusPanel";
import {
  elementColumnStyles,
  elementDialogColumnStyles,
  styledTransferArrowIcon,
  transferIconColumnStyles,
  transferredColumnStyles,
} from "./transfersTable.css";
import TransfersTableRow from "./TransfersTableRow";
import { TransferTableProps } from "./types";

const TransfersTable = ({ isOut }: TransferTableProps) => {
  const elements = useSelector(getElements);
  const teamsById = useSelector(getTeamsById);
  const stat = isOut ? "transfers_out_event" : "transfers_in_event";

  return (
    <StatusPanel
      title={`Top Transfers ${isOut ? "out" : "in"} this Gameweek`}
      url={`/statistics/${stat}`}
    >
      <Table className={fixedTable} aria-label="Transfers">
        <TableHeader>
          <Column className={elementDialogColumnStyles} isRowHeader>
            Player
          </Column>
          <Column className={transferIconColumnStyles}>&nbsp;</Column>
          <Column className={elementColumnStyles}>&nbsp;</Column>
          <Column className={transferredColumnStyles}>Transferred</Column>
        </TableHeader>
        <TableBody>
          {orderBy(elements, [stat], ["desc"])
            .slice(0, 5)
            .map((e) => (
              <TransfersTableRow
                key={e.id}
                element={e}
                team={teamsById[e.team]}
                stat={stat}
                icon={
                  isOut ? (
                    <TransferredOutIcon className={styledTransferArrowIcon} />
                  ) : (
                    <TransferredInIcon className={styledTransferArrowIcon} />
                  )
                }
              />
            ))}
        </TableBody>
      </Table>
    </StatusPanel>
  );
};

export default TransfersTable;
