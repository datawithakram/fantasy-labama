import { RootState, ThunkDispatch } from "core-integration/src/store";
import {
  getElementsById,
  getElementsEventDataById,
} from "core-integration/src/store/elements/reducers";
import { fetchEventLive } from "core-integration/src/store/elements/thunks";
import {
  getEntry,
  getEntryEventFormation,
  getEntryEventPicks,
} from "core-integration/src/store/entries/reducers";
import {
  fetchEntryEventPicks,
  fetchEntrySummary,
} from "core-integration/src/store/entries/thunks";
import { IPickLight } from "core-integration/src/store/entries/types";
import {
  getCurrentEvent,
  getEventsById,
  getNextEvent,
} from "core-integration/src/store/events/reducers";
import type { EntryCrestData } from "core-integration/src/store/ui";
import { getSettings } from "core-integration/src/store/game/reducers";
import { ISettings } from "core-integration/src/store/game/types";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { IPlayer } from "core-integration/src/store/player/types";
import range from "lodash/range";
import { PagerButton } from "plos/src/components/buttons/PagerButton";
import ValueForPlayedElement from "plos/src/components/ElementCard/ValueForPlayedElement";
import { Fixtures } from "plos/src/components/Fixtures";
import PageTitle from "plos/src/components/PageTitle";
import Pitch from "plos/src/components/Pitch";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { Cell, Column, Table } from "plos/src/components/Table";
import { dreamTeamIcon } from "plos/src/components/TeamPitchElement/teamPitchElement.css";
import { ToggleButton } from "plos/src/components/ToggleButton";
import { ToggleButtonGroup } from "plos/src/components/ToggleButtonGroup";
import { ElementIconLink } from "plos/src/components/tooltips/ElementIconLink";
import { entryEventMain, leftSidebarLayout } from "plos/src/layouts";
import { edgeToEdge } from "plos/src/styles";
import { Key, useCallback, useEffect, useState } from "react";
import { Row, TableBody, TableHeader } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { useTrackingContext } from "../../contexts/TrackingContext";
import DreamTeam from "../../img/icons/dreamteam.svg?react";
import { Loading } from "../App";
import { EntryCrest } from "../crests/EntryCrest";
import EntryInfo from "../EntryInfo";
import { HelmetHead } from "../HelmetHead";
import { ArrowRight } from "../icons/Arrows";
import { LeaderboardAd } from "../LeaderboardAd";
import { NotFound } from "../Routes";
import { pitchViewToggle } from "../squad/ManageSquad/manageSquad.css";
import { Bench, BenchUnit } from "./Bench";
import ElementExplainSheet from "./ElementExplainSheet";
import EntryEventTable from "./EntryEventTable";
import {
  autoSubsWrapper,
  boldLink,
  dreamTeamWrap,
  entryCrestStyles,
  eventHeaderWrapper,
  eventHeading,
  eventPager,
  nextEvent,
  previousEvent,
  teamPitchWrap,
  teamTitleWrapper,
} from "./myTeam.css";
import PitchFormation from "./PitchFormation";
import PointsScoreboard from "./PointsScoreboard";

