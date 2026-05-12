import { ThunkDispatch } from "core-integration/src/store";
import { chipActivationHandle } from "core-integration/src/store/chips/thunks";
import { IPotentialChip } from "core-integration/src/store/chips/types";
import { getTransferState } from "core-integration/src/store/squad/reducers";
import { Button } from "plos/src/components/buttons/Button";
import { Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChipName } from "../../../utils/chips";
import { activeTransferButton, buttonWrap } from "./chipSheet.css";

interface TransfersChipActionProps {
  chip: IPotentialChip;
  handleClose: () => void;
  showModalConfirmation: boolean;
  setShowModalConfirmation: Dispatch<SetStateAction<boolean>>;
}

const TransfersChipAction = ({
  chip,
  handleClose,
  showModalConfirmation,
  setShowModalConfirmation,
}: TransfersChipActionProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const transferState = useSelector(getTransferState);

  const activateChip = (name: string) => dispatch(chipActivationHandle(name));
  const deactivateChip = () => dispatch(chipActivationHandle(null));

  const handlePlayClick = (chipName: string, handleHide: () => void) => {
    let askConfirmation = false;
    if (chipName === "freehit") {
      askConfirmation = transferState ? transferState.made > 0 : false;
    } else if (chipName === "wildcard") {
      askConfirmation =
        transferState && transferState.limit ? transferState.made > 1 : false;
    }

    if (!askConfirmation) {
      activateChip(chipName);
      handleHide();
      setShowModalConfirmation(false);
    } else {
      setShowModalConfirmation(true);
    }
  };

  const handleConfirmClick = (chipName: string) => {
    setShowModalConfirmation(false);
    activateChip(chipName);
  };

  const handleCancelClick = () => {
    setShowModalConfirmation(false);
    deactivateChip();
  };

  const chipDisplayName = getChipName(chip.name);

  switch (chip.status_for_entry) {
    case "available":
      return (
        <div className={buttonWrap}>
          {showModalConfirmation ? (
            <>
              <Button
                styleVariant="success"
                size="small"
                fullWidth
                onPress={() => {
                  handleConfirmClick(chip.name);
                  handleClose();
                }}
              >
                Confirm {chipDisplayName}
              </Button>
              <Button
                styleVariant="error"
                size="small"
                fullWidth
                onPress={() => {
                  handleCancelClick();
                  handleClose();
                }}
              >
                Cancel {chipDisplayName}
              </Button>
            </>
          ) : (
            <Button
              styleVariant="success"
              size="small"
              fullWidth
              onPress={() => {
                handlePlayClick(chip.name, handleClose);
              }}
            >
              Play {chipDisplayName}
            </Button>
          )}
        </div>
      );

    case "unavailable":
      return null;

    case "active":
      if (chip.is_pending) {
        return (
          <Button
            styleVariant="error"
            size="small"
            fullWidth
            onPress={() => {
              handleClose();
              deactivateChip();
            }}
          >
            Cancel {chipDisplayName}
          </Button>
        );
      }

      return <div className={activeTransferButton}>Active</div>;

    default:
      return null;
  }
};

export default TransfersChipAction;
