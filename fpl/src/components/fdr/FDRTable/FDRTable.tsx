import { Badge } from "plos/src/components/Badge";
import { Cell, Column, Table } from "plos/src/components/Table";
import { useMediaQuery } from "plos/src/hooks/useMediaQuery";
import { breakpoints } from "plos/src/styles";
import { forwardRef } from "react";
import { Row, TableBody, TableHeader } from "react-aria-components";
import { FDRCell } from "../FDRCell";
import { FDRHeadingCell } from "../FDRHeadingCell";
import {
  bodyCell,
  cellWrapperStyles,
  COLUMN_WIDTH,
  DESKTOP_FIRST_COL_WIDTH,
  eventColumn,
  fdrCellBorderStyles,
  fdrTable,
  MOBILE_FIRST_COL_WIDTH,
  scrollWrapper,
  stickyFirstColumn,
  teamCellBadge,
  teamCellNameStyles,
  teamCellStyles,
} from "./fdrTable.css";
import { FDRTableProps } from "./types";

const FDRTable = forwardRef<HTMLDivElement, FDRTableProps>(
  (
    {
      activeHeadingIndex,
      onHeadingSort,
      teams,
      events,
      teamFixtures,
      teamsById,
    },
    ref
  ) => {
    const isLargeScreen = useMediaQuery(`(min-width: ${breakpoints[1]})`);
    /** Logic to account for the sticky team column width in the table minWidth */
    const getMinWidth = () => {
      const firstColumnWidth = isLargeScreen
        ? DESKTOP_FIRST_COL_WIDTH
        : MOBILE_FIRST_COL_WIDTH;
      return firstColumnWidth + events.length * COLUMN_WIDTH;
    };

    if (teamFixtures == null || events.length === 0) {
      return <div>No teams or events to show</div>;
    }

    return (
      <div ref={ref} tabIndex={0} className={scrollWrapper}>
        <Table
          aria-label="Fixture Difficulty Rating"
          className={fdrTable}
          data-testid="table"
          style={{ minWidth: getMinWidth() }}
        >
          <TableHeader data-testid="table-head">
            <Row>
              <Column
                className={stickyFirstColumn}
                data-testid="th-team"
                isRowHeader={true}
              >
                <FDRHeadingCell
                  id={0}
                  activeEventId={activeHeadingIndex}
                  eventName="Team"
                  onHandleClick={onHeadingSort}
                />
              </Column>
              {events.map((event) => (
                <Column
                  className={eventColumn}
                  data-testid="th-event"
                  key={event.id}
                >
                  <FDRHeadingCell
                    id={event.id}
                    activeEventId={activeHeadingIndex}
                    eventName={`GW${event.id}`}
                    eventDeadline={event.deadline_time}
                    onHandleClick={onHeadingSort}
                  />
                </Column>
              ))}
            </Row>
          </TableHeader>

          <TableBody data-testid="table-body">
            {teams.map((team) => (
              <Row key={team.id} data-testid="team-row">
                <Cell className={stickyFirstColumn} data-testid="td-team">
                  <div className={fdrCellBorderStyles}>
                    <div className={teamCellStyles}>
                      <div className={teamCellBadge}>
                        <Badge team={team} />
                      </div>
                      <div className={teamCellNameStyles}>{team.name}</div>{" "}
                    </div>
                  </div>
                </Cell>

                {events.map((event) => {
                  const fixtures =
                    teamFixtures[event.id]?.[team.id]?.fixtures || [];
                  const hasMultipleFixtures = fixtures.length > 1;

                  return (
                    <Cell
                      key={`fixture-${event.id}`}
                      className={bodyCell}
                      data-testid="fdr-cell"
                    >
                      <div
                        className={cellWrapperStyles}
                        data-multiple={hasMultipleFixtures}
                      >
                        {fixtures.length > 0 ? (
                          fixtures.map((fixture) => (
                            <FDRCell
                              key={fixture.id}
                              isHome={fixture.isHome}
                              teamName={teamsById[fixture.opponent].short_name}
                              difficulty={
                                fixture.difficulty as 1 | 2 | 3 | 4 | 5
                              }
                              isMultiple={hasMultipleFixtures}
                            />
                          ))
                        ) : (
                          <FDRCell teamName="" difficulty={3} />
                        )}
                      </div>
                    </Cell>
                  );
                })}
              </Row>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
);

export default FDRTable;
