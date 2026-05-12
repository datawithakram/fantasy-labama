import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getElement } from "core-integration/src/store/elements/reducers";
import { getElementSummary } from "core-integration/src/store/elements/thunks";
import { Button } from "plos/src/components/buttons/Button";
import { Sheet } from "plos/src/components/Sheet";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PlayerProfileContent from "../../PlayerSheets/PlayerProfileContent";
import { getDisplayName } from "../../PlayerSheets/PlayerProfileSheet/ProfileSummary/utils";
import { ProfileVariant } from "../../PlayerSheets/types";
import ElementExplainContent from "./ElementExplainContent";
import { playerName, sheetContainer } from "./elementExplainSheet.css";
import { ElementExplainSheetProps } from "./types";

const ElementExplainSheet = ({
  elementId,
  open,
  handleClose,
  eventId,
}: ElementExplainSheetProps) => {
  const [sheetView, setSheetView] = useState<ProfileVariant>("preview");
  const dispatch = useDispatch<ThunkDispatch>();

  useEffect(() => {
    if (elementId) {
      dispatch(getElementSummary(elementId));
    }
  }, [elementId]);

  const element = useSelector((state: RootState) =>
    getElement(state, elementId)
  );

  if (!element) return null;

  const displayName = getDisplayName(element);
  const oneLineName = displayName.showKnownName
    ? displayName.knownName
    : `${displayName.firstName} ${displayName.secondName}`;

  const isPreviewView = sheetView === "preview";
  const sizeVariant = isPreviewView ? "small" : "large";

  return (
    <Sheet
      open={open}
      handleClose={() => {
        handleClose();
        setSheetView("preview");
      }}
      handleBack={
        !isPreviewView
          ? () => {
              setSheetView("preview");
            }
          : undefined
      }
      sizeVariant={sizeVariant}
    >
      {sheetView === "preview" ? (
        <>
          <h1 className={playerName}>{oneLineName}</h1>
          <div className={sheetContainer}>
            <ElementExplainContent elementId={elementId} eventId={eventId} />
            <Button
              styleVariant="filled"
              onPress={() => {
                setSheetView("full-profile");
              }}
              fullWidth
            >
              View full profile
            </Button>
          </div>
        </>
      ) : (
        <PlayerProfileContent element={element} variant={sheetView} />
      )}
    </Sheet>
  );
};

export default ElementExplainSheet;
