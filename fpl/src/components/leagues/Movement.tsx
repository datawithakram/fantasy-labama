import MovementIcon from "../../img/icons/movement.svg?react";
import NewIcon from "../../img/icons/new.svg?react";
import {
  movementIconContainer,
  movementIconStyles,
  newIconStyles,
} from "../icons/movement.css";

interface IProps {
  lastRank: number | null;
  rank: number | null;
}

type MovementStatus = "up" | "down" | "same";

const Movement = ({ lastRank, rank }: IProps) => {
  if (lastRank === 0 || rank === 0 || lastRank === null || rank === null) {
    return (
      <div className={movementIconContainer}>
        <NewIcon className={newIconStyles} />
      </div>
    );
  }
  let status: MovementStatus = "same";
  if (rank === lastRank) {
    status = "same";
  }
  if (rank > lastRank) {
    status = "down";
  }
  if (rank < lastRank) {
    status = "up";
  }

  return (
    <div className={movementIconContainer}>
      <MovementIcon className={movementIconStyles[status]} title={status} />
    </div>
  );
};

export default Movement;
