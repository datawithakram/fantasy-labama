import { RootState } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import {
  getPlayerData,
  selectIsMyEntry,
} from "core-integration/src/store/player/reducers";
import { EntryCrestData } from "core-integration/src/store/ui";
import { Button } from "plos/src/components/buttons/Button";
import { useSelector } from "react-redux";
import ReportCrestButton from "../../../ReportCrestButton";
import { crestActionsWrapper } from "../../crestStyles.css";

interface CrestSheetActionProps {
  enabled: boolean;
  entryCrestData: EntryCrestData;
  hasPendingCrest: boolean;
  isMobile: boolean;
  handleCreateCrest: (id?: number) => void;
}

const CrestSheetAction = ({
  enabled,
  entryCrestData,
  hasPendingCrest,
  isMobile,
  handleCreateCrest,
}: CrestSheetActionProps) => {
  const mine = useSelector((state: RootState) =>
    selectIsMyEntry(state, entryCrestData.id)
  );
  const player = useSelector((state: RootState) => getPlayerData(state));
  const playerEntry = useSelector((state: RootState) =>
    player?.entry ? getEntry(state, player.entry) : null
  );

  if (!enabled && !isMobile) {
    return (
      <div style={{ textAlign: "center" }}>
        <span>Adobe Express is currently unavailable</span>
      </div>
    );
  }

  if (!enabled || hasPendingCrest) return null;

  // Viewing another players badge shows report button and create/edit their own badge
  if (!mine) {
    return (
      <div className={crestActionsWrapper}>
        <ReportCrestButton entryId={entryCrestData.id} />
        {playerEntry && playerEntry.club_badge_src !== "Pending" && (
          <Button
            size="small"
            fullWidth
            onPress={() => handleCreateCrest(playerEntry.id)}
            styleVariant="outlined"
          >
            {playerEntry.club_badge_src ? "Edit My Badge" : "Create My Badge"}
          </Button>
        )}
      </div>
    );
  }

  // My entry - show only edit/create button
  return (
    <Button
      size="small"
      fullWidth
      onPress={() => handleCreateCrest(entryCrestData.id)}
      styleVariant="outlined"
    >
      {entryCrestData.club_badge_src ? "Edit My Badge" : "Create My Badge"}
    </Button>
  );
};

export default CrestSheetAction;
