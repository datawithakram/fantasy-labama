import {
  baseMatchChip,
  blankMatch,
  matchListItem,
  matchRound,
  matchUnit,
  teamContainer,
  teamName,
} from "../styles.css";

import { IElementFixtureBlank } from "core-integration/src/store/elements/types";

interface BlankMatchProps {
  fixture: IElementFixtureBlank;
}

const BlankMatch = ({ fixture }: BlankMatchProps) => {
  const { event } = fixture;

  return (
    <li className={matchListItem}>
      <div className={matchUnit}>
        {event && <span className={matchRound}>{`GW${event}`}</span>}
        <span className={teamContainer}>
          <div className={blankMatch} />
          <span className={teamName}>Blank</span>
        </span>
        <span className={baseMatchChip}>-</span>
      </div>
    </li>
  );
};

export default BlankMatch;
