import { ThunkDispatch } from "core-integration/src/store";
import { getElementControls } from "core-integration/src/store/elements/reducers";
import { updateElementControlsAndMaxCost } from "core-integration/src/store/elements/thunks";
import { IElementControls } from "core-integration/src/store/elements/types";
import { getAffordableElementsFromControls } from "core-integration/src/store/squad/reducers";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import ElementDialogButton from "plos/src/components/ElementDialogButton";
import ElementInTable from "plos/src/components/ElementInTable";
import PageTitle from "plos/src/components/PageTitle";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import { contentMain, rightSidebarLayout } from "plos/src/layouts";
import { fixedTable, scrollContainer } from "plos/src/styles/utils.css";
import { useEffect } from "react";
import { TableBody, TableHeader } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { HelmetHead } from "../HelmetHead";
import {
  availabilityTableCell,
  availabilityTableCol,
  availabilityTablePlayerCell,
} from "./scout.css";
import ScoutAvailabilityFilters from "./ScoutAvailabilityFilters/ScoutAvailabilityFilters";
import ScoutNav from "./ScoutNav";

const ScoutAvailability = () => {
  const dispatch = useDispatch<ThunkDispatch>();

  const controls = useSelector(getElementControls);
  const elements = useSelector(getAffordableElementsFromControls);
  const elementsWithNews = elements.data.filter((e) => e.news);
  const teamsById = useSelector(getTeamsById);

  const updateControlsAndMaxCost = (controls: IElementControls) =>
    dispatch(updateElementControlsAndMaxCost(controls));

  useEffect(() => {
    updateControlsAndMaxCost({
      ...controls,
      filter: "all",
      sort: "news_added",
    });
  }, []);

  return (
    <div className={rightSidebarLayout}>
      <div className={contentMain}>
        <PageTitle title="The Scout" />
        <ScoutNav />
        <HelmetHead
          title="Fantasy Premier League Player Availability, Injuries &amp; Eligibility | Fantasy Premier League"
          description="To view player availability including injuries and eligibility for all Fantasy Premier League players, or select by position or team, visit the official website of the Premier League."
        />
        <ScoutAvailabilityFilters />
        <SurfaceContainer>
          <div className={scrollContainer}>
            <Table className={fixedTable} aria-label="Player Availability">
              <TableHeader>
                <Column isRowHeader className={availabilityTableCol}>
                  Player
                </Column>
                <Column className={availabilityTableCol}>News</Column>
              </TableHeader>
              <TableBody
                renderEmptyState={() =>
                  "No player news is currently available."
                }
              >
                {elementsWithNews.map((e) => (
                  <Row key={e.id}>
                    <Cell className={availabilityTablePlayerCell}>
                      <ElementDialogButton elementId={e.id} variant="list" />
                      <ElementInTable element={e} team={teamsById[e.team]} />
                    </Cell>
                    <Cell className={availabilityTableCell}>{e.news}</Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </div>
        </SurfaceContainer>
      </div>
    </div>
  );
};

export default ScoutAvailability;
