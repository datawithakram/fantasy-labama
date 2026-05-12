import { getNextEvent } from "core-integration/src/store/events/reducers";
import { useSelector } from "react-redux";
import { HelmetHead } from "../HelmetHead";
import SquadBase from "./SquadBase";
import { SquadSelectionScoreboard } from "./SquadSelectionScoreboard";

const SquadSelection = () => (
  <SquadBase
    scoreboard={<SquadSelectionScoreboard />}
    title="Squad Selection"
    headTags={
      <HelmetHead
        title="Select Fantasy Football Players | Fantasy Premier League"
        description="To select your first Fantasy Premier League squad after completing the registration process, visit the official website of the Premier League."
      />
    }
    nextEvent={useSelector(getNextEvent)}
  />
);

export default SquadSelection;
