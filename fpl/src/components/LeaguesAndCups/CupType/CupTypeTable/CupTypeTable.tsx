import { RootState } from "core-integration/src/store";
import {
  getCupMatchesByLeagueId,
  getEntry,
} from "core-integration/src/store/entries/reducers";
import {
  CupMatchesByLeagueId,
  ILeagueEntry,
} from "core-integration/src/store/entries/types";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import Subheading from "plos/src/components/Subheading";
import { Table } from "plos/src/components/Table";
import { Column, TableBody, TableHeader } from "react-aria-components";
import { useSelector } from "react-redux";
import CupTypeRow from "./CupTypeRow";
import {
  cupColStyles,
  cupTypeStyles,
  cupTypeTableStyles,
  generalColStyles,
} from "./cupTypeTable.css";

interface CupTypeTableProps {
  leagues: ILeagueEntry[] | null;
  title: string;
}

const CupTypeTable = ({ leagues, title }: CupTypeTableProps) => {
  const player = useSelector(getPlayerData);
  const entry = useSelector((state: RootState) =>
    player?.entry ? getEntry(state, player.entry) : null
  );

  const cupMatches: CupMatchesByLeagueId | null = useSelector(
    (state: RootState) =>
      entry ? getCupMatchesByLeagueId(state, entry.id) : null
  );

  if (!leagues || !entry) {
    return null;
  }

  return (
    <div className={cupTypeStyles}>
      <Subheading>{title}</Subheading>
      <Table className={cupTypeTableStyles} aria-label={title}>
        <TableHeader>
          <Column className={cupColStyles} isRowHeader>
            Cup
          </Column>
          <Column className={generalColStyles}>Gameweek</Column>
          <Column className={generalColStyles}>Result</Column>
        </TableHeader>
        <TableBody>
          {leagues.map((l) => (
            <CupTypeRow
              key={l.id}
              cupMatch={
                l.cup_league && cupMatches ? cupMatches[l.cup_league] : null
              }
              entryId={entry.id}
              league={l}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CupTypeTable;
