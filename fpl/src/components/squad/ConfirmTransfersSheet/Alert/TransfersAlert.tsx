import { Alert } from "plos/src/components/alerts";
import { formatRawAsLocal } from "core-integration/src/utils/datetime";
import StatusIcon from "../../../../img/icons/status.svg?react";
import { IEvent } from "core-integration/src/store/events/types";
import { chipWarningWrapper } from "./alerts.css";
import { vars } from "plos/src/styles/theme.css";

interface TransfersAlertProps {
  transferCosts: number;
  nextEvent: IEvent;
  transferChipName: string;
  showTransferChipWarning: boolean;
}

const TransfersAlert = ({
  transferCosts,
  nextEvent,
  transferChipName,
  showTransferChipWarning,
}: TransfersAlertProps) => {
  if (transferCosts > 0) {
    return (
      <Alert variant="error" isLiveRegion>
        <span>
          These transfers will be active for {nextEvent.name} (
          {formatRawAsLocal(nextEvent.deadline_time)}) and{" "}
          <strong>will deduct {transferCosts}pts from your score!</strong>
        </span>
      </Alert>
    );
  }

  return (
    <Alert isLiveRegion>
      <>
        {showTransferChipWarning && (
          <>
            <span className={chipWarningWrapper}>
              <StatusIcon
                fill={vars.colors.white}
                color={vars.colors.primary}
                width={16}
              />
              <strong>{`${transferChipName} Active`}</strong>
            </span>
            <span>
              {`Confirming this transfer locks in your ${transferChipName}.`}{" "}
            </span>
          </>
        )}
        <span>
          These transfers will be active for {nextEvent.name} (
          {formatRawAsLocal(nextEvent.deadline_time)}).
        </span>
      </>
    </Alert>
  );
};

export default TransfersAlert;
