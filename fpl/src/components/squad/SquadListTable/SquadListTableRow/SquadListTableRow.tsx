import { RootState } from "core-integration/src/store";
import { getNextEvent } from "core-integration/src/store/events/reducers";
import {
  getElementEventOpponents,
  getFixturesForEventByTeam,
} from "core-integration/src/store/fixtures/reducers";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import AddElement from "plos/src/components/AddElement";
import { Button } from "plos/src/components/buttons/Button";
import ElementDialogButton from "plos/src/components/ElementDialogButton";
import ElementInTable from "plos/src/components/ElementInTable";
import {
  listTableCell,
  listTableElement,
  listTableElementWrap,
  listTablePlaceholderButtonWrap,
  listTablePositionCell,
  listTableRowStyles,
} from "plos/src/styles/listTables.css";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { integerToMoneyWithCurrency } from "plos/src/utils/money";
import { useSelector } from "react-redux";
import { SquadListTableRowProps } from "./types";

const SquadListTableRow = ({
  currencyDivisor,
  elementTypesByPosition,
  showElementType,
  pos,
  proposedElements,
  handleOpenElemListSheet,
  handleElementClick,
  statColumns,
}: SquadListTableRowProps) => {
  const teamsById = useSelector(getTeamsById);
  const element = proposedElements[pos];
  const nextEvent = useSelector(getNextEvent);
  const fixturesForNextEventByTeam = useSelector((state: RootState) =>
    nextEvent ? getFixturesForEventByTeam(state, nextEvent.id) : null
  );
  const fixtures =
    element && fixturesForNextEventByTeam
      ? fixturesForNextEventByTeam[element.team]
      : [];
  const elementEventOpponents = useSelector((state: RootState) =>
    fixtures.length && element
      ? getElementEventOpponents(state, element, fixtures)
      : []
  );

  if (!elementTypesByPosition) {
    return null;
  }

  const renderStatValue = (stat: { key: string }) => {
    if (stat.key === "now_cost") {
      return integerToMoneyWithCurrency(element.now_cost, currencyDivisor);
    }
    return element[stat.key as keyof typeof element];
  };

  return (
    <tr className={listTableRowStyles}>
      {element ? (
        <>
          <th scope="row" className={listTableElement}>
            <span className={visuallyHidden}>
              {element.web_name}, {teamsById[element.team].name}
            </span>
            <div className={listTableElementWrap} aria-hidden="true">
              <ElementDialogButton elementId={element.id} variant="list" />
              <ElementInTable
                element={element}
                team={teamsById[element.team]}
                actionMe={() => handleElementClick(pos)}
              />
            </div>
          </th>
          {statColumns.map((stat) => (
            <td key={stat.key} className={listTableCell}>
              {renderStatValue(stat)}
            </td>
          ))}
          <td className={listTableCell}>
            {elementEventOpponents.length ? (
              elementEventOpponents.map((opp, index) => (
                <div key={fixtures[index].id}>{opp}</div>
              ))
            ) : (
              <>-</>
            )}
          </td>
          <td className={listTableCell}>
            <AddElement element={element} />
          </td>
        </>
      ) : (
        <th
          scope="row"
          className={listTablePositionCell}
          colSpan={statColumns.length + 3}
        >
          <div className={listTablePlaceholderButtonWrap}>
            <Button
              onPress={() => {
                showElementType(elementTypesByPosition[pos].thisType.id);
                handleOpenElemListSheet();
              }}
              styleVariant="tonal"
              size="small"
            >
              Select {elementTypesByPosition[pos].thisType.singular_name}
            </Button>
          </div>
        </th>
      )}
    </tr>
  );
};

export default SquadListTableRow;
