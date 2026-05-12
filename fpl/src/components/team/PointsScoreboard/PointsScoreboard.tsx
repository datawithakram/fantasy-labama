import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getEntryEventPoints } from "core-integration/src/store/entries/reducers";
import { fetchFixtures } from "core-integration/src/store/fixtures/thunks";
import { Button } from "plos/src/components/buttons/Button";
import { rotating } from "plos/src/styles/utils.css";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import Reload from "../../../img/icons/reload.svg?react";
import { getChipName } from "../../../utils/chips";
import { ControlArrowRight } from "../../icons/Arrows";
import {
  chipStatus,
  itemLink,
  pointsPanel,
  pointsScoreboard,
  primaryHeading,
  primaryPanel,
  primaryValue,
  reloadButton,
  scoreboardPrimary,
  scoreboardSecondary,
  secondaryHeading,
  secondaryItem,
  secondaryPanel,
  secondaryValue,
  transfersValue,
} from "./pointsScoreboard.css";
import { PointsScoreboardProps } from "./types";

const PointsScoreboard = ({
  entryData,
  fetchData,
  entryId,
  eventId,
  event,
}: PointsScoreboardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<ThunkDispatch>();

  const points = useSelector((state: RootState) =>
    getEntryEventPoints(state, entryId, eventId)
  );

  const fetchDataAndFixtures = async () => {
    // Set loading to true at start
    setIsLoading(true);

    try {
      // Run both operations in parallel
      const fixturesPromise = dispatch(fetchFixtures(eventId));
      const dataPromise = fetchData();
      const timeoutPromise = new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      // Wait for both data operations and the minimum timeout to allow the animation to complete
      await Promise.all([fixturesPromise, dataPromise, timeoutPromise]);
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      // Set loading to false when everything is done
      setIsLoading(false);
    }
  };

  const {
    entry_history: {
      rank: entryHistoryRank,
      event_transfers: entryHistoryEventTransfers,
      event_transfers_cost: entryHistoryEventTransfersCost,
    },
    active_chip,
  } = entryData;

  const chipName = active_chip ? getChipName(active_chip) : "";

  return (
    <div className={pointsScoreboard}>
      <div className={scoreboardSecondary}>
        <div className={secondaryPanel}>
          <div className={secondaryItem}>
            <div className={secondaryValue}>
              {event.average_entry_score || "-"}
            </div>
            <span className={secondaryHeading}>Average Points</span>
          </div>
          <div className={secondaryItem}>
            {event.highest_scoring_entry ? (
              <Link
                to={`/entry/${event.highest_scoring_entry}/event/${eventId}`}
                className={itemLink}
              >
                <div className={secondaryValue}>
                  {event.highest_score || "-"}
                </div>
                <span className={secondaryHeading}>
                  Highest Points <ControlArrowRight />
                </span>
              </Link>
            ) : (
              <>
                <div className={secondaryValue}>-</div>
                <span className={secondaryHeading}>Highest Points</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className={scoreboardPrimary}>
        <div className={primaryPanel}>
          <div className={pointsPanel}>
            <div className={primaryValue}>{points}</div>
            <h3 className={primaryHeading}>
              {event.finished ? "Total Points" : "Latest Points"}
            </h3>
          </div>
          {chipName && <div className={chipStatus}>{chipName}</div>}
          {!event.finished && (
            <Button
              onPress={fetchDataAndFixtures}
              className={reloadButton}
              aria-label="Reload Points"
            >
              <Reload className={isLoading ? rotating : undefined} />
            </Button>
          )}
        </div>
      </div>
      <div className={scoreboardSecondary}>
        <div className={secondaryPanel}>
          <div className={secondaryItem}>
            <div className={secondaryValue}>
              {entryHistoryRank ? entryHistoryRank.toLocaleString() : "-"}
            </div>
            <span className={secondaryHeading}>GW Rank</span>
          </div>
          <div className={secondaryItem}>
            <Link to={`/entry/${entryId}/transfers`} className={itemLink}>
              <div className={secondaryValue}>
                <span>{entryHistoryEventTransfers}</span>
                {entryHistoryEventTransfersCost ? (
                  <span
                    className={transfersValue}
                  >{`(-${entryHistoryEventTransfersCost} pts)`}</span>
                ) : (
                  ""
                )}
              </div>
              <span className={secondaryHeading}>
                Transfers <ControlArrowRight />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsScoreboard;
