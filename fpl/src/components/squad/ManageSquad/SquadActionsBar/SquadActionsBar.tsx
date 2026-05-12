import { Button } from "plos/src/components/buttons/Button";
import { ReactNode } from "react";
import { squadActionsBarWrapper } from "./squadActionsBar.css";

interface SquadActionsBarProps {
  handleAutoPick: () => void;
  isAutoPickDisabled: boolean;
  handleReset: () => void;
  isResetDisabled: boolean;
  children: ReactNode;
}

const SquadActionsBar = ({
  handleAutoPick,
  isAutoPickDisabled,
  handleReset,
  isResetDisabled,
  children,
}: SquadActionsBarProps) => {
  return (
    <div
      className={squadActionsBarWrapper}
      role="group"
      aria-label="squad pitch action buttons"
    >
      <Button
        isDisabled={isAutoPickDisabled}
        onPress={handleAutoPick}
        styleVariant="outlined"
        size="medium"
        fullWidth
      >
        Auto Pick
      </Button>
      <Button
        isDisabled={isResetDisabled}
        onPress={handleReset}
        styleVariant="outlined"
        size="medium"
        fullWidth
      >
        Reset
      </Button>
      {children}
    </div>
  );
};

export default SquadActionsBar;
