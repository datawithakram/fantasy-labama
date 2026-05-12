import { IElementHistory } from "core-integration/src/store/elements/types";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { historyResultStyles } from "./historyResult.css";

interface HistoryResultProps {
  history: IElementHistory;
}

// We use these descriptions as they need to be tense agnostic, as the score will be shown for both finished and ongoing matches in the history table.
const resultDict = {
  w: "Winning team",
  d: "Draw",
  l: "Losing team",
};

const HistoryResult = ({ history }: HistoryResultProps) => {
  const {
    was_home: wasHome,
    team_h_score: teamHScore,
    team_a_score: teamAScore,
  } = history;

  if (teamHScore == null || teamAScore == null) return null;

  const score = `${teamHScore} - ${teamAScore}`;

  const forScore = wasHome ? teamHScore : teamAScore;
  const againstScore = wasHome ? teamAScore : teamHScore;
  const resultType: "w" | "d" | "l" =
    forScore > againstScore ? "w" : forScore < againstScore ? "l" : "d";

  return (
    <span className={historyResultStyles[resultType]}>
      <span className={visuallyHidden}>{resultDict[resultType]}, score:</span>
      {score}
    </span>
  );
};

export default HistoryResult;
