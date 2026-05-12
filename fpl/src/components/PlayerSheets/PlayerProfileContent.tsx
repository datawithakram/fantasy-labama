import { IElement } from "core-integration/src/store/elements/types";
import { ElementNewsAlert } from "plos/src/components/alerts";
import { ValidCopnr } from "plos/src/utils/validCopnr";
import { profileContainer } from "./PlayerProfileSheet/playerProfileSheet.css";
import { ProfileSummary } from "./PlayerProfileSheet/ProfileSummary";
import { PlayerProfileTables } from "./PlayerProfileSheet/Tables";
import { ProfileVariant } from "./types";

interface PlayerProfileContentProps {
  element: IElement;
  variant?: ProfileVariant;
}

const PlayerProfileContent = ({
  element,
  variant,
}: PlayerProfileContentProps) => {
  const {
    chance_of_playing_next_round: copnr,
    news,
    scout_news_link,
  } = element;

  return (
    <div className={profileContainer}>
      {news && copnr !== null && (
        <ElementNewsAlert
          copnr={copnr as ValidCopnr}
          news={news}
          newsUrl={scout_news_link}
        />
      )}
      <ProfileSummary element={element} variant={variant} />
      <PlayerProfileTables element={element} />
    </div>
  );
};

export default PlayerProfileContent;
