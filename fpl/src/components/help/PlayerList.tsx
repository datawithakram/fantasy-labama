import { getElementTypes } from "core-integration/src/store/element-types/reducers";
import { IElementType } from "core-integration/src/store/element-types/types";
import { getElements } from "core-integration/src/store/elements/reducers";
import { IElement } from "core-integration/src/store/elements/types";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import { ITeam, ITeamsById } from "core-integration/src/store/teams/types";
import { integerToMoney } from "core-integration/src/utils/money";
import Subheading from "plos/src/components/Subheading";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import { TableBody, TableHeader } from "react-aria-components";
import { useSelector } from "react-redux";
import { HelmetHead } from "../HelmetHead";

interface IElementListElementProps {
  element: IElement;
  team: ITeam;
}
const ElementListElement = ({ element, team }: IElementListElementProps) => (
  <Row>
    <Cell>{element.web_name}</Cell>
    <Cell>{team.name}</Cell>
    <Cell>{element.total_points}</Cell>
    <Cell>£{integerToMoney(element.now_cost, 10)}</Cell>
  </Row>
);

interface IElementListTableProps {
  elements: IElement[];
  teamsById: ITeamsById;
}
const ElementListTable = ({ elements, teamsById }: IElementListTableProps) => (
  <Table aria-label="Element List">
    <TableHeader>
      <Column isRowHeader>Player</Column>
      <Column>Team</Column>
      <Column>Points</Column>
      <Column>Cost</Column>
    </TableHeader>
    <TableBody>
      {elements.map((element) => (
        <ElementListElement
          element={element}
          key={element.id}
          team={teamsById[element.team]}
        />
      ))}
    </TableBody>
  </Table>
);

interface IElementListPositionProps {
  elements: IElement[];
  elementType: IElementType;
  teamsById: ITeamsById;
}
const ElementListPosition = ({
  elements,
  elementType,
  teamsById,
}: IElementListPositionProps) => {
  const halfElements = Math.ceil(elements.length / 2);
  const firstHalfElements = elements.slice(0, halfElements);
  const secondHalfElements = elements.slice(halfElements, elements.length);
  return (
    <SurfaceContainer>
      <Subheading>{elementType.plural_name}</Subheading>
      <div style={{ display: "flex" }}>
        <ElementListTable elements={firstHalfElements} teamsById={teamsById} />
        <ElementListTable elements={secondHalfElements} teamsById={teamsById} />
      </div>
    </SurfaceContainer>
  );
};

const PlayerList = () => {
  const elements = useSelector(getElements);
  const elementTypes = useSelector(getElementTypes);
  const teamsById = useSelector(getTeamsById);

  return (
    <>
      <HelmetHead
        title="Full Player List 2025/26 | Fantasy Premier League "
        description="To view the Fantasy Premier League Player List for all players in season 2025/26, visit the official website of the Premier League."
      />
      <div className="ism-main-full">
        {elementTypes.map((et) => (
          <ElementListPosition
            elements={elements
              .filter((e) => e.element_type === et.id)
              .sort((a, b) => b.now_cost - a.now_cost)}
            elementType={et}
            key={et.id}
            teamsById={teamsById}
          />
        ))}
      </div>
    </>
  );
};

export default PlayerList;
