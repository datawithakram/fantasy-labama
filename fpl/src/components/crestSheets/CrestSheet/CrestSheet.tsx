import { RootState, ThunkDispatch } from "core-integration/src/store";
import { submitEntryImage } from "core-integration/src/store/entries/thunks";
import { selectIsMyEntry } from "core-integration/src/store/player/reducers";
import { closeCrestSheet, getCrestSheet } from "core-integration/src/store/ui";
import { Sheet } from "plos/src/components/Sheet";
import useIsMobile from "plos/src/hooks/useIsMobile";
import { useDispatch, useSelector } from "react-redux";
import { useAdobeContext } from "../../../contexts/AdobeContext";
import adobePlaceholderDark from "../../../img/adobe/adobe-placeholder-dark.png";
import adobePlaceholder from "../../../img/adobe/adobe-placeholder.png";
import { CrestPanelControl } from "../../crests/CrestPanelControl";
import { AdobeExpressLogo } from "../AdobeExpressLogo";
import {
  adobePlaceholderImage,
  contentWrapper,
  crestWrapper,
} from "../crestStyles.css";
import CrestSheetAction from "./CrestSheetAction/CrestSheetAction";

interface CrestSheetProps {
  setSuccessImgSrc: (img: Blob | null) => void;
}

const CrestSheet = ({ setSuccessImgSrc }: CrestSheetProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const { entryCrestData } = useSelector(getCrestSheet);
  const { enabled, embed } = useAdobeContext();

  const isMobile = useIsMobile();

  const mine = useSelector((state: RootState) =>
    entryCrestData ? selectIsMyEntry(state, entryCrestData.id) : false
  );

  if (!entryCrestData) return null;

  const crestSrc = entryCrestData.club_badge_src;
  const entryName = entryCrestData.name;
  const hasPendingCrest = crestSrc === "Pending";
  const isCreateFlowMine = !hasPendingCrest && mine && !crestSrc;
  const showMobileDesktopNotice =
    !hasPendingCrest && mine && isMobile && !enabled;

  const headingText = hasPendingCrest ? "Badge Pending Moderation" : entryName;

  const handleClose = () => {
    dispatch(closeCrestSheet());
  };

  const handleCreateCrest = (id?: number) => {
    if (!enabled) return;

    const targetId = id ?? entryCrestData.id;
    handleClose();
    embed.createImage(async (img: Blob, prompt: string) => {
      await dispatch(submitEntryImage(targetId, img, prompt));
      setSuccessImgSrc(img);
    });
  };

  const renderBodyContent = () => {
    if (hasPendingCrest) {
      if (mine) {
        return (
          <p>
            You are unable to edit your badge whilst your badge is pending
            moderation. You will be able to edit your badge once it has been
            approved by our moderators.
          </p>
        );
      }

      return <p>This badge is currently pending moderation.</p>;
    }

    if (!isCreateFlowMine && !showMobileDesktopNotice) return null;

    return (
      <>
        {isCreateFlowMine && (
          <p>
            Create your team badge to enter the Adobe Express Badge League to
            compete for a VIP Premier League Experience.
          </p>
        )}
        {showMobileDesktopNotice && (
          <p>
            You can only {crestSrc ? "edit your" : "create a"} badge for your
            FPL team using a desktop or laptop computer. Please log in using a
            desktop or laptop to {crestSrc ? "edit" : "create"} your badge.
          </p>
        )}
      </>
    );
  };

  return (
    <Sheet
      open={true}
      handleClose={handleClose}
      footer={
        <CrestSheetAction
          enabled={enabled}
          entryCrestData={entryCrestData}
          hasPendingCrest={hasPendingCrest}
          isMobile={isMobile}
          handleCreateCrest={handleCreateCrest}
        />
      }
    >
      <div className={contentWrapper}>
        <h1>{headingText}</h1>
        <div className={crestWrapper}>
          {!enabled && !crestSrc ? (
            <picture>
              <source
                srcSet={adobePlaceholderDark}
                media="(prefers-color-scheme: dark)"
              />
              <img
                src={adobePlaceholder}
                className={adobePlaceholderImage}
                alt="Adobe placeholder image"
              />
            </picture>
          ) : (
            <CrestPanelControl
              entryCrestData={entryCrestData}
              // Don't render a button with no action when adobe SDK is disabled
              onPress={enabled ? handleCreateCrest : undefined}
              size="lg"
            />
          )}
          {!hasPendingCrest && <AdobeExpressLogo variant={"sheet"} />}
        </div>
        {renderBodyContent()}
      </div>
    </Sheet>
  );
};

export default CrestSheet;
