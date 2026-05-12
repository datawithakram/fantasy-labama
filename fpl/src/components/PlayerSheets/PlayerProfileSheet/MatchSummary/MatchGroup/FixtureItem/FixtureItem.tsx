import {
  IElement,
  IElementFixture,
} from "core-integration/src/store/elements/types";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import { Badge } from "plos/src/components/Badge";
import { vars } from "plos/src/styles/theme.css";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { useSelector } from "react-redux";
import {
  getSuffixFromId,
  isElementFixtureHome,
} from "../../../../../../utils/fixtures";
import { AccessibleFixtureText } from "../../../../../AccessibleFixtureText";
import {
  badgeContainer,
  matchChip,
  matchListItem,
  matchRound,
  matchUnit,
  teamContainer,
  teamName,
} from "../styles.css";

const FixtureItem = ({
  element,
  fixture,
}: {
  element: IElement;
  fixture: IElementFixture;
}) => {
  const teamsById = useSelector(getTeamsById);

  const {
    id: fixtureId,
    team_a: teamA,
    team_h: teamH,
    event,
    difficulty,
  } = fixture;

  const isHome = isElementFixtureHome(element.team, teamH);
  const opponentTeam = isHome ? teamsById[teamA] : teamsById[teamH];

  const { short_name, name } = opponentTeam;

  const suffix = getSuffixFromId(fixtureId, isHome);

  return (
    <li className={matchListItem}>
      <div className={matchUnit}>
        {event && <span className={matchRound}>{`GW${event}`}</span>}
        <span className={teamContainer}>
          <div className={badgeContainer}>
            <Badge team={opponentTeam} isPresentation />
          </div>
          <span className={teamName} aria-hidden="true">
            {`${short_name} ${suffix}`}
          </span>
          <AccessibleFixtureText name={name} isHome={isHome} />
        </span>
        {difficulty !== null && (
          <div
            className={
              matchChip[difficulty as keyof typeof vars.colors.difficulties]
            }
          >
            <span className={visuallyHidden}>Fixture difficulty</span>
            {difficulty}
          </div>
        )}
      </div>
    </li>
  );
};

export default FixtureItem;
