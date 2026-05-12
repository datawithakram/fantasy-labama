import { fdrStyles } from "./fixtureDifficultyCell.css";
import { vars } from "plos/src/styles/theme.css";

interface FixtureDifficultyCellProps {
  rating?: keyof typeof vars.colors.difficulties;
}

const FixtureDifficultyCell = ({ rating }: FixtureDifficultyCellProps) => {
  if (!rating) {
    return null;
  }

  return <div className={fdrStyles[rating]}>{rating}</div>;
};

export default FixtureDifficultyCell;
