import { ThunkDispatch } from "core-integration/src/store";
import { getMostValuableTeams } from "core-integration/src/store/stats/reducers";
import { fetchMostValuableTeams } from "core-integration/src/store/stats/thunks";
import RouterLink from "plos/src/components/links/RouterLink";
import { Cell, Column, Table } from "plos/src/components/Table";
import { integerToMoneyWithCurrency } from "plos/src/utils/money";
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

const ValuableTeams = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const teams = useSelector(getMostValuableTeams);

  useEffect(() => {
    dispatch(fetchMostValuableTeams());
  }, [dispatch]);

  return (
    <StatusPanel title="Most Valuable Teams">
      <Table className={leagueTeamTable} aria-label="Most Valuable Teams">
        <TableHeader className={leagueTeamHeader}>
          <Row>
            <Column isRowHeader className={posCol}>
              Pos
            </Column>
            <Column className={nameCol}>Team</Column>
            <Column className={scoreCol}>Value</Column>
          </Row>
        </TableHeader>
        <TableBody>
          {teams.slice(0, 5).map((t, i) => (
            <Row className={leagueTeamTableRow} key={t.entry}>
              <Cell className={posCell}>
                <span className={leagueTeamPosition}>{i + 1}</span>
              </Cell>
              <Cell className={nameCell}>
                <RouterLink to={`/entry/${t.entry}/history`}>
                  <span className={leagueTeamName}>{t.name}</span>
                </RouterLink>
              </Cell>
              <Cell className={scoreCell}>
                {integerToMoneyWithCurrency(t.value_with_bank, 10)}
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
      {!teams.length && (
        <p>The Most Valuable Teams will appear here when available.</p>
      )}
    </StatusPanel>
  );
};

export default ValuableTeams;
