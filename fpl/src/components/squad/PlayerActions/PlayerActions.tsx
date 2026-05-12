import { ThunkDispatch } from "core-integration/src/store";
import { updateElementTypeControl } from "core-integration/src/store/elements/thunks";
import { IElement } from "core-integration/src/store/elements/types";
import {
  removeElement,
  restoreElement,
} from "core-integration/src/store/squad/thunks";
import { Button } from "plos/src/components/buttons/Button";
import { useDispatch } from "react-redux";
import { PlayerActionType } from "../types";
import { actionButtonsGrid, buttonItem } from "./playerActions.css";

interface PlayerActionsProps {
  element: IElement;
  position: number;
  actionMode: PlayerActionType | undefined;
  handleViewFullProfile: () => void;
  handleClosePlayerSheet: () => void;
  handleOpenElemListSheet: () => void;
  focusPitchUnit: (position: number) => void;
}

type ButtonItemProps = {
  label: string;
  onPress: () => void;
  styleVariant?: "outlined" | "tonal";
};

const ButtonItem = ({ label, onPress, styleVariant }: ButtonItemProps) => (
  <span className={buttonItem}>
    <Button
      styleVariant={styleVariant}
      onPress={onPress}
      size="small"
      fullWidth
    >
      {label}
    </Button>
  </span>
);

const PlayerActions = ({
  element,
  position,
  actionMode,
  handleViewFullProfile,
  handleClosePlayerSheet,
  handleOpenElemListSheet,
  focusPitchUnit,
}: PlayerActionsProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const handleRemoveElement = (position: number) => {
    handleClosePlayerSheet();
    setTimeout(() => {
      dispatch(removeElement(position));
      focusPitchUnit(position);
    }, 10);
  };
  const handleRestoreElement = (position: number) => {
    handleClosePlayerSheet();
    setTimeout(() => {
      dispatch(restoreElement(position));
      focusPitchUnit(position);
    }, 10);
  };
  const handleRemoveAndReplace = (position: number, elementType: number) => {
    dispatch(removeElement(position));
    handleShowElementType(elementType);
    handleOpenElemListSheet();
  };

  const handleShowElementType = (elementType: number) => {
    dispatch(updateElementTypeControl(elementType));
    handleClosePlayerSheet();
    handleOpenElemListSheet();
  };

  if (actionMode === "restore") {
    return (
      <div className={actionButtonsGrid}>
        <ButtonItem
          label="Restore"
          onPress={() => handleRestoreElement(position)}
        />
        <ButtonItem
          label="Select Replacement"
          onPress={() => handleShowElementType(element.element_type)}
        />
        <ButtonItem
          label="Full Profile"
          onPress={() => handleViewFullProfile()}
          styleVariant="tonal"
        />
      </div>
    );
  }

  if (actionMode === "remove") {
    return (
      <div className={actionButtonsGrid}>
        <ButtonItem
          label="Remove"
          onPress={() => handleRemoveElement(position)}
        />
        <ButtonItem
          label="Select Replacement"
          onPress={() => handleRemoveAndReplace(position, element.element_type)}
        />
        <ButtonItem
          label="Full Profile"
          onPress={() => handleViewFullProfile()}
          styleVariant="tonal"
        />
      </div>
    );
  }
  return null;
};

export default PlayerActions;
