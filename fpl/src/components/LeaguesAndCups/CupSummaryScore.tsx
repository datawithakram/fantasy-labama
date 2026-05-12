import { getCurrentEvent } from "core-integration/src/store/events/reducers";
import { IH2HMatch } from "core-integration/src/store/leagues/types";
import { useSelector } from "react-redux";

interface CupSummaryScoreProps {
  match: IH2HMatch;
  entryId: number;
}

const CupSummaryScore = ({ match, entryId }: CupSummaryScoreProps) => {
  const iAmOne = entryId === match.entry_1_entry;
  const now = useSelector(getCurrentEvent);
  const started = now ? match.event <= now.id : null;

  if (!started) {
    return <>&nbsp;</>;
  }

  if (match.is_bye) {
    return <span>BYE</span>;
  }

  return iAmOne ? (
    <span>
      {match.entry_1_points}-{match.entry_2_points}
    </span>
  ) : (
    <span>
      {match.entry_2_points}-{match.entry_1_points}
    </span>
  );
};

export default CupSummaryScore;
