import Subheading from "plos/src/components/Subheading";
import { Column, Table } from "plos/src/components/Table";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { TableBody, TableHeader } from "react-aria-components";
import { leagueTypeStyles } from "../leagueType.css";
import {
  currentRankColStyles,
  lastRankColStyles,
  leagueColStyles,
  leagueTypeTableStyles,
  optionsColStyles,
} from "./leagueTypeTable.css";
import LeagueTypeTableRow from "./LeagueTypeTableRow";
import { TNTLeagueRow } from "./TNTLeagueRow";
import { LeagueTypeTableProps } from "./types";

const LeagueTypeTable = ({ leagues, title }: LeagueTypeTableProps) => (
  <div className={leagueTypeStyles}>
    <Subheading>{title}</Subheading>
    <Table className={leagueTypeTableStyles} aria-label={title}>
      <TableHeader>
        <Column className={leagueColStyles} isRowHeader>
          League
        </Column>
        <Column className={currentRankColStyles}>Current Rank</Column>
        <Column className={lastRankColStyles}>Last Rank</Column>
        <Column className={optionsColStyles}>
          <span className={visuallyHidden}>League actions</span>
        </Column>
      </TableHeader>
      <TableBody>
        {leagues.map((league) => (
          <LeagueTypeTableRow key={league.id} league={league} />
        ))}
        {title === "Broadcaster Leagues" && <TNTLeagueRow leagues={leagues} />}
      </TableBody>
    </Table>
  </div>
);

export default LeagueTypeTable;
