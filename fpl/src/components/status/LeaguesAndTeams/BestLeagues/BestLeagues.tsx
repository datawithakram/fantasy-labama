import { ThunkDispatch } from "core-integration/src/store";
import { getBestClassicPrivateLeagues } from "core-integration/src/store/stats/reducers";
import { fetchBestClassicPrivateLeagues } from "core-integration/src/store/stats/thunks";
import RouterLink from "plos/src/components/links/RouterLink";
import { Cell, Column, Table } from "plos/src/components/Table";
import { footnote } from "plos/src/styles/utils.css";
import { useEffect } from "react";
import { Row, TableBody, TableHeader } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { StatusPanel } from "../../StatusPanel";
import {
  leagueTeamHeader,
  leagueTeamName,
  leagueTeamPosition,
  leagueTeamTable,
  leagueTeamTableRow,
  nameCell,
  nameCol,
  posCell,
  posCol,
  scoreCell,
  scoreCol,
} from "../leaguesAndTeams.css";

const BestLeagues = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const leagues = useSelector(getBestClassicPrivateLeagues);

  useEffect(() => {
    dispatch(fetchBestClassicPrivateLeagues());
  }, [dispatch]);

  return (
    <StatusPanel title="Best Leagues">
      <Table className={leagueTeamTable} aria-label="Best Leagues">
        <TableHeader className={leagueTeamHeader}>
          <Row>
            <Column isRowHeader className={posCol}>
              Pos
            </Column>
            <Column className={nameCol}>League</Column>
            <Column className={scoreCol}>Average*</Column>
          </Row>
        </TableHeader>
        <TableBody>
          {leagues.slice(0, 5).map((l, i) => (
            <Row className={leagueTeamTableRow} key={l.league}>
              <Cell className={posCell}>
                <span className={leagueTeamPosition}>{i + 1}</span>
              </Cell>
              <Cell className={nameCell}>
                <RouterLink to={`/leagues/${l.league}/standings/c`}>
                  <span className={leagueTeamName}>{l.name}</span>
                </RouterLink>
              </Cell>
              <Cell className={scoreCell}>{l.average_score}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
      {!leagues.length && (
        <p>The Best Leagues will appear here when available.</p>
      )}
      <p className={footnote}>
        *Average score of the top 5 teams in the league
      </p>
    </StatusPanel>
  );
};

export default BestLeagues;
