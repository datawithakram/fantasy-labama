import { ThunkDispatch } from "core-integration/src/store";
import { showElementSummary } from "core-integration/src/store/elements/thunks";
import ElementDialogButton from "plos/src/components/ElementDialogButton";
import ElementInTable from "plos/src/components/ElementInTable";
import { Cell, Row } from "plos/src/components/Table";
import { useDispatch } from "react-redux";
import {
  styledElementInfoButton,
  transfersElementCell,
  transfersTableCell,
} from "./transfersTableRow.css";
import { TransfersTableRowProps } from "./types";

const TransfersTableRow = ({
  element,
  team,
  stat,
  icon,
}: TransfersTableRowProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const showElementDialog = (elementId: number) => {
    dispatch(showElementSummary(elementId));
  };
  return (
    <Row key={element.id}>
      <Cell className={styledElementInfoButton}>
        <ElementDialogButton elementId={element.id} variant="list" />
      </Cell>
      <Cell>{icon}</Cell>
      <Cell className={transfersElementCell}>
        <ElementInTable
          element={element}
          team={team}
          actionMe={() => showElementDialog(element.id)}
        />
      </Cell>
      <Cell className={transfersTableCell}>{element[stat]}</Cell>
    </Row>
  );
};

export default TransfersTableRow;
