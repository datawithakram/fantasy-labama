import { ThunkDispatch } from "core-integration/src/store";
import { getElementSummary } from "core-integration/src/store/elements/thunks";
import { IElement } from "core-integration/src/store/elements/types";
import { ElementNewsAlert } from "plos/src/components/alerts";
import { Sheet } from "plos/src/components/Sheet";
import { ValidCopnr } from "plos/src/utils/validCopnr";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PlayerProfileContent from "../PlayerProfileContent";
import { ProfileSummary } from "../PlayerProfileSheet/ProfileSummary";
import WatchlistButton from "../PlayerProfileSheet/WatchlistButton";
import { ProfileVariant } from "../types";
import { contentWrapper, sheetContainer } from "./playerPreviewSheet.css";

interface PlayerPreviewSheetProps {
  element: IElement | undefined;
  open: boolean;
  handleClose: () => void;
  actionButtons: (props: { handleViewFullProfile: () => void }) => ReactNode;
}

const PlayerPreviewSheet = ({
  element,
  open,
  handleClose,
  actionButtons,
}: PlayerPreviewSheetProps) => {
  const [sheetView, setSheetView] = useState<ProfileVariant>("preview");
  const dispatch = useDispatch<ThunkDispatch>();

  useEffect(() => {
    if (!element) return;
    const elementId = element.id;
    dispatch(getElementSummary(elementId));
  }, [element, dispatch]);

  if (!element) return null;

  const {
    chance_of_playing_next_round: copnr,
    news,
    scout_news_link,
  } = element || {};

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
      footer={
        !isPreviewView ? (
          <WatchlistButton element={element} />
        ) : (
          actionButtons({
            handleViewFullProfile: () => setSheetView("full-profile"),
          })
        )
      }
    >
      {sheetView === "preview" ? (
        <div className={sheetContainer}>
          <div className={contentWrapper}>
            <div>
              {news && copnr !== null && (
                <ElementNewsAlert
                  copnr={copnr as ValidCopnr}
                  news={news}
                  newsUrl={scout_news_link}
                />
              )}
              {element && (
                <ProfileSummary element={element} variant={"preview"} />
              )}
            </div>
          </div>
        </div>
      ) : (
        <PlayerProfileContent element={element} variant={sheetView} />
      )}
    </Sheet>
  );
};

export default PlayerPreviewSheet;
