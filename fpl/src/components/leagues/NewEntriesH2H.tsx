import { RootState, ThunkDispatch } from "core-integration/src/store";
import {
  getH2HLeague,
  getH2HNewEntries,
} from "core-integration/src/store/leagues/reducers";
import { fetchH2HLeagueStandings } from "core-integration/src/store/leagues/thunks";
import { Button } from "plos/src/components/buttons/Button";
import RouterLink from "plos/src/components/links/RouterLink";
import Subheading from "plos/src/components/Subheading";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import { rightSidebarLayout } from "plos/src/layouts";
import { fixedTable } from "plos/src/styles/utils.css";
import { useEffect, useState } from "react";
import { TableBody, TableHeader } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { HelmetHead } from "../HelmetHead";
import { ControlArrowLeft, ControlArrowRight } from "../icons/Arrows";
import ReportNameButton from "../ReportNameButton";
import {
  newEntriesTableCell,
  newEntriesTableCol,
} from "./Classic/StandingsClassic/NewEntriesClassicTable/newEntriesClassicTable.css";
import { standingsMainContent } from "./Classic/StandingsClassic/standingsClassic.css";
import { reportButtonWrapper, StandingsHeading } from "./shared";
import { pager } from "./shared/styles/leaguesTableStyles.css";

const NewEntriesH2H = () => {
  const { leagueId } = useParams();
  const reduxDispatch = useDispatch<ThunkDispatch>();
  const leagueNumber = Number(leagueId);
  const [page, setPage] = useState(1);

  const league = useSelector((state: RootState) =>
    getH2HLeague(state, leagueNumber)
  );
  const newEntries = useSelector((state: RootState) =>
    getH2HNewEntries(state, leagueNumber, page)
  );
  useEffect(() => {
    reduxDispatch(fetchH2HLeagueStandings(leagueNumber, page, 1));
  }, [reduxDispatch, page, leagueNumber]);

  if (!league || !newEntries) {
    return null;
  }

  return (
    <>
      <HelmetHead
        title={`${league.name} - New Entries | Fantasy Premier League`}
        description={`To view the ${league.name} invitational league new entries, as well as creating & joining new leagues, visit the official website of the Premier League.`}
      />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <StandingsHeading
            league={league}
            leagueNumber={leagueNumber}
            type="h2h"
          />
          <div className={standingsMainContent}>
            <Subheading>New entries</Subheading>

            <Table className={fixedTable} aria-label="New Entries">
              <TableHeader>
                <Column className={newEntriesTableCol}>Team</Column>
                <Column isRowHeader className={newEntriesTableCol}>
                  Manager
                </Column>
              </TableHeader>
              <TableBody>
                {newEntries.results.map((ne) => (
                  <Row key={ne.entry}>
                    <Cell className={newEntriesTableCell}>{ne.entry_name}</Cell>
                    <Cell className={newEntriesTableCell}>
                      <RouterLink to={`/entry/${ne.entry}/history`}>
                        {ne.player_first_name} {ne.player_last_name}
                      </RouterLink>
                    </Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>

            <div className={pager}>
              {page > 1 && (
                <Button onPress={() => setPage(page - 1)} styleVariant="tonal">
                  <ControlArrowLeft />
                  <span>Previous</span>
                </Button>
              )}
              {newEntries.has_next && (
                <Button onPress={() => setPage(page + 1)} styleVariant="tonal">
                  <span>Next</span>
                  <ControlArrowRight />
                </Button>
              )}
            </div>
            <div className={reportButtonWrapper.mobile}>
              <ReportNameButton league={league} />
            </div>
          </div>
        </SurfaceContainer>
      </div>
    </>
  );
};

export default NewEntriesH2H;
