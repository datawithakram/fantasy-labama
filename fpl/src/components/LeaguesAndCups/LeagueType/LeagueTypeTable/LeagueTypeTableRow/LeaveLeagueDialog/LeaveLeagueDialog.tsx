import { ThunkDispatch } from "core-integration/src/store";
import { leaveLeague } from "core-integration/src/store/leagues/thunks";
import { Button } from "plos/src/components/buttons/Button";
import Dialog from "plos/src/components/Dialog";
import { useDispatch } from "react-redux";
import {
  leaveLeagueButtons,
  leaveLeagueMessage,
} from "./leaveLeagueDialog.css";
import { LeaveLeagueDialogProps } from "./types";

const LeaveLeagueDialog = ({
  league,
  isOpen,
  handleClose,
}: LeaveLeagueDialogProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const handleLeave = () => {
    dispatch(leaveLeague(league.id));
    handleClose();
  };

  return (
    <Dialog isOpen={isOpen} handleClose={handleClose}>
      <p className={leaveLeagueMessage}>
        Are you sure you want to leave {league.name}?
      </p>
      <div className={leaveLeagueButtons}>
        <Button styleVariant="error" fullWidth onPress={handleLeave}>
          Yes, I want to leave this league
        </Button>
        <Button styleVariant="outlined" fullWidth onPress={handleClose}>
          No, I don't want to leave
        </Button>
      </div>
    </Dialog>
  );
};

export default LeaveLeagueDialog;
