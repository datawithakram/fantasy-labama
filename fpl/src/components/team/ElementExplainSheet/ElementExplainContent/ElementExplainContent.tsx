import { RootState } from "core-integration/src/store";
import { getElementStatsByIdentifier } from "core-integration/src/store/element-stats/reducers";
import { IElementStat } from "core-integration/src/store/element-stats/types";
import {
  getElementsById,
  getElementsEventDataById,
} from "core-integration/src/store/elements/reducers";
import { IElementExplain } from "core-integration/src/store/elements/types";
import { getFixturesForEventById } from "core-integration/src/store/fixtures/reducers";
import { IGroupFixture } from "core-integration/src/store/fixtures/types";
import {
  formatRawAsISO,
  formatRawAsLocal,
} from "core-integration/src/utils/datetime";
import { Fixture } from "plos/src/components/Fixtures/Fixture";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import * as React from "react";
import { TableBody, TableHeader } from "react-aria-components";
import { useSelector } from "react-redux";
import LiveIndicatorBar from "../../../../img/icons/live-indicator-bar.svg?react";
import {
  elementExplainContent,
  fixtureContainer,
  kickoffDateHeader,
  liveIndicatorBar,
  pointsCell,
  pointsCol,
  tableCaption,
} from "./elementExplainContent.css";
import { ElementExplainContentProps } from "./types";

const ElementExplainContent = ({
  eventId,
  elementId,
}: ElementExplainContentProps) => {
  const elementsById = useSelector(getElementsById);
  const elementsDataById = useSelector((state: RootState) =>
    getElementsEventDataById(state, eventId)
  );
  const fixturesById: Record<string, IGroupFixture> | null = useSelector(
    (state: RootState) => getFixturesForEventById(state, eventId)
  );
  const statsByIdentifier: Record<string, IElementStat> = useSelector(
    getElementStatsByIdentifier
  );

  const renderExplainFixture = (explain: IElementExplain) => {
    const elementData = elementsDataById[elementId];
    const fixture = fixturesById && fixturesById[explain.fixture];
    if (!elementData || !fixture || !fixture.kickoff_time) {
      return null;
    }

    const kickoffDate = new Date(fixture.kickoff_time);
    const fixtureWithDate = { ...fixture, kickoffDate };

    return (
      <div className={elementExplainContent}>
        <div className={fixtureContainer}>
          {!fixture.started && (
            <h2 className={kickoffDateHeader}>
              <time dateTime={formatRawAsISO(fixture.kickoff_time)}>
                {formatRawAsLocal(fixture.kickoff_time, "E d MMM")}
              </time>
            </h2>
          )}
          {fixture.started && fixture.finished_provisional === false && (
            <LiveIndicatorBar
              className={liveIndicatorBar}
              aria-label="Live match indicator"
            />
          )}
          <Fixture fixture={fixtureWithDate} />
        </div>
        {fixture.started && (
          <SurfaceContainer>
            <h2 className={tableCaption}>Points breakdown</h2>
            <Table aria-label="Points Breakdown">
              <TableHeader>
                <Column isRowHeader>Statistic</Column>
                <Column>Value</Column>
                <Column className={pointsCol}>Points</Column>
              </TableHeader>
              <TableBody>
                {explain.stats.map((stat) => (
                  <Row key={stat.identifier}>
                    <Cell>{statsByIdentifier[stat.identifier].label}</Cell>
                    <Cell>{stat.value}</Cell>
                    <Cell className={pointsCell}>{stat.points} pts</Cell>
                  </Row>
                ))}
              </TableBody>
            </Table>
          </SurfaceContainer>
        )}
      </div>
    );
  };

  const element = elementsById[elementId];
  if (!element || !fixturesById || !elementsDataById) {
    return null;
  }

  return (
    <div>
      {elementsDataById[element.id].explain.map((e) => (
        <React.Fragment key={e.fixture}>
          {renderExplainFixture(e)}
        </React.Fragment>
      ))}
    </div>
  );
};

export default ElementExplainContent;
