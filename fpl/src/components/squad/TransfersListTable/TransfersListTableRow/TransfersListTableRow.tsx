import { RootState } from "core-integration/src/store";
import { getElementsById } from "core-integration/src/store/elements/reducers";
import { getNextEvent } from "core-integration/src/store/events/reducers";
import {
  getElementEventOpponents,
  getFixturesForEventByTeam,
} from "core-integration/src/store/fixtures/reducers";
import { getSavedPicks } from "core-integration/src/store/squad/reducers";
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
import { getAccessibleFixtureLabels } from "plos/src/utils/fixtures";
import { integerToMoneyWithCurrency } from "plos/src/utils/money";
import { Fragment } from "react";
import { useSelector } from "react-redux";
import { TransfersListTableRowProps } from "./types";

const TransfersListTableRow = ({
  currencyDivisor,
  elementTypesByPosition,
  showElementType,
  pos,
  proposedElements,
  handleOpenElemListSheet,
  handleElementClick,
  statColumns,
}: TransfersListTableRowProps) => {
  const teamsById = useSelector(getTeamsById);
  const savedPicks = useSelector(getSavedPicks);
  const elementsById = useSelector(getElementsById);

  let element = proposedElements[pos];
  // TODO - We need a visual indicator of the row elementState, in the past we
  // have rendered the '0' shirt instead of the regular one
  let elementState: "original" | "removed" | "replaced" = "original";
  if (!element) {
    element = elementsById[savedPicks[pos].element];
    elementState = "removed";
  } else if (element.id !== savedPicks[pos].element) {
    elementState = "replaced";
  }
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
  const accessibleFixtureLabels = getAccessibleFixtureLabels(
    element,
    fixtures,
    teamsById
  );

  if (!elementTypesByPosition) {
    return null;
  }

  const renderTransferPrice = (
    priceKey: "selling_price" | "purchase_price"
  ) => {
    const price =
      elementState === "replaced"
        ? element.now_cost
        : savedPicks[pos][priceKey];
    return integerToMoneyWithCurrency(price, 10);
  };

  const renderStatValue = (statKey: string) => {
    switch (statKey) {
      case "now_cost":
        return integerToMoneyWithCurrency(element.now_cost, currencyDivisor);
      case "selling_price":
        return renderTransferPrice("selling_price");
      case "purchase_price":
        return renderTransferPrice("purchase_price");
      default:
        return element[statKey as keyof typeof element];
    }
  };

  return (
    <tr className={listTableRowStyles}>
      {elementState !== "removed" ? (
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
                renderDreamTeam={element.in_dreamteam}
              />
            </div>
          </th>
          {statColumns.map((stat) => (
            <td key={stat.key} className={listTableCell}>
              {renderStatValue(stat.key)}
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
          <td className={listTableCell}>
            <AddElement element={element} />
          </td>
        </>
      ) : (
        <th className={listTablePositionCell} colSpan={statColumns.length + 3}>
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

export default TransfersListTableRow;
