import { useSelector } from "react-redux";
import { getRegionsById } from "core-integration/src/store/regions/reducers";
import { headingStyles } from "plos/src/components/HeadingInContainer/headingInContainer.css";
import {
  entryNameStyles,
  playerName,
  playerNameContainer,
} from "./eventSummary.css";
import CountryFlag from "plos/src/components/CountryFlag";
import { IEntry } from "core-integration/src/store/entries/types";

interface EntryHeadingProps {
  entry: IEntry;
}

const EntryHeading = ({ entry }: EntryHeadingProps) => {
  const {
    name: entryName,
    player_region_id: playerRegionId,
    player_first_name: firstName,
    player_last_name: lastName,
  } = entry;

  const regionsById = useSelector(getRegionsById);
  const region = playerRegionId ? regionsById[playerRegionId] : undefined;

  return (
    <div className={headingStyles}>
      <h2 className={entryNameStyles}>{entryName}</h2>
      <div className={playerNameContainer}>
        <span className={playerName}>
          {firstName} {lastName}
        </span>
        {region && <CountryFlag region={region} width="27px" height="18px" />}
      </div>
    </div>
  );
};

export default EntryHeading;
