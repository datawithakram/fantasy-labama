import { ThunkDispatch } from "core-integration/src/store";
import { getActiveOrProposedTeamChipName } from "core-integration/src/store/chips/reducers";
import { chipActivationHandle } from "core-integration/src/store/chips/thunks";
import { IPotentialChip } from "core-integration/src/store/chips/types";
import { Button } from "plos/src/components/buttons/Button";
import { useDispatch, useSelector } from "react-redux";
import { useTrackingContext } from "../../../contexts/TrackingContext";
import { getChipName } from "../../../utils/chips";

interface ChipActionProps {
  chip: IPotentialChip;
  handleClose: () => void;
}

const ChipAction = ({ chip, handleClose }: ChipActionProps) => {
  const { fireClickTrackEvent } = useTrackingContext();
  const dispatch = useDispatch<ThunkDispatch>();

  const activateChip = (name: string) => dispatch(chipActivationHandle(name));
  const deactivateChip = () => dispatch(chipActivationHandle(null));

  const chipInPlayName = useSelector(getActiveOrProposedTeamChipName);

  const { name: chipName, status_for_entry: statusForEntry } = chip;

  const chipDisplayName = getChipName(chipName);

  const playChip = () => {
    handleClose();
    activateChip(chipName);
    fireClickTrackEvent(
      {
        event_category: "fantasy team",
        event_component: "fantasy classic clicks",
        event_detail: chipDisplayName.toLowerCase(),
        event_type: "play chip",
      },
      "fantasy pick team"
    );
  };

  const cancelChip = () => {
    handleClose();
    deactivateChip();
  };

  switch (statusForEntry) {
    case "available":
      return (
        <Button
          styleVariant="success"
          size="small"
          fullWidth
          onPress={playChip}
        >
          Play {chipDisplayName}
        </Button>
      );
    case "unavailable":
      return null;
    case "proposed":
    case "active":
      return (
        <Button
          styleVariant="error"
          size="small"
          fullWidth
          onPress={cancelChip}
        >
          Cancel {chipDisplayName}
        </Button>
      );
    case "cancelled":
      return (
        <Button
          styleVariant="success"
          size="small"
          fullWidth
          onPress={playChip}
          isDisabled={Boolean(chipInPlayName)}
        >
          Activate {chipDisplayName}
        </Button>
      );
    default:
      return null;
  }
};

export default ChipAction;
