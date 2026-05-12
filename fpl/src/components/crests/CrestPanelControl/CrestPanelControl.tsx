import { RootState } from "core-integration/src/store";
import { selectIsMyEntry } from "core-integration/src/store/player/reducers";
import { EntryCrestData } from "core-integration/src/store/ui";
import { unstyledButton } from "plos/src/styles";
import { Button } from "react-aria-components";
import { useSelector } from "react-redux";
import { CrestPlaceholder } from "../CrestPlaceholder/CrestPlaceholder";
import { entryCrestButton, fluidCrestImg } from "../sharedStyles.css";

interface ControlProps {
  entryCrestData: EntryCrestData;
  onPress?: () => void;
  size?: "sm" | "lg";
}

const CrestPanelControl = ({
  entryCrestData,
  onPress,
  size = "sm",
}: ControlProps) => {
  const mine = useSelector((state: RootState) =>
    selectIsMyEntry(state, entryCrestData.id)
  );

  const crestSrc = entryCrestData.club_badge_src;

  if (!crestSrc) {
    // Only show button if onPress is provided - I.e. Adobe SDK is enabled
    return onPress ? (
      <Button onPress={onPress} className={unstyledButton}>
        <CrestPlaceholder size={size} />
      </Button>
    ) : (
      <CrestPlaceholder size={size} />
    );
  }

  if (crestSrc === "Pending") {
    return <CrestPlaceholder size={size} status="pending" />;
  }

  const img = <img src={crestSrc} alt="" className={fluidCrestImg} />;
  if (mine && onPress) {
    return (
      <Button
        className={entryCrestButton}
        onPress={onPress}
        aria-label="Edit your team badge"
      >
        {img}
      </Button>
    );
  }
  return img;
};

export default CrestPanelControl;
