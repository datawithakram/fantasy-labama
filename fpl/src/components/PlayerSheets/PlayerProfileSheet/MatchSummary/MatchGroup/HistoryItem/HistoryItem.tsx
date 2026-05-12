import { IElementHistory } from "core-integration/src/store/elements/types";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import { Badge } from "plos/src/components/Badge";
import { useSelector } from "react-redux";
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

const HistoryItem = ({ history }: { history: IElementHistory }) => {
  const teamsById = useSelector(getTeamsById);
  const opponentTeam = teamsById[history.opponent_team];
  const { short_name, name } = opponentTeam;
  const { round, total_points: totalPoints, was_home } = history;

  return (
    <li className={matchListItem}>
      <div className={matchUnit}>
        <span
          aria-label={`Gameweek ${round}`}
          className={matchRound}
        >{`GW${round}`}</span>
        <span className={teamContainer}>
          <div className={badgeContainer}>
            <Badge team={opponentTeam} isPresentation />
          </div>
          <span className={teamName} aria-hidden="true">
            {short_name}
          </span>
          <AccessibleFixtureText name={name} isHome={was_home} />
        </span>
        <span
          aria-label={`${totalPoints} points`}
          className={matchChip.default}
          dir="ltr"
        >{`${totalPoints}pts`}</span>
      </div>
    </li>
  );
};

export default HistoryItem;
