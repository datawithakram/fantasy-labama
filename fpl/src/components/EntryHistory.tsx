import { RootState, ThunkDispatch } from "core-integration/src/store";
import {
  getEntry,
  getEntryChipHistory,
  getEntryEventHistory,
  getEntrySeasonHistory,
} from "core-integration/src/store/entries/reducers";
import {
  fetchEntryHistory,
  fetchEntrySummary,
} from "core-integration/src/store/entries/thunks";
import { formatRawAsLocal } from "core-integration/src/utils/datetime";
import { integerToMoney } from "core-integration/src/utils/money";
import RouterLink from "plos/src/components/links/RouterLink";
import PageTitle from "plos/src/components/PageTitle";
import Subheading from "plos/src/components/Subheading";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import {
  contentMain,
  historyMain,
  historySidebar,
  leftSidebarLayout,
} from "plos/src/layouts";
import { scrollContainer } from "plos/src/styles/utils.css";
import { ReactNode, useEffect } from "react";
import { TableBody, TableHeader } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getChipName } from "../utils/chips";
import { getShortNameFromId } from "../utils/events";
import EntryInfo from "./EntryInfo";
import { HelmetHead } from "./HelmetHead";
import Movement from "./leagues/Movement";

const EntryHistory = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const { entryId } = useParams();

  const entryIdNumber = Number(entryId);
  const chipHistory = useSelector((state: RootState) =>
    getEntryChipHistory(state, entryIdNumber)
  );
  const entry = useSelector((state: RootState) =>
    getEntry(state, entryIdNumber)
  );
  const eventHistory = useSelector((state: RootState) =>
    [...getEntryEventHistory(state, entryIdNumber)].reverse()
  );
  const seasonHistory = useSelector((state: RootState) =>
    getEntrySeasonHistory(state, entryIdNumber)
  );
  const reversedSeasonHistory = [...seasonHistory].reverse();

  useEffect(() => {
    dispatch(fetchEntryHistory(entryIdNumber));
    dispatch(fetchEntrySummary(entryIdNumber));
  }, [dispatch, entryIdNumber]);

  const movementFromIndex = (index: number): ReactNode => {
    const thisRank = eventHistory[index].overall_rank;
    const lastRank =
      index === eventHistory.length - 1
        ? null
        : eventHistory[index + 1].overall_rank;
    return <Movement lastRank={lastRank} rank={thisRank} />;
  };

  if (!entry) {
    return null;
  }

  return (
    <>
      <HelmetHead
        title="Fantasy Football Gameweek History | Fantasy Premier League"
        description="To view the Gameweek history, along with the status of your Chips, visit the official website of the Premier League."
      />
      <div className={leftSidebarLayout}>
        <div className={historyMain}>
          <SurfaceContainer>
            <div className={contentMain}>
              <PageTitle title="Entry History" />
              <Subheading>This Season</Subheading>
              <div className={scrollContainer}>
                <Table aria-label="Entry History">
                  <TableHeader>
                    <Column isRowHeader>
                      <InfoText label="Gameweek">GW</InfoText>
                    </Column>
                    <Column align="end">
                      <InfoText label="Overall Rank">OR</InfoText>
                    </Column>
                    <Column align="end">
                      <InfoText label="Movement">#</InfoText>
                    </Column>
                    <Column align="end">
                      <InfoText label="Overall Points">OP</InfoText>
                    </Column>
                    <Column align="end">
                      <InfoText label="Gameweek Rank">GWR</InfoText>
                    </Column>
                    <Column align="end">
                      <InfoText label="Gameweek Points">GWP</InfoText>
                    </Column>
                    <Column align="end">
                      <InfoText label="Points on Bench">PB</InfoText>
                    </Column>
                    <Column align="end">
                      <InfoText label="Transfers Made">TM</InfoText>
                    </Column>
                    <Column align="end">
                      <InfoText label="Transfers Cost">TC</InfoText>
                    </Column>
                    <Column align="end">
                      <InfoText label="Squad Value">£m</InfoText>
                    </Column>
                  </TableHeader>
                  <TableBody renderEmptyState={() => "No Gameweek history."}>
                    {[...eventHistory].map((eh, i) => (
                      <Row key={eh.event}>
                        <Cell>
                          <RouterLink
                            to={`/entry/${entry.id}/event/${eh.event}`}
                          >
                            {getShortNameFromId(eh.event)}
                          </RouterLink>
                        </Cell>
                        <Cell align="end">
                          {eh.overall_rank
                            ? eh.overall_rank.toLocaleString()
                            : "-"}
                        </Cell>
                        <Cell align="end">{movementFromIndex(i)}</Cell>
                        <Cell align="end">{eh.total_points}</Cell>
                        <Cell align="end">
                          {eh.rank ? eh.rank.toLocaleString() : "-"}
                        </Cell>
                        <Cell align="end">{eh.points.toLocaleString()}</Cell>
                        <Cell align="end">{eh.points_on_bench}</Cell>
                        <Cell align="end">{eh.event_transfers}</Cell>
                        <Cell align="end">{eh.event_transfers_cost}</Cell>
                        <Cell align="end">{integerToMoney(eh.value, 10)}</Cell>
                      </Row>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Subheading>Chips</Subheading>
              <Table aria-label="Chips History Table">
                <TableHeader>
                  <Column isRowHeader>Date</Column>
                  <Column>Name</Column>
                  <Column>Active</Column>
                </TableHeader>
                <TableBody renderEmptyState={() => "No chip history."}>
                  {chipHistory.map((ch) => (
                    <Row key={ch.event}>
                      <Cell>{formatRawAsLocal(ch.time)}</Cell>
                      <Cell>{getChipName(ch.name)}</Cell>
                      <Cell>
                        <RouterLink to={`/entry/${entry.id}/event/${ch.event}`}>
                          {getShortNameFromId(ch.event)}
                        </RouterLink>
                      </Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
              <Subheading>Previous Seasons</Subheading>

              <Table aria-label="Season History Table">
                <TableHeader>
                  <Column isRowHeader>Season</Column>
                  <Column>Points</Column>
                  <Column>Rank</Column>
                </TableHeader>
                <TableBody renderEmptyState={() => "No season history."}>
                  {reversedSeasonHistory.map((sh) => (
                    <Row key={sh.season_name}>
                      <Cell>{sh.season_name}</Cell>
                      <Cell>{sh.total_points.toLocaleString()}</Cell>
                      <Cell>{sh.rank.toLocaleString()}</Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
            </div>
          </SurfaceContainer>
        </div>
        <div className={historySidebar}>
          <SurfaceContainer>
            <EntryInfo entryId={entry.id} />
          </SurfaceContainer>
        </div>
      </div>
    </>
  );
};

export default EntryHistory;
