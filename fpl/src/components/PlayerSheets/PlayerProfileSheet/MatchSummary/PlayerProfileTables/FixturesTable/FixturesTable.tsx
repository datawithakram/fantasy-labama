import { RootState } from "core-integration/src/store";
import { getFixturesWithBlanks } from "core-integration/src/store/elements/reducers";
import { IElement } from "core-integration/src/store/elements/types";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import { PlayerNotesPropertyIcon } from "plos/src/components/playerNotes/PlayerNotesPropertyIcon";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import { stickyHeaderCell } from "plos/src/components/Table/tables.css";
import { ElementIcon } from "plos/src/components/tooltips/ElementIcon";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import { vars } from "plos/src/styles/theme.css";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { TableBody, TableHeader } from "react-aria-components";
import { useSelector } from "react-redux";
import {
  headerCell,
  tableCell,
  tableWrapper,
} from "../../../../../styles/sharedTableStyles.css";
import { getShortNameFromId } from "../../../../../utils/events";
import { playerNotesDropdownIconContainer } from "../../PlayerNotesDropdown/playerNotesDropdown.css";
import FixtureDifficultyCell from "../custom-cells/FixtureDifficultyCell/FixtureDifficultyCell";
import FixtureOppCell from "../custom-cells/FixtureOppCell/FixtureOppCell";
import KickoffTimeCell from "../custom-cells/KickoffTimeCell/KickoffTimeCell";
import { fdrCell, kickoffTimeCell } from "../tableStyles.css";
import { playerNotesCell } from "./fixturesTable.css";

interface FixturesTableProps {
  element: IElement;
}

const FixturesTable = ({ element }: FixturesTableProps) => {
  const teamsById = useSelector(getTeamsById);
  const fixtures = useSelector((state: RootState) =>
    getFixturesWithBlanks(state, element.id)
  );

  const formattedRiskProperty = (property?: string) => {
    switch (property) {
      case "intl_duty":
        return "International Duty";
      case "loan_ineligible":
        return "Ineligible vs Parent Club";
      case "blank_gw":
        return "No Fixture";
      default:
        return null;
    }
  };

  return (
    <div className={tableWrapper}>
      <Table>
        <TableHeader className={stickyHeaderCell}>
          <Row>
            <Column className={headerCell}>Date</Column>
            <Column className={`${headerCell} ${visuallyHidden}`}>
              Player Note
            </Column>
            <Column className={headerCell}>GW</Column>
            <Column isRowHeader className={headerCell}>
              OPP
            </Column>
            <Column className={headerCell}>
              <InfoText label="Fixture Difficulty Rating">FDR</InfoText>
            </Column>
          </Row>
        </TableHeader>
        <TableBody>
          {fixtures.map((f) => {
            const gameweekRiskProperty = element.scout_risks?.find(
              (risk) => risk.gameweek === f.event
            )?.property;
            return f.code ? (
              <Row key={f.code}>
                <Cell className={kickoffTimeCell}>
                  <KickoffTimeCell kickoffTime={f.kickoff_time} />
                </Cell>
                <Cell className={playerNotesCell}>
                  <ElementIcon
                    label={formattedRiskProperty(gameweekRiskProperty) ?? ""}
                  >
                    <span className={playerNotesDropdownIconContainer}>
                      <PlayerNotesPropertyIcon
                        property={gameweekRiskProperty}
                      />
                    </span>
                  </ElementIcon>
                </Cell>
                <Cell className={tableCell}>
                  {f.event ? getShortNameFromId(f.event, true) : ""}
                </Cell>
                <Cell className={tableCell}>
                  <FixtureOppCell
                    fixture={f}
                    element={element}
                    teamsById={teamsById}
                  />
                </Cell>
                <Cell className={fdrCell}>
                  <FixtureDifficultyCell
                    rating={
                      f.difficulty as keyof typeof vars.colors.difficulties
                    }
                  />
                </Cell>
              </Row>
            ) : (
              <Row key={f.event!}>
                <Cell className={kickoffTimeCell}>&nbsp;</Cell>
                <Cell className={playerNotesCell}>
                  <ElementIcon
                    label={formattedRiskProperty(gameweekRiskProperty) ?? ""}
                  >
                    <span className={playerNotesDropdownIconContainer}>
                      <PlayerNotesPropertyIcon
                        property={gameweekRiskProperty}
                      />
                    </span>
                  </ElementIcon>
                </Cell>
                <Cell className={tableCell}>
                  {f.event ? getShortNameFromId(f.event, true) : ""}
                </Cell>
                <Cell className={tableCell}>None</Cell>
                <Cell className={fdrCell}>&nbsp;</Cell>
              </Row>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default FixturesTable;
