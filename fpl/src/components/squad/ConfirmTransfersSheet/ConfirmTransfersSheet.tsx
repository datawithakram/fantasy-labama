import { RootState, ThunkDispatch } from "core-integration/src/store";
import {
  getActiveChip,
  getActiveChipName,
} from "core-integration/src/store/chips/reducers";
import { getElementsById } from "core-integration/src/store/elements/reducers";
import { getNextEvent } from "core-integration/src/store/events/reducers";
import {
  getProposedTransfers,
  getSquadError,
  getTransferCosts,
  getTransferState,
} from "core-integration/src/store/squad/reducers";
import { makeTransfers } from "core-integration/src/store/squad/thunks";
import { Button } from "plos/src/components/buttons/Button";
import { Sheet } from "plos/src/components/Sheet";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTrackingContext } from "../../../contexts/TrackingContext";
import { GameOverSheet } from "../GameOverSheet";
import { getCodeFromError } from "../helpers";
import { ErrorAlert, TransfersAlert } from "./alerts/";
import {
  actionButtonsWrapper,
  contentWrapper,
  sheetWrapper,
} from "./confirmTransfersSheet.css";
import CostBreakdownTable from "./CostBreakdownTable";

interface ConfirmTransfersSheetProps {
  isTriggerDisabled: boolean;
}

const ConfirmTransfersSheet = ({
  isTriggerDisabled,
}: ConfirmTransfersSheetProps) => {
  const [open, setOpen] = useState(false);

  const { fireClickTrackEvent } = useTrackingContext();
  const dispatch = useDispatch<ThunkDispatch>();
  const navigate = useNavigate();

  const activeChip = useSelector(getActiveChip);
  const activeChipName = useSelector(getActiveChipName);
  const elementsById = useSelector((state: RootState) =>
    getElementsById(state, undefined, activeChip?.id)
  );

  const nextEvent = useSelector(getNextEvent);
  const error = useSelector(getSquadError);
  const errorCode = getCodeFromError(error);
  const transferState = useSelector(getTransferState);
  const transferCosts = useSelector(getTransferCosts);
  const transfers = useSelector((state: RootState) =>
    getProposedTransfers(state, undefined, activeChip?.id)
  );

  const hasTransferCosts = transferCosts > 0;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sharedSheetProps = {
    open,
    handleOpen,
    handleClose,
  };

  const handleMakeTransfers = async () => {
    await dispatch(makeTransfers());
    fireClickTrackEvent(
      {
        event_category: "fantasy team",
        event_component: "fantasy classic clicks",
        event_type: "confirm transfers",
      },
      "fantasy transfers"
    );
    navigate("/my-team");
  };

  const showTransferChipWarning = useMemo(() => {
    if (!transferState || !activeChip?.is_pending) return false;

    if (activeChipName === "freehit") {
      return transfers.length + transferState.made > 0;
    }
    if (activeChipName === "manager") {
      return transfers.some(
        (transfer) => elementsById[transfer.element_in].element_type === 5
      );
    }
    if (activeChipName === "wildcard") {
      return transferState.limit
        ? transfers.length + transferState.made > 1
        : false;
    }
    return false;
  }, [transferState, activeChipName, activeChip, transfers, elementsById]);

  const chipNameDict: Record<string, string> = {
    wildcard: "Wildcard",
    manager: "Assistant Manager",
  };

  const transferChipName = chipNameDict[activeChipName] || "freehit";

  const confirmSuffix = hasTransferCosts
    ? ` (-${transferCosts}pts)`
    : activeChipName === "wildcard" && showTransferChipWarning
    ? " (and play Wildcard)"
    : activeChipName === "freehit" && showTransferChipWarning
    ? " (and play Free Hit)"
    : activeChipName === "manager" && showTransferChipWarning
    ? " (and play Assistant Manager)"
    : "";

  const actionButtons = (
    <span className="notranslate" role="status">
      <div className={actionButtonsWrapper}>
        <Button
          onPress={handleClose}
          fullWidth
          styleVariant="outlined"
          size="small"
        >
          Change transfers
        </Button>
        <Button
          onPress={handleMakeTransfers}
          fullWidth
          size="small"
          styleVariant={hasTransferCosts ? "error" : undefined}
        >
          Confirm{confirmSuffix && <>&nbsp;{confirmSuffix}</>}
        </Button>
      </div>
    </span>
  );

  return (
    <>
      <Button
        onPress={handleOpen}
        size="medium"
        fullWidth
        isDisabled={isTriggerDisabled}
      >
        Make Transfers
      </Button>
      {!nextEvent || !transferState ? (
        <GameOverSheet {...sharedSheetProps} />
      ) : (
        <Sheet
          title="Confirm Transfers"
          headerSize="xl"
          open={open}
          handleClose={handleClose}
          footer={actionButtons}
        >
          <div className={sheetWrapper}>
            <div className={contentWrapper}>
              <CostBreakdownTable
                transferState={transferState}
                elementsById={elementsById}
                transfers={transfers}
                transferCosts={transferCosts}
              />
              <TransfersAlert
                transferCosts={transferCosts}
                nextEvent={nextEvent}
                transferChipName={transferChipName}
                showTransferChipWarning={showTransferChipWarning}
              />
              <ErrorAlert errorCode={errorCode} />
            </div>
          </div>
        </Sheet>
      )}
    </>
  );
};

export default ConfirmTransfersSheet;
