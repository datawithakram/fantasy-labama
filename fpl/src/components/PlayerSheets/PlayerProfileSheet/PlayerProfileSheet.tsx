import { RootState, ThunkDispatch } from "core-integration/src/store";
import { elementDialogHide } from "core-integration/src/store/elements/actions";
import {
  getElement,
  getElementDialog,
} from "core-integration/src/store/elements/reducers";
import { IElement } from "core-integration/src/store/elements/types";
import { Sheet } from "plos/src/components/Sheet";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerProfileContent from "../PlayerProfileContent";
import WatchlistButton from "./WatchlistButton";

interface PlayerProfileSheetProps {
  element: IElement;
}

const PlayerProfileSheet = ({ element }: PlayerProfileSheetProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const closeSheet = useCallback(
    () => dispatch(elementDialogHide()),
    [dispatch]
  );

  return (
    <Sheet
      open={Boolean(element)}
      handleClose={closeSheet}
      sizeVariant="large"
      footer={<WatchlistButton element={element} />}
    >
      <PlayerProfileContent element={element} />
    </Sheet>
  );
};

const PlayerProfileSheetContainer = () => {
  const elementId = useSelector(getElementDialog);
  const element = useSelector((state: RootState) =>
    getElement(state, elementId)
  );

  return element ? <PlayerProfileSheet element={element} /> : null;
};

export default PlayerProfileSheetContainer;
