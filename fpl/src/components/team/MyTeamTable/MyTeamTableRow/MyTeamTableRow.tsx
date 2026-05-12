import { RootState } from "core-integration/src/store";
import { getElementEventOpponents } from "core-integration/src/store/fixtures/reducers";
import ElementDialogButton from "plos/src/components/ElementDialogButton";
import ElementInTable from "plos/src/components/ElementInTable";
import {
  listTableCell,
  listTableElementWrap,
  listTableRowStyles,
  myTeamTableElement,
} from "plos/src/styles/listTables.css";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { getAccessibleFixtureLabels } from "plos/src/utils/fixtures";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { MyTeamTableRowProps } from "../types";

const MyTeamTableRow = ({
  chipInPlayName,
  pick,
  element,
  fixturesForNextEventByTeam,
  teamsById,
  handleElementClick,
  renderDreamTeam,
  statColumns,
}: MyTeamTableRowProps) => {
  const fixtures =
    element && fixturesForNextEventByTeam
      ? fixturesForNextEventByTeam[element.team]
      : [];
  const elementEventOpponents = useSelector((state: RootState) =>
    fixtures.length && element
      ? getElementEventOpponents(state, element, fixtures)
      : []
  );
  const accessibleFixtureLabels = getAccessibleFixtureLabels(
    element,
    fixtures,
    teamsById
  );

  const renderStatValue = (stat: { key: string }) => {
    return element[stat.key as keyof typeof element];
  };

  return (
    <tr className={listTableRowStyles}>
      <th scope="row" className={myTeamTableElement}>
        <span className={visuallyHidden}>
          {element.web_name}, {teamsById[element.team].name}
        </span>
        <div className={listTableElementWrap} aria-hidden="true">
          <ElementDialogButton elementId={element.id} variant="list" />
          <ElementInTable
            element={element}
            team={teamsById[element.team]}
            actionMe={() => handleElementClick(pick)}
            chipName={chipInPlayName ?? undefined}
            pick={pick}
            renderDreamTeam={renderDreamTeam}
          />
        </div>
      </th>
      <td className={listTableCell}>{element.form}</td>
      {statColumns.map((stat) => (
        <td key={stat.key} className={listTableCell}>
          {renderStatValue(stat)}
        </td>
      ))}
      <td className={listTableCell}>
        {elementEventOpponents.length ? (
          elementEventOpponents.map((opp, index) => (
            <Fragment key={`${opp}-${index}`}>
              <div aria-hidden="true">{opp}</div>
              <div className={visuallyHidden}>
                {accessibleFixtureLabels[index]}
              </div>
            </Fragment>
          ))
        ) : (
          <>-</>
        )}
      </td>
    </tr>
  );
};

export default MyTeamTableRow;
