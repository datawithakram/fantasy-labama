import { ThunkDispatch } from "core-integration/src/store";
import { getCurrentEventStatus } from "core-integration/src/store/events/reducers";
import { fetchEventStatus } from "core-integration/src/store/events/thunks";
import { formatRawAsLocal } from "core-integration/src/utils/datetime";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import { fixedTable } from "plos/src/styles/utils.css";
import { useEffect } from "react";
import { TableBody, TableHeader } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import {
  dateCell,
  dateCol,
  pointsStatusCell,
  pointsStatusCol,
  pointsStatusIndicator,
} from "./status.css";

const EventStatus = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const statusData = useSelector(getCurrentEventStatus);

  useEffect(() => {
    dispatch(fetchEventStatus());
  }, [dispatch]);

  const pointsLabels = {
    l: "Live",
    p: "Provisional",
    r: "Confirmed",
  };

  if (!statusData) {
    return null;
  }

  return (
    <div>
      <Table className={fixedTable} aria-label="Event Status">
        <TableHeader>
          <Column isRowHeader className={dateCol}>
            Day
          </Column>
          <Column className={pointsStatusCol}>
            <InfoText
              label="Match Points"
              tooltipText="Player points are updated live as the matches take place. Assists are checked and confirmed within one hour of the last match of the day finishing."
            >
              Match Points
            </InfoText>
          </Column>
          <Column className={pointsStatusCol}>
            <InfoText
              label="Bonus Points"
              tooltipText="Bonus points will be awarded one hour after the last match of the day finishing."
            >
              Bonus Points
            </InfoText>
          </Column>
        </TableHeader>
        <TableBody>
          {statusData.status.map((s) => (
            <Row key={s.date}>
              <Cell className={dateCell}>
                {formatRawAsLocal(s.date, "EEEE d MMM")}
              </Cell>
              <Cell className={pointsStatusCell}>
                {s.points ? (
                  <div className={pointsStatusIndicator}>
                    {pointsLabels[s.points]}
                  </div>
                ) : (
                  <span>&nbsp;</span>
                )}
              </Cell>
              <Cell className={pointsStatusCell}>
                {s.bonus_added ? (
                  <div className={pointsStatusIndicator}>Added</div>
                ) : (
                  <span>&nbsp;</span>
                )}
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EventStatus;
