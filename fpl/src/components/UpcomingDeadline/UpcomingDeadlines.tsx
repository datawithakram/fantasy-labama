import { IEvent } from "core-integration/src/store/events/types";
import {
  formatRawAsISO,
  formatRawAsLocal,
} from "core-integration/src/utils/datetime";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import { fixedTable } from "plos/src/styles/utils.css";
import { TableBody, TableHeader } from "react-aria-components";
import { EventDeadlineCountdown } from "../EventDeadlineCountdown";
import {
  countdownSection,
  deadlineCell,
  deadlineCol,
  eventNameCell,
  eventNameCol,
  upcomingContainer,
} from "./upcomingDeadlines.css";

interface UpcomingDeadlinesProps {
  events: IEvent[];
  onComplete?: () => void;
}

const UpcomingDeadlines = ({ events, onComplete }: UpcomingDeadlinesProps) => {
  if (events.length === 0) {
    return null;
  }

  const [nextEvent, ...remainingEvents] = events;

  const upcomingHeading =
    remainingEvents.length === 1 ? "Upcoming Deadline" : "Upcoming Deadlines";

  return (
    <div className={upcomingContainer}>
      <h3>Next Deadline</h3>
      <div className={countdownSection}>
        <EventDeadlineCountdown event={nextEvent} onComplete={onComplete} />
      </div>
      {remainingEvents.length > 0 && (
        <>
          <h3 aria-hidden="true">{upcomingHeading}</h3>
          <Table className={fixedTable} aria-label="Upcoming deadlines">
            <TableHeader>
              <Column isRowHeader className={eventNameCol}>
                Gameweek
              </Column>
              <Column className={deadlineCol}>Deadline</Column>
            </TableHeader>
            <TableBody>
              {remainingEvents.map((event) => (
                <Row key={event.id}>
                  <Cell className={eventNameCell}>{event.name}</Cell>
                  <Cell className={deadlineCell}>
                    <time dateTime={formatRawAsISO(event.deadline_time)}>
                      {formatRawAsLocal(event.deadline_time, "E d MMM, HH:mm")}
                    </time>
                  </Cell>
                </Row>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default UpcomingDeadlines;
