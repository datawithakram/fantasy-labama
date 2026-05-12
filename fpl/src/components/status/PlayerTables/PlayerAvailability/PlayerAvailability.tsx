import { ThunkDispatch } from "core-integration/src/store";
import { getElementControls } from "core-integration/src/store/elements/reducers";
import { updateElementControlsAndMaxCost } from "core-integration/src/store/elements/thunks";
import { getAffordableElementsFromControls } from "core-integration/src/store/squad/reducers";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import ElementDialogButton from "plos/src/components/ElementDialogButton";
import ElementInTable from "plos/src/components/ElementInTable";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import { useEffect } from "react";
import { TableBody, TableHeader } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { useTrackingContext } from "../../../../contexts/TrackingContext";
import { StatusPanel } from "../../StatusPanel";
import {
  etPlayerCell,
  etPlayerCol,
  etPlayerContainer,
  newsCell,
  newsCol,
} from "../statusElementTables.css";
import { PlayerAvailabilityRowProps } from "../types";

const PlayerAvailabilityRow = ({
  element,
  team,
  news,
}: PlayerAvailabilityRowProps) => (
  <Row>
    <Cell className={etPlayerCell}>
      <div className={etPlayerContainer}>
        <ElementDialogButton elementId={element.id} variant="list" />
        <ElementInTable element={element} team={team} />
      </div>
    </Cell>
    <Cell className={newsCell}>{news}</Cell>
  </Row>
);

const PlayerAvailability = () => {
  const dispatch = useDispatch<ThunkDispatch>();

  const controls = useSelector(getElementControls);
  const elements = useSelector(getAffordableElementsFromControls);
  const elementsWithNews = elements.data.filter((e) => e.news);
  const teamsById = useSelector(getTeamsById);

  const { firePageViewEvent } = useTrackingContext();

  useEffect(() => {
    firePageViewEvent("fantasy scout", "availability");
  }, []);

  useEffect(() => {
    dispatch(
      updateElementControlsAndMaxCost({
        ...controls,
        filter: "all",
        sort: "news_added",
        search: "",
      })
    );
  }, []);

  return (
    <StatusPanel title="Player Availability" url="/the-scout/player-news">
      <Table aria-label="Player Availability">
        <TableHeader>
          <Column isRowHeader className={etPlayerCol}>
            Player
          </Column>
          <Column className={newsCol}>News</Column>
        </TableHeader>
        <TableBody
          renderEmptyState={() => "No player news is currently available."}
        >
          {elementsWithNews.slice(0, 11).map((e) => (
            <PlayerAvailabilityRow
              key={e.id}
              element={e}
              team={teamsById[e.team]}
              news={e.news}
            />
          ))}
        </TableBody>
      </Table>
    </StatusPanel>
  );
};

export default PlayerAvailability;
