import PlayerInfoPanel from "plos/src/components/PlayerInfoPanel";
import { BasicScoreboard } from "plos/src/components/Scoreboard";
import useScoreboard from "plos/src/components/Scoreboard/useScoreboard";
import { useDispatch, useSelector } from "react-redux";
import { getRegionsById } from "core-integration/src/store/regions/reducers";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { useEffect } from "react";
import { fetchRegions } from "core-integration/src/store/regions/thunks";
import { scoreboardGrid } from "plos/src/components/Scoreboard/scoreboard.css";

const SquadSelectionScoreboard = () => {
  const dispatch = useDispatch<ThunkDispatch>();

  const {
    currencyDivisor,
    elementTypesByPosition,
    proposedElements,
    toSpend,
    isNeedElements,
    isBudgetExceeded,
  } = useScoreboard();

  useEffect(() => {
    dispatch(fetchRegions());
  }, [dispatch]);

  const player = useSelector(getPlayerData) as ILoggedInPlayer;
  const regionsById = useSelector(getRegionsById);
  const region = player.region ? regionsById[player.region] : undefined;

  const entry = useSelector((state: RootState) =>
    getEntry(state, player.entry)
  );

  return (
    <div className={scoreboardGrid}>
      <PlayerInfoPanel region={region} entry={entry} player={player} />
      <BasicScoreboard
        currencyDivisor={currencyDivisor}
        elementTypesByPosition={elementTypesByPosition}
        isBudgetExceeded={isBudgetExceeded}
        isNeedElements={isNeedElements}
        proposedElements={proposedElements}
        toSpend={toSpend}
      />
    </div>
  );
};

export default SquadSelectionScoreboard;
