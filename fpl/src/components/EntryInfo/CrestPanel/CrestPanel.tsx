import { RootState, ThunkDispatch } from "core-integration/src/store";
import { submitEntryImage } from "core-integration/src/store/entries/thunks";
import { selectIsMyEntry } from "core-integration/src/store/player/reducers";
import { closeCrestSheet, openCrestSheet } from "core-integration/src/store/ui";
import {
  EntryCrestData,
  setSuccessImgSrc,
} from "core-integration/src/store/ui/uiSlice";
import { Button } from "plos/src/components/buttons/Button";
import { useDispatch, useSelector } from "react-redux";
import { useAdobeContext } from "../../../contexts/AdobeContext";
import { CrestPanelControl } from "../../crests/CrestPanelControl";
import { AdobeExpressLogo } from "../../crestSheets/AdobeExpressLogo";
import { ChevronRight } from "../../icons/Chevrons";
import ReportCrestButton from "../../ReportCrestButton";
import EntryInfoPanel from "../EntryInfoPanel";
import { crestWrapper } from "./CrestPanel.css";

interface PanelProps {
  entryCrestData: EntryCrestData;
}

const CrestPanel = ({ entryCrestData }: PanelProps) => {
  const dispatch = useDispatch<ThunkDispatch>();
  const { enabled, embed } = useAdobeContext();

  const mine = useSelector((state: RootState) =>
    selectIsMyEntry(state, entryCrestData.id)
  );

  const hasCrest =
    entryCrestData.club_badge_src &&
    entryCrestData.club_badge_src !== "Pending";
  const hasPendingCrest = entryCrestData.club_badge_src === "Pending";

  const handleOpenCreateSheet = () => {
    dispatch(openCrestSheet(entryCrestData));
  };

  const handleCreateCrest = () => {
    // If SDK not enabled do nothing
    if (!enabled) return;

    dispatch(closeCrestSheet());
    embed.createImage(async (img: Blob, prompt: string) => {
      await dispatch(submitEntryImage(entryCrestData.id, img, prompt));
      dispatch(setSuccessImgSrc(img));
    });
  };

  const headerAction = mine && (
    <Button onPress={handleOpenCreateSheet} styleVariant="tonal" size="small">
      {hasCrest || hasPendingCrest ? "Edit My Badge" : "Generate Team Badge"}
      <ChevronRight height={10} width={10} />
    </Button>
  );

  return (
    <EntryInfoPanel title="Team Badge" headerAction={headerAction}>
      <div className={crestWrapper}>
        {/* Don't render a button with no action when adobe SDK is disabled */}
        <CrestPanelControl
          entryCrestData={entryCrestData}
          onPress={enabled ? handleCreateCrest : undefined}
        />
        {!hasPendingCrest && <AdobeExpressLogo variant={"panel"} />}
      </div>
      {!mine && <ReportCrestButton entryId={entryCrestData.id} />}
    </EntryInfoPanel>
  );
};

export default CrestPanel;
