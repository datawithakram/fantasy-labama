import { visuallyHidden } from "plos/src/styles/utils.css";
import FixtureDifficultyCell from "../../PlayerSheets/PlayerProfileSheet/Tables/custom-cells/FixtureDifficultyCell/FixtureDifficultyCell";
import {
  keyHeadingStyles,
  keyItemsStyles,
  keyLabelsStyles,
  keyLabelStyles,
  keyWrapperStyles,
} from "./fdrKey.css";

const FDRKey = () => {
  const difficultyRating = [1, 2, 3, 4, 5];
  return (
    <div>
      <div className={keyWrapperStyles} data-testid="key">
        <div>
          <h3 className={keyHeadingStyles}>FDR Key: </h3>
        </div>
        <div>
          <div className={keyItemsStyles}>
            {difficultyRating.map((rating) => (
              <FixtureDifficultyCell
                key={rating}
                rating={rating as 1 | 2 | 3 | 4 | 5}
              />
            ))}
          </div>
        </div>
        <div className={keyLabelsStyles}>
          <span className={visuallyHidden}>1 = </span>
          <div className={keyLabelStyles}>Easy</div>
          <span className={visuallyHidden}>5 = </span>
          <div className={keyLabelStyles}>Hard</div>
        </div>
      </div>
    </div>
  );
};
export default FDRKey;
