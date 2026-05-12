import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getElementsById } from "core-integration/src/store/elements/reducers";
import { showElementSummary } from "core-integration/src/store/elements/thunks";
import {
  getEntry,
  getTransfersForEntry,
} from "core-integration/src/store/entries/reducers";
import {
  fetchEntrySummary,
  fetchEntryTransfers,
} from "core-integration/src/store/entries/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { getLatestTransfers } from "core-integration/src/store/squad/reducers";
import { fetchLatestTransfers } from "core-integration/src/store/squad/thunks";
import { formatRawAsLocal } from "core-integration/src/utils/datetime";
import { Button } from "plos/src/components/buttons/Button";
import PageTitle from "plos/src/components/PageTitle";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import {
  contentMain,
  historyMain,
  historySidebar,
  leftSidebarLayout,
} from "plos/src/layouts/layouts.css";
import { unstyledButton } from "plos/src/styles";
import { useEffect } from "react";
import { TableBody, TableHeader } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { getShortNameFromId } from "../utils/events";
import EntryInfo from "./EntryInfo";
import { HelmetHead } from "./HelmetHead";

const TransfersHistory = () => {
  const { entryId } = useParams();

  const entryIdNumber = Number(entryId);
  const player = useSelector(getPlayerData);
  const mine = !!(player && player.entry && player.entry === entryIdNumber);

  const latestTransfers = useSelector((state: RootState) =>
    mine ? getLatestTransfers(state) : []
  );
  const transfersHistory = useSelector((state: RootState) =>
    getTransfersForEntry(state, entryIdNumber)
  );
  const elementsById = useSelector(getElementsById);
  const entry = useSelector((state: RootState) =>
    getEntry(state, entryIdNumber)
  );

  const dispatch = useDispatch<ThunkDispatch>();

  useEffect(() => {
    dispatch(fetchEntrySummary(entryIdNumber));
    dispatch(fetchEntryTransfers(entryIdNumber));
    if (mine) {
      dispatch(fetchLatestTransfers());
    }
  }, [dispatch, entryIdNumber, mine]);

  const showElementDialog = (elementId: number) => {
    dispatch(showElementSummary(elementId));
  };

  return (
    <>
      {entry && (
        <HelmetHead
          title="Fantasy Football Transfer History | Fantasy Premier League"
          description="To view the transfer history, along with the status of your Wildcard, visit the official website of the Premier League."
        />
      )}
      <div className={leftSidebarLayout}>
        <div className={historyMain}>
          <SurfaceContainer>
            <div className={contentMain}>
              <PageTitle title="Transfers" />
              <Table aria-label="Transfers history">
                <TableHeader>
                  <Column isRowHeader>Time</Column>
                  <Column>In</Column>
                  <Column>Out</Column>
                  <Column>Active</Column>
                </TableHeader>
                <TableBody
                  renderEmptyState={() =>
                    "No transfers have been made yet for this team."
                  }
                >
                  {latestTransfers.concat(transfersHistory).map((t) => (
                    <Row key={`${t.time}${t.element_in}`}>
                      <Cell>{formatRawAsLocal(t.time, "d MMM HH:mm")}</Cell>
                      <Cell>
                        <Button
                          onPress={() =>
                            showElementDialog(elementsById[t.element_in].id)
                          }
                          className={unstyledButton}
                        >
                          {elementsById[t.element_in].web_name}
                        </Button>
                      </Cell>
                      <Cell>
                        <Button
                          onPress={() =>
                            showElementDialog(elementsById[t.element_out].id)
                          }
                          className={unstyledButton}
                        >
                          {elementsById[t.element_out].web_name}
                        </Button>
                      </Cell>
                      <Cell>{getShortNameFromId(t.event)}</Cell>
                    </Row>
                  ))}
                </TableBody>
              </Table>
              <p>
                If you are not logged in or are viewing another player's team
                then you will only be able to view transfers up to the last
                deadline.
              </p>
            </div>
          </SurfaceContainer>
        </div>
        <div className={historySidebar}>
          <SurfaceContainer>
            <EntryInfo entryId={entryIdNumber} />
          </SurfaceContainer>
        </div>
      </div>
    </>
  );
};

export default TransfersHistory;