const EntryEvent = () => {
  const { firePageViewEvent } = useTrackingContext();
  const [activeView, setActiveView] = useState("pitch");
  const [pickForMenu, setPickForMenu] = useState<IPickLight | null>(null);

  const handleViewChange = (keys: Set<Key>) => {
    const view = Array.from(keys)[0] as string;
    setActiveView(view);
  };

  const dispatch = useDispatch<ThunkDispatch>();
  const params = useParams();

  const entryId = Number(params.entryId);
  const eventId = Number(params.eventId);

  const player = useSelector(
    (state: RootState) => getPlayerData(state) as IPlayer
  );
  const entry = useSelector((state: RootState) => getEntry(state, entryId));

  const event = useSelector(
    (state: RootState) => getEventsById(state)[eventId]
  );

  const elementsById = useSelector(getElementsById);
  const elementsDataById = useSelector((state: RootState) =>
    getElementsEventDataById(state, eventId)
  );

  const now = useSelector(getCurrentEvent);
  const nxt = useSelector(getNextEvent);
  const entryData = useSelector((state: RootState) =>
    getEntryEventPicks(state, entryId, eventId)
  );

  const formation = useSelector((state: RootState) =>
    getEntryEventFormation(state, entryId, eventId)
  );

  const settings = useSelector(
    (state: RootState) => getSettings(state) as ISettings
  );
  const mine = player?.entry === entryId;

  const handleShowMenuForPickElement = (element: number) => {
    const matches = entryData?.picks.filter((p) => p.element === element);
    if (matches?.length) {
      setPickForMenu(matches[0]);
    }
  };

  const handleClosePlayerSheet = () => {
    setPickForMenu(null);
  };

  const renderDreamTeam = (pick: IPickLight) =>
    elementsDataById && elementsDataById[pick.element]?.stats?.in_dreamteam ? (
      <ElementIconLink
        to={`/team-of-the-week/${eventId}`}
        label="Team of the week"
      >
        <DreamTeam className={dreamTeamIcon} aria-hidden />
      </ElementIconLink>
    ) : null;

  const fetchData = useCallback(() => {
    dispatch(fetchEntrySummary(entryId));
    dispatch(fetchEntryEventPicks(entryId, eventId));
    dispatch(fetchEventLive(eventId));
  }, [dispatch, entryId, eventId]);

  useEffect(() => {
    if (entryId) {
      fetchData();
    }
  }, [dispatch, fetchData, entryId]);

  useEffect(() => {
    firePageViewEvent(
      "fantasy points",
      activeView === "pitch" ? "pitch view" : "list view"
    );
  }, []);

  // Handle unknown and unstarted events
  if (!now || !event || eventId > now.id) {
    return <NotFound />;
  }

  if (!entry || !entryData) {
    return <Loading />;
  }

  const { name: entryName, started_event: startedEvent } = entry;

  const canNavigateToNextEvent = eventId < now.id && nxt;
  const canNavigateToMyTeam = mine && nxt && eventId === now.id;
  const canNavigateToPreviousEvent = eventId > startedEvent;

  const {
    active_chip: activeChip,
    picks,
    automatic_subs: automaticSubs,
  } = entryData;

  const { squad_squadplay: squadPlay, squad_squadsize: squadSize } = settings;
  const entryCrestData: EntryCrestData = {
    id: entry.id,
    name: entry.name,
    club_badge_src: entry.club_badge_src,
  };

  // We have to use the higher order component because DreamTeam season doesn't have an eventId
  const renderPickValue = (pick: IPickLight) => (
    <ValueForPlayedElement eventId={event.id} pick={pick} />
  );

  // Handle events before the entry started
  return (
    <>
      <LeaderboardAd slot="Leaderboard_Points" id="ism-points-ad" />

      <HelmetHead
        title="View Latest Gameweek Points | Fantasy Premier League"
        description="To view the latest Fantasy Premier League Gameweek points, visit the official website of the Premier League."
      />
      <div className={leftSidebarLayout}>
        <div className={entryEventMain}>
          <section>
            <SurfaceContainer>
              <div className={teamPitchWrap}>
                <div className={teamTitleWrapper}>
                  <div className={entryCrestStyles}>
                    <EntryCrest
                      entryCrestData={entryCrestData}
                      dimension={35}
                    />
                  </div>
                  <PageTitle title={entryName} />
                </div>
                <div className={eventHeaderWrapper}>
                  <div className={eventHeading}>
                    <h2>{event.name}</h2>
                  </div>
                  {(eventId > startedEvent || eventId < now.id) && (
                    <div className={eventPager}>
                      <PagerButton
                        url={
                          canNavigateToPreviousEvent
                            ? `/entry/${entryId}/event/${eventId - 1}`
                            : undefined
                        }
                        className={previousEvent}
                        direction="left"
                        isDisabled={!canNavigateToPreviousEvent}
                        label="Previous Gameweek"
                      />
                      {canNavigateToNextEvent ? (
                        <PagerButton
                          url={`/entry/${entryId}/event/${eventId + 1}`}
                          className={nextEvent}
                          direction="right"
                          label="Next Gameweek"
                        />
                      ) : canNavigateToMyTeam ? (
                        <PagerButton
                          url={`/my-team`}
                          className={nextEvent}
                          direction="right"
                          label="Pick Team"
                        />
                      ) : (
                        <>&nbsp;</>
                      )}
                    </div>
                  )}
                </div>
                <PointsScoreboard
                  entryData={entryData}
                  entryId={entryId}
                  eventId={eventId}
                  fetchData={fetchData}
                  event={event}
                />

                <div className={dreamTeamWrap}>
                  <Link
                    to={`/team-of-the-week/${eventId}`}
                    className={boldLink}
                  >
                    <DreamTeam width={16} height={16} />
                    <span>Team of the Week</span>
                    <ArrowRight width={16} height={16} />
                  </Link>
                </div>

                <div className={pitchViewToggle}>
                  <ToggleButtonGroup
                    selectedKeys={new Set([activeView])}
                    onSelectionChange={handleViewChange}
                  >
                    <ToggleButton id="pitch">Pitch View</ToggleButton>
                    <ToggleButton id="list">List View</ToggleButton>
                  </ToggleButtonGroup>
                </div>

                {activeView === "pitch" && (
                  <div className={edgeToEdge}>
                    <Pitch sponsor="default">
                      <PitchFormation
                        chipName={activeChip}
                        eventId={eventId}
                        formation={formation}
                        picks={picks}
                        renderDreamTeam={renderDreamTeam}
                        renderElementMenu={handleShowMenuForPickElement}
                        renderPickValue={renderPickValue}
                      />
                      <Bench variant={activeChip}>
                        {range(squadPlay, squadSize).map((e, i) => (
                          <BenchUnit
                            key={e}
                            chipName={activeChip}
                            eventId={eventId}
                            index={i}
                            pick={picks[e]}
                            renderDreamTeam={renderDreamTeam}
                            renderElementMenu={() =>
                              handleShowMenuForPickElement(picks[e].element)
                            }
                            renderPickValue={renderPickValue}
                          />
                        ))}
                      </Bench>
                    </Pitch>
                  </div>
                )}
                {activeView === "list" && (
                  <EntryEventTable
                    picks={picks}
                    renderElementMenu={handleShowMenuForPickElement}
                    chipName={activeChip}
                    dataById={elementsDataById}
                    elementsById={elementsById}
                    renderDreamTeam={renderDreamTeam}
                  />
                )}
                {pickForMenu && (
                  <ElementExplainSheet
                    elementId={pickForMenu.element}
                    eventId={eventId}
                    handleClose={handleClosePlayerSheet}
                    open={Boolean(pickForMenu.element)}
                  />
                )}
                {/* TEAM */}

                {automaticSubs.length > 0 && (
                  <div className={autoSubsWrapper}>
                    <h2>Automatic Substitutions</h2>
                    <Table aria-label="Automatic Substitutions">
                      <TableHeader>
                        <Column isRowHeader>Player out</Column>
                        <Column>Player in</Column>
                      </TableHeader>
                      <TableBody>
                        {automaticSubs.map((s) => (
                          <Row key={s.element_out}>
                            <Cell>{elementsById[s.element_out].web_name}</Cell>
                            <Cell>{elementsById[s.element_in].web_name}</Cell>
                          </Row>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </SurfaceContainer>
          </section>

          <section>
            <SurfaceContainer>
              <Fixtures eventId={eventId} />
            </SurfaceContainer>
          </section>
        </div>

        <section>
          <SurfaceContainer>
            <EntryInfo entryId={entryId} />
          </SurfaceContainer>
        </section>
      </div>
    </>
  );
};

export default EntryEvent;
