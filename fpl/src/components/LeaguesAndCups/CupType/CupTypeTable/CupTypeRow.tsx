import { ILeagueEntry } from "core-integration/src/store/entries/types";
import { IH2HMatch } from "core-integration/src/store/leagues/types";
import { getCupUrl } from "../../../leagues/utils";
import { Cell } from "react-aria-components";
import { Row } from "plos/src/components/Table";
import RouterLink from "plos/src/components/links/RouterLink";
import { getShortNameFromId } from "../../../../utils/events";
import { CupStatusCell } from "./CupStatusCell";
import { generalCellStyles } from "./cupTypeTable.css";
import { cellStyles } from "plos/src/components/Table/tables.css";

interface ICupTypeRowProps {
  cupMatch: IH2HMatch | null;
  entryId: number;
  league: ILeagueEntry;
}

const CupTypeRow = ({ cupMatch, entryId, league }: ICupTypeRowProps) => {
  return (
    <Row>
      <Cell className={cellStyles}>
        <RouterLink to={getCupUrl(league.id, league.cup_league, entryId)}>
          {league.name} cup
        </RouterLink>
      </Cell>
      {cupMatch && league.cup_qualified ? (
        <>
          <Cell className={generalCellStyles}>
            {getShortNameFromId(cupMatch.event)}
          </Cell>
          <CupStatusCell cupMatch={cupMatch} entryId={entryId} />
        </>
      ) : (
        <>
          <Cell className={generalCellStyles}>&nbsp;</Cell>
          <Cell className={generalCellStyles}>&nbsp;</Cell>
        </>
      )}
    </Row>
  );
};

export default CupTypeRow;
