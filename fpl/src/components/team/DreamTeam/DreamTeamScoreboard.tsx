import {
  pointsPanel,
  primaryPanel,
} from "../PointsScoreboard/pointsScoreboard.css";
import ElementAvatar from "plos/src/components/avatars/ElementAvatar";
import { useSelector } from "react-redux";
import { getElementsById } from "core-integration/src/store/elements/reducers";
import { IDreamTeamData } from "core-integration/src/store/dream-teams/types";
import { IEvent } from "core-integration/src/store/events/types";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import {
  headerItem,
  headerWrapper,
  itemHeading,
  playerInfoWrapper,
  points,
  pointsContainer,
  pointValue,
  subheading,
} from "./dreamTeam.css";
import MoreLink from "plos/src/components/links/MoreLink";

interface DreamTeamScoreboardProps {
  event: IEvent;
  data: IDreamTeamData;
  now: IEvent;
}

const DreamTeamScoreboard = ({
  event,
  data,
  now,
}: DreamTeamScoreboardProps) => {
  const teamsById = useSelector(getTeamsById);
  const elementsById = useSelector(getElementsById);
  const topPlayer = elementsById[data.top_player.id];

  return (
    <div className={headerWrapper}>
      <div className={headerItem}>
        <h3 className={itemHeading}>Total Points</h3>
        <div className={pointsContainer}>
          <div className={primaryPanel}>
            <div className={pointsPanel}>
              <div className={pointValue}>
                {data.team.reduce((total, e) => total + e.points, 0)}
              </div>
            </div>
          </div>
        </div>
        {event ? (
          <MoreLink to="/team-of-the-week/">
            <span className={subheading}>Overall</span>
          </MoreLink>
        ) : (
          <MoreLink to={`/team-of-the-week/${now.id}`}>
            <span className={subheading}>Gameweek</span>
          </MoreLink>
        )}
      </div>
      <div className={headerItem}>
        <h3 className={itemHeading}>
          Player of the {event ? "Week" : "Season"}
        </h3>
        <ElementAvatar element={topPlayer} size="large" />
        <div className={playerInfoWrapper}>
          <span className={subheading}>{topPlayer.web_name}</span>
          <div className={points}>
            {teamsById[topPlayer.team].short_name} {data.top_player.points}pts
          </div>
        </div>
      </div>
    </div>
  );
};

export default DreamTeamScoreboard;
