import { getTeamsById } from "core-integration/src/store/teams/reducers";
import ElementDialogButton from "plos/src/components/ElementDialogButton";
import ElementInTable from "plos/src/components/ElementInTable";
import {
  listTableCell,
  listTableRowStyles,
} from "plos/src/styles/listTables.css";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { useSelector } from "react-redux";
import {
  elementContentWrapper,
  elementInTableWrapper,
  entryTableElement,
} from "../entryEventTable.css";
import { EntryEventRowProps } from "../types";

const EntryEventTableRow = ({
  chipName,
  data,
  pick,
  element,
  stats,
  renderDreamTeam,
}: EntryEventRowProps) => {
  const teamsById = useSelector(getTeamsById);

  return (
    <tr className={listTableRowStyles}>
      <th scope="row" className={entryTableElement}>
        <span className={visuallyHidden}>
          {element.web_name}, {teamsById[element.team].name}
        </span>
        <div className={elementContentWrapper} aria-hidden="true">
          <ElementDialogButton elementId={element.id} variant="list" />
          <div className={elementInTableWrapper}>
            <ElementInTable
              element={element}
              team={teamsById[element.team]}
              chipName={chipName ?? undefined}
              pick={pick}
              renderDreamTeam={renderDreamTeam}
            />
          </div>
        </div>
      </th>
      <td className={listTableCell}>
        {data.total_points * Math.max(pick.multiplier, 1)}
      </td>
      {stats.map((s) => (
        <td className={listTableCell} key={s.name}>
          {data[s.name]}
        </td>
      ))}
    </tr>
  );
};

export default EntryEventTableRow;
