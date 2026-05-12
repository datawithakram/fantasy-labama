import { ThunkDispatch } from "core-integration/src/store";
import { getNextEvent } from "core-integration/src/store/events/reducers";
import { fetchMyTeam } from "core-integration/src/store/my-team/thunks";
import { getTransferState } from "core-integration/src/store/squad/reducers";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HelmetHead } from "../HelmetHead";
import { LeaderboardAd } from "../LeaderboardAd";
import SquadBase from "./SquadBase";
import { TransfersScoreboard } from "./TransfersScoreboard";

const Transfers = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const nextEvent = useSelector(getNextEvent);
  const transfersState = useSelector(getTransferState);

  useEffect(() => {
    dispatch(fetchMyTeam());
  }, [dispatch]);

  // Don't render until we know what transfers state we need to render ...
  if (!transfersState) {
    return null;
  }

  return (
    <>
      <LeaderboardAd slot="Leaderboard_Transfers" id="ism-transfers-ad" />
      <SquadBase
        scoreboard={<TransfersScoreboard />}
        title="Transfers"
        headTags={
          <HelmetHead
            title="Fantasy Football Transfers | Fantasy Premier League"
            description="To make transfers in your Fantasy Premier League team and consider playing your wildcard, visit the official website of the Premier League."
          />
        }
        nextEvent={nextEvent}
      />
    </>
  );
};

export default Transfers;
