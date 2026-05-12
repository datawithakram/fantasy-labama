import { RootState, ThunkDispatch } from "core-integration/src/store";
import {
  dreamTeamAsPickLight,
  getEventDreamTeam,
  getEventDreamTeamFormation,
  getOverallDreamTeam,
  getOverallDreamTeamFormation,
} from "core-integration/src/store/dream-teams/reducers";
import {
  fetchEventDreamTeam,
  fetchOverallDreamTeam,
} from "core-integration/src/store/dream-teams/thunks";
import {
  getElementsById,
  getElementsEventDataById,
} from "core-integration/src/store/elements/reducers";
import {
  fetchEventLive,
  showElementSummary,
} from "core-integration/src/store/elements/thunks";
import { IPickLight } from "core-integration/src/store/entries/types";
import {
  getCurrentEvent,
  getEventsById,
} from "core-integration/src/store/events/reducers";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { PagerButton } from "plos/src/components/buttons/PagerButton";
import ElementDetailsBar from "plos/src/components/ElementCard/ElementDetailsBar";
import ValueForPlayedElement from "plos/src/components/ElementCard/ValueForPlayedElement";
import { Fixtures } from "plos/src/components/Fixtures";
import PageTitle from "plos/src/components/PageTitle";
import Pitch from "plos/src/components/Pitch";
import Subheading from "plos/src/components/Subheading";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { ToggleButton } from "plos/src/components/ToggleButton";
import { ToggleButtonGroup } from "plos/src/components/ToggleButtonGroup";
import { entryEventMain, leftSidebarLayout } from "plos/src/layouts";
import { edgeToEdge } from "plos/src/styles";
import { Key, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { isBlankWeek } from "../../../utils/events";
import EntryInfo from "../../EntryInfo";
import { HelmetHead } from "../../HelmetHead";
import { NotFound } from "../../Routes";
import { pitchViewToggle } from "../../squad/ManageSquad/manageSquad.css";
import ElementExplainSheet from "../ElementExplainSheet";
import EntryEventTable from "../EntryEventTable";
import {
  eventHeaderWrapper,
  eventHeading,
  eventPager,
  teamPitchWrap,
} from "../myTeam.css";
import PitchFormation from "../PitchFormation";
import { overallWrapper } from "./dreamTeam.css";
import DreamTeamHeader from "./DreamTeamScoreboard";

const DreamTeam = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const { eventId = 0 } = useParams();
  const eventIdNumber = Number(eventId);

  const player = useSelector(getPlayerData);
  const entryId = player?.entry;

  const [elementForMenu, setElementForMenu] = useState(0);
  const [activeView, setActiveView] = useState("pitch");

  const handleViewChange = (keys: Set<Key>) => {
    const view = Array.from(keys)[0] as string;
    setActiveView(view);
  };

  const data = useSelector((state: RootState) =>
    eventIdNumber
      ? getEventDreamTeam(state, eventIdNumber)
      : getOverallDreamTeam(state)
  );
  const elementsById = useSelector(getElementsById);
  const elementsDataById = useSelector((state: RootState) =>
    getElementsEventDataById(state, eventIdNumber)
  );

  const event = useSelector(
    (state: RootState) => getEventsById(state)[eventIdNumber]
  );
  const formation = useSelector((state: RootState) =>
    eventIdNumber
      ? getEventDreamTeamFormation(state, eventIdNumber)
      : getOverallDreamTeamFormation(state)
  );
  const now = useSelector(getCurrentEvent);

  const handleShowMenuForElement = (element: number) => {
    setElementForMenu(element);
  };

  const handleClosePlayerSheet = () => {
    setElementForMenu(0);
  };

  useEffect(() => {
    const fetchData = () => {
      if (event) {
        dispatch(fetchEventDreamTeam(event.id));
        dispatch(fetchEventLive(event.id));
      } else {
        dispatch(fetchOverallDreamTeam());
      }
    };
    fetchData();
  }, [dispatch, event]);

  const showElementDialog = useCallback(
    (elementId: number) => dispatch(showElementSummary(elementId)),
    [dispatch]
  );

  useEffect(() => {
    // For the overall team we just show the standard element dialog as there
    // is no explain
    if (elementForMenu && !event) {
      showElementDialog(elementForMenu);
    }
  }, [dispatch, elementForMenu, event, showElementDialog]);

  if (!now) {
    return <NotFound />;
  }
  if (!data) {
    return null;
  }
  const picks = dreamTeamAsPickLight(data.team);

  // Create a new function on each render as data could have changed and
  // need to ensure a render of connected subcomponents
  const renderPickValue = event
    ? (pick: IPickLight) => (
        <ValueForPlayedElement eventId={event.id} pick={pick} />
      )
    : // TODO Come back to this and give it its own component
      // If there is no event, it could be because there is no eventId or it could be because it's the overall team
      (pick: IPickLight) => {
        const elementData = data.team.filter((e) => e.element === pick.element);
        return elementData.length ? (
          <ElementDetailsBar>{elementData[0].points}</ElementDetailsBar>
        ) : null;
      };

  return (
    <>
      <HelmetHead
        title={`Team of the ${
          event ? `Week - Gameweek ${event.id}` : "Season 2025/26"
        } | Fantasy Premier League`}
        description={`To view the Fantasy Premier League Team of ${
          event ? `Gameweek ${event.id}` : "the Season 2025/26"
        }, visit the official website of the Premier League.`}
      />
      <div className={leftSidebarLayout}>
        <div className={entryEventMain}>
          <section>
            <SurfaceContainer>
              <div className={teamPitchWrap}>
                <PageTitle title={`Team of the ${event ? "Week" : "Season"}`} />
                {event ? (
                  <div className={eventHeaderWrapper}>
                    <div className={eventHeading}>
                      <h2>{event.name}</h2>
                    </div>
                    {(event.id > 1 || event.id < now.id) && (
                      <div className={eventPager}>
                        <PagerButton
                          url={`/team-of-the-week/${event.id - 1}`}
                          direction="left"
                          isDisabled={event.id <= 1}
                          label="Previous gameweek"
                        />
                        <PagerButton
                          url={`/team-of-the-week/${event.id + 1}`}
                          direction="right"
                          isDisabled={event.id >= now.id}
                          label="Next gameweek"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className={overallWrapper}>
                    <Subheading>Overall</Subheading>
                  </div>
                )}

                {(!event || !isBlankWeek(event.id)) && (
                  <>
                    <DreamTeamHeader event={event} data={data} now={now} />
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
                            chipName={""}
                            eventId={event?.id}
                            formation={formation}
                            picks={picks}
                            renderDreamTeam={() => null}
                            renderElementMenu={handleShowMenuForElement}
                            renderPickValue={renderPickValue}
                          />
                        </Pitch>
                      </div>
                    )}
                    {activeView === "list" && (
                      <EntryEventTable
                        picks={picks}
                        elementsById={elementsById}
                        renderElementMenu={handleShowMenuForElement}
                        dataById={elementsDataById}
                        chipName={null}
                      />
                    )}
                  </>
                )}

                {event && elementForMenu ? (
                  <ElementExplainSheet
                    elementId={elementForMenu}
                    eventId={event.id}
                    handleClose={handleClosePlayerSheet}
                    open={Boolean(elementForMenu)}
                  />
                ) : null}
              </div>
            </SurfaceContainer>
          </section>
          <section>
            <SurfaceContainer>
              <Fixtures eventId={eventIdNumber} />
            </SurfaceContainer>
          </section>
        </div>

        {entryId && (
          <section>
            <SurfaceContainer>
              <EntryInfo entryId={entryId} />
            </SurfaceContainer>
          </section>
        )}
      </div>
    </>
  );
};

export default DreamTeam;
