import { Cell } from "react-aria-components";
import { Result } from "../../../../Result";
import { IH2HMatch } from "core-integration/src/store/leagues/types";
import { rankCellStyles } from "../../../LeagueType/LeagueTypeTable/leagueTypeTable.css";
import { CupSummaryScore } from "../../../index";

interface CupStatusCellProps {
  cupMatch: IH2HMatch;
  entryId: number;
}

const CupStatusCell = ({ cupMatch, entryId }: CupStatusCellProps) => {
  const resultChar =
    cupMatch.winner === entryId ? "W" : cupMatch.winner ? "L" : "";

  return (
    <Cell className={rankCellStyles}>
      {cupMatch.winner ? (
        <Result resultChar={resultChar} />
      ) : (
        <CupSummaryScore match={cupMatch} entryId={entryId} />
      )}
    </Cell>
  );
};

export default CupStatusCell;
