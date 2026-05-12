import { IconButton } from "plos/src/components/buttons/IconButton";
import IconButtonLink from "plos/src/components/links/IconButtonLink";
import RouterLink from "plos/src/components/links/RouterLink";
import { Cell, Row } from "plos/src/components/Table";
import GearIcon from "plos/src/img/icons/gear.svg?react";
import LeaveIcon from "plos/src/img/icons/leave.svg?react";
import { textTruncate } from "plos/src/styles";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { useState } from "react";
import Movement from "../../../../leagues/Movement";
import { getLeagueUrl } from "../../../../leagues/utils";
import {
  cellStyles,
  currentRankContent,
  optionsCellStyles,
  rankCellStyles,
} from "../leagueTypeTable.css";
import LeaveLeagueDialog from "./LeaveLeagueDialog";
import { LeagueTypeTableRowProps } from "./types";

const LeagueTypeTableRow = ({ league }: LeagueTypeTableRowProps) => {
  const [openLeaveDialog, setOpenLeaveDialog] =
    useState<{
      id: number;
      name: string;
    } | null>(null);

  return (
    <Row key={league.id}>
      <Cell className={cellStyles}>
        <RouterLink to={getLeagueUrl(league.id, league.scoring)}>
          <span className={textTruncate}>{league.name}</span>
        </RouterLink>
      </Cell>
      <Cell className={rankCellStyles}>
        <div className={currentRankContent}>
          <span>
            {league.entry_rank ? league.entry_rank.toLocaleString() : "-"}
          </span>
          <Movement
            lastRank={league.entry_last_rank}
            rank={league.entry_rank}
          />
        </div>
      </Cell>
      <Cell className={rankCellStyles}>
        {league.entry_last_rank ? league.entry_last_rank.toLocaleString() : "-"}
      </Cell>
      <Cell className={optionsCellStyles}>
        {league.entry_can_leave ? (
          <>
            <IconButton
              icon={<LeaveIcon />}
              label="Leave league"
              variant="tonal"
              onPress={() =>
                setOpenLeaveDialog({ id: league.id, name: league.name })
              }
            />
            <LeaveLeagueDialog
              league={league}
              isOpen={openLeaveDialog?.id === league.id}
              handleClose={() => setOpenLeaveDialog(null)}
            />
          </>
        ) : league.entry_can_admin ? (
          <IconButtonLink
            icon={<GearIcon />}
            label="Manage league"
            variant="tonal"
            to={`/leagues/${league.id}/admin/${league.scoring}`}
          />
        ) : (
          <span className={visuallyHidden}>No actions available</span>
        )}
      </Cell>
    </Row>
  );
};

export default LeagueTypeTableRow;
