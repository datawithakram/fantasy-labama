import { ToggleButton } from "plos/src/components/ToggleButton";
import { ToggleButtonGroup } from "plos/src/components/ToggleButtonGroup";
import { Key, useEffect } from "react";
import { useNavigate } from "react-router";
import { useTrackingContext } from "../../../contexts/TrackingContext";
import { toggleButtonWrapper } from "./leaguesAndCupsToggle.css";

type LeaguesAndCupsView = "leagues" | "cups";

const linksDict = {
  leagues: "/leagues",
  cups: "/leagues/cups",
};

interface LeaguesAndCupsToggleProps {
  selected: LeaguesAndCupsView;
}

const LeaguesAndCupsToggle = ({ selected }: LeaguesAndCupsToggleProps) => {
  const { firePageViewEvent } = useTrackingContext();
  const navigate = useNavigate();

  const handleViewChange = (keys: Set<Key>) => {
    const key = Array.from(keys)[0] as LeaguesAndCupsView;
    if (key) {
      navigate(linksDict[key]);
    }
  };

  useEffect(() => {
    firePageViewEvent(
      "fantasy leagues & cups",
      selected === "leagues" ? "league view" : "cup view"
    );
  }, []);

  return (
    <div className={toggleButtonWrapper}>
      <ToggleButtonGroup
        selectedKeys={new Set([selected])}
        onSelectionChange={handleViewChange}
      >
        <ToggleButton id="leagues">Leagues</ToggleButton>
        <ToggleButton id="cups">Cups</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default LeaguesAndCupsToggle;
