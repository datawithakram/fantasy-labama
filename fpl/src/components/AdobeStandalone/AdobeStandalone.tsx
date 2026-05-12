import { ThunkDispatch } from "core-integration/src/store";
import { submitEntryImage } from "core-integration/src/store/entries/thunks";
import type { EntryCrestData } from "core-integration/src/store/ui";
import { WebViewContext } from "plos/src/contexts/WebViewContext";
import useIsMobile from "plos/src/hooks/useIsMobile";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { useAdobeContext } from "../../contexts/AdobeContext";
import { AdobeExpressLogo } from "../crestSheets/AdobeExpressLogo";
import { CrestSheetAction } from "../crestSheets/CrestSheet/CrestSheetAction";
import { CrestPanelControl } from "../crests/CrestPanelControl";
import { standaloneWrapper } from "./adobeStandalone.css";

interface AdobeStandaloneProps {
  entryCrestData: EntryCrestData;
}

const AdobeStandalone = ({ entryCrestData }: AdobeStandaloneProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const { embed, enabled } = useAdobeContext();
  const { isWebView } = useContext(WebViewContext);

  const isMobile = useIsMobile();

  const hasPendingCrest = entryCrestData.club_badge_src === "Pending";

  const handleCreateCrest = () => {
    // If SDK not enabled do nothing
    if (!enabled) {
      return;
    }

    const handleOnImageCreate = async (img: Blob, prompt: string) => {
      await dispatch(submitEntryImage(entryCrestData.id, img, prompt));
      if (isWebView) {
        window.location.href = "/badge-create?webview&success=true";
      }
    };

    const handleOnImageCreateError = (error: any) => {
      console.log(error);
      if (isWebView) {
        window.location.href = "/badge-create?webview&success=false";
      }
    };

    embed.createImage(handleOnImageCreate, handleOnImageCreateError);
  };

  return (
    <div className={standaloneWrapper}>
      {/* Don't render a button with no action when adobe SDK is disabled */}
      <CrestPanelControl
        entryCrestData={entryCrestData}
        onPress={enabled ? handleCreateCrest : undefined}
      />
      <AdobeExpressLogo variant="panel" />
      {!hasPendingCrest && (
        <CrestSheetAction
          enabled={enabled}
          entryCrestData={entryCrestData}
          hasPendingCrest={hasPendingCrest}
          isMobile={isMobile}
          handleCreateCrest={handleCreateCrest}
        />
      )}
    </div>
  );
};

export default AdobeStandalone;
