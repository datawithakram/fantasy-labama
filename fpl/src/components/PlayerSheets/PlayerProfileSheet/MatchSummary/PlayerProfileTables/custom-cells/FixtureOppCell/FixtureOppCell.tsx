import {
  IElement,
  IElementFixture,
} from "core-integration/src/store/elements/types";
import { ITeamsById } from "core-integration/src/store/teams/types";
import { Badge } from "plos/src/components/Badge";
import {
  getSuffixFromId,
  isElementFixtureHome,
} from "../../../../../../utils/fixtures";
import { AccessibleFixtureText } from "../../../../../AccessibleFixtureText";
import { badgeWrap } from "../../tableStyles.css";
import { cellWrapper } from "./fixtureOppCell.css";

interface FixtureOppCellProps {
  fixture: IElementFixture;
  element: IElement;
  teamsById: ITeamsById;
}

const FixtureOppCell = ({
  fixture,
  element,
  teamsById,
}: FixtureOppCellProps) => {
  const isHome = isElementFixtureHome(element.team, fixture.team_h);
  const oppTeam = isHome
    ? teamsById[fixture.team_a]
    : teamsById[fixture.team_h];
  const { name, short_name: shortName } = oppTeam;

  const suffix = getSuffixFromId(fixture.id, isHome);

  return (
    <div className={cellWrapper}>
      <span className={badgeWrap}>
        <Badge team={oppTeam} isPresentation />
      </span>
      <span aria-hidden="true">
        <span>{shortName}</span> {suffix}
      </span>
      <AccessibleFixtureText name={name} isHome={isHome} />
    </div>
  );
};

export default FixtureOppCell;
