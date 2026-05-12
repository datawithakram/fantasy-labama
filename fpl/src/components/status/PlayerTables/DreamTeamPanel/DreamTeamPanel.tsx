import { RootState, ThunkDispatch } from "core-integration/src/store";
import {
  getEventDreamTeam,
  getOverallDreamTeam,
} from "core-integration/src/store/dream-teams/reducers";
import {
  fetchEventDreamTeam,
  fetchOverallDreamTeam,
} from "core-integration/src/store/dream-teams/thunks";
import { getElementsById } from "core-integration/src/store/elements/reducers";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import ElementDialogButton from "plos/src/components/ElementDialogButton";
import ElementInTable from "plos/src/components/ElementInTable";
import { Cell, Column, Row, Table } from "plos/src/components/Table";
import { useEffect } from "react";
import { TableBody, TableHeader } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { isBlankWeek } from "../../../../utils/events";
import { StatusPanel } from "../../StatusPanel";
import {
  etPlayerCell,
  etPlayerCol,
  etPlayerContainer,
  etPointsCell,
  etPointsCol,
} from "../statusElementTables.css";
import { DreamTeamPanelProps, DreamTeamRowProps } from "../types";

const DreamTeamRow = ({ element, team, points }: DreamTeamRowProps) => (
  <Row>
    <Cell className={etPlayerCell}>
      <div className={etPlayerContainer}>
        <ElementDialogButton elementId={element.id} variant="list" />
        <ElementInTable element={element} team={team} />
      </div>
    </Cell>
    <Cell className={etPointsCell}>{points}</Cell>
  </Row>
);

const DreamTeamPanel = ({ now }: DreamTeamPanelProps) => {
  const dispatch = useDispatch<ThunkDispatch>();
  const data = useSelector((state: RootState) =>
    now
      ? isBlankWeek(now.id)
        ? getOverallDreamTeam(state)
        : getEventDreamTeam(state, now.id)
      : null
  );
  const elementsById = useSelector(getElementsById);
  const teamsById = useSelector(getTeamsById);

  useEffect(() => {
    if (now) {
      if (isBlankWeek(now.id)) {
        dispatch(fetchOverallDreamTeam());
      } else {
        dispatch(fetchEventDreamTeam(now.id));
      }
    }
  }, [dispatch, now]);

  if (!data || !now) {
    return null;
  }

  return (
    <StatusPanel
      title={isBlankWeek(now.id) ? "Team of the Season" : "Team of the Week"}
      url={`/team-of-the-week/${isBlankWeek(now.id) ? "" : now.id + "/"}`}
    >
      <Table aria-label="Dream Team Table">
        <TableHeader>
          <Column isRowHeader className={etPlayerCol}>
            Player
          </Column>
          <Column className={etPointsCol}>Pts</Column>
        </TableHeader>
        <TableBody>
          {data.team.map((dt) => (
            <DreamTeamRow
              key={dt.element}
              element={elementsById[dt.element]}
              team={teamsById[elementsById[dt.element].team]}
              points={dt.points}
            />
          ))}
        </TableBody>
      </Table>
    </StatusPanel>
  );
};

export default DreamTeamPanel;
