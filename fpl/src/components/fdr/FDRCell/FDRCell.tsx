import { InfoText } from "plos/src/components/tooltips/InfoText";
import { FDRCellStyles, TeamnameStyles } from "./fdrCell.css";
import { FDRCellProps } from "./types";

const FDRCell = ({
  difficulty = 1,
  teamName,
  isHome,
  isMultiple = false,
}: FDRCellProps) => {
  if (!teamName) {
    return (
      <div data-testid="fdr-cell-empty" className={FDRCellStyles[3]}>
        -
      </div>
    );
  }

  const difficultyLabel = `Fixture Difficulty Rating: ${difficulty}`;

  return (
    <div
      className={FDRCellStyles[difficulty]}
      data-testid="fdr-cell-full"
      data-multiple={isMultiple}
    >
      <InfoText
        label={`${teamName}, ${difficultyLabel}`}
        tooltipText={difficultyLabel}
      >
        <span className={TeamnameStyles}>{teamName}</span>
      </InfoText>
      {isHome !== undefined && <span>({isHome ? "H" : "A"})</span>}
    </div>
  );
};

export default FDRCell;
