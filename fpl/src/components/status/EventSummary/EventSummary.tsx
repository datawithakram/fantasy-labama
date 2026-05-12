import { RootState, ThunkDispatch } from "core-integration/src/store";
import { fetchEventLive } from "core-integration/src/store/elements/thunks";
import type { EntryCrestData } from "core-integration/src/store/ui";
import { getEntryEventPoints } from "core-integration/src/store/entries/reducers";
import { fetchEntryEventPicks } from "core-integration/src/store/entries/thunks";
import { iconStyles } from "plos/src/components/HeadingInContainer/headingInContainer.css";
import ButtonLink from "plos/src/components/links/ButtonLink";
import RouterLink from "plos/src/components/links/RouterLink";
import RightArrow from "plos/src/img/icons/right-arrow.svg?react";
import ShirtIcon from "plos/src/img/icons/shirt.svg?react";
import TransfersIcon from "plos/src/img/icons/transfers.svg?react";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { EntryCrest } from "../../crests/EntryCrest";
import EntryHeading from "./EntryHeading";
import {
  arrowIconStyles,
  buttonContainer,
  eventName,
  eventSummaryContainer,
  eventSummaryIcon,
  eventSummaryScorePanel,
  eventSummaryScores,
  eventSummaryWrap,
  glassDivider,
  gradientWrapper,
  linkStyles,
  primaryScore,
  scoreHeaders,
  secondaryScore,
  statusSummaryHeader,
} from "./eventSummary.css";
import { EventSummaryProps } from "./types";

const EventSummary = ({ entry, currentEvent }: EventSummaryProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const { id: entryId, started_event: startedEvent } = entry;

  const {
    id: currentEventId,
    highest_scoring_entry: highestScoringEntry,
    highest_score: highestScore,
    average_entry_score: averageEntryScore,
    name: currentEventName,
  } = currentEvent;

  const hasJoinedCurrentEvent = startedEvent <= currentEventId;

  const entryPoints = useSelector((state: RootState) =>
    getEntryEventPoints(state, entryId, currentEventId)
  );
  const entryCrestData: EntryCrestData = {
    id: entry.id,
    name: entry.name,
    club_badge_src: entry.club_badge_src,
  };

  const fetchData = useCallback(() => {
    // if the entry joined after the current event deadline
    // no picks will be available
    if (hasJoinedCurrentEvent) {
      dispatch(fetchEntryEventPicks(entryId, currentEventId));
      dispatch(fetchEventLive(currentEventId));
    }
  }, [dispatch, entryId, currentEventId]);

  useEffect(() => {
    if (entryId && currentEventId) {
      fetchData();
    }
  }, [dispatch, fetchData, entryId, currentEventId]);

  return (
    <div className={gradientWrapper}>
      <div className={eventSummaryContainer}>
        <div className={statusSummaryHeader}>
          <EntryCrest entryCrestData={entryCrestData} dimension={35} />
          {hasJoinedCurrentEvent ? (
            <Link
              to={`/entry/${entryId}/event/${currentEventId}`}
              className={linkStyles}
            >
              <EntryHeading entry={entry} />
              <RightArrow width={24} height={24} className={iconStyles} />
            </Link>
          ) : (
            <EntryHeading entry={entry} />
          )}
        </div>
        <hr className={glassDivider} />

        <div className={eventSummaryWrap}>
          <h3 className={eventName}>{currentEventName}</h3>

          <div className={eventSummaryScores}>
            {/* Average score panel */}
            <div className={eventSummaryScorePanel}>
              <h4 className={scoreHeaders}>Average</h4>
              <div className={secondaryScore}>{averageEntryScore}</div>
            </div>
            {/* Entry score panel */}
            <div className={eventSummaryScorePanel}>
              {hasJoinedCurrentEvent ? (
                <>
                  <RouterLink
                    to={`/entry/${entryId}/event/${currentEventId}`}
                    className={linkStyles}
                  >
                    Points
                    <RightArrow
                      width={12}
                      height={12}
                      className={arrowIconStyles}
                    />
                  </RouterLink>
                  <h4 className={primaryScore}>{entryPoints}</h4>
                </>
              ) : (
                <h4 className={primaryScore}>-</h4>
              )}
            </div>
            {/* Highest score panel */}
            <div className={eventSummaryScorePanel}>
              {highestScore ? (
                <RouterLink
                  to={`/entry/${highestScoringEntry}/event/${currentEventId}`}
                  className={linkStyles}
                >
                  Highest
                  <RightArrow
                    width={12}
                    height={12}
                    className={arrowIconStyles}
                  />
                </RouterLink>
              ) : (
                <h4 className={scoreHeaders}>Highest</h4>
              )}
              <span className={secondaryScore}>
                {highestScore ? highestScore : "-"}
              </span>
            </div>
          </div>

          <div className={buttonContainer}>
            <ButtonLink styleVariant="glass" fullWidth to="/my-team">
              <ShirtIcon className={eventSummaryIcon} />
              Pick Team
            </ButtonLink>
            <ButtonLink styleVariant="glass" fullWidth to="/transfers">
              <TransfersIcon className={eventSummaryIcon} />
              Transfers
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventSummary;
