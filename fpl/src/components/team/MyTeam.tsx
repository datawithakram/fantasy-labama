import { RootState, ThunkDispatch } from "core-integration/src/store";
import {
  getActiveChip,
  getActiveOrProposedTeamChipName,
  teamChipsHaveChanged,
} from "core-integration/src/store/chips/reducers";
import { getElementsById } from "core-integration/src/store/elements/reducers";
import { getEntry } from "core-integration/src/store/entries/reducers";
import {
  fetchEntrySummary,
  submitEntryImage,
} from "core-integration/src/store/entries/thunks";
import { IPickLight } from "core-integration/src/store/entries/types";
import {
  getCurrentEvent,
  getNextEvent,
} from "core-integration/src/store/events/reducers";
import { getSettings } from "core-integration/src/store/game/reducers";
import { ISettings } from "core-integration/src/store/game/types";
import {
  getMyFormation,
  getMyPicksLastUpdated,
  getMyPicksProposed,
  getMyTeamSavingState,
  hasMyTeamChanged,
  isMyTeamValid,
} from "core-integration/src/store/my-team/reducers";
import {
  fetchMyTeam,
  saveMyTeam,
} from "core-integration/src/store/my-team/thunks";
import { IPickProposed } from "core-integration/src/store/my-team/types";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import { getRegionsById } from "core-integration/src/store/regions/reducers";
import type { EntryCrestData } from "core-integration/src/store/ui";
import { setSuccessImgSrc } from "core-integration/src/store/ui/uiSlice";
import { range } from "lodash";
import { Alert } from "plos/src/components/alerts";
import { Button } from "plos/src/components/buttons/Button";
import DeadlineBar from "plos/src/components/DeadlineBar";
import ElementCardFixtures from "plos/src/components/ElementCard/ElementCardFixtures";
import { Fixtures } from "plos/src/components/Fixtures";
import PageTitle from "plos/src/components/PageTitle";
import Pitch from "plos/src/components/Pitch";
import PlayerInfoPanel from "plos/src/components/PlayerInfoPanel";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { dreamTeamIcon } from "plos/src/components/TeamPitchElement/teamPitchElement.css";
import { ToggleButton } from "plos/src/components/ToggleButton";
import { ToggleButtonGroup } from "plos/src/components/ToggleButtonGroup";
import { ElementIconLink } from "plos/src/components/tooltips/ElementIconLink";
import { leftSidebarLayout, squadMain } from "plos/src/layouts";
import { edgeToEdge } from "plos/src/styles/utils.css";
import { Key, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useAdobeContext } from "../../contexts/AdobeContext";
import { useSaveContext } from "../../contexts/SaveContext";
import { useTrackingContext } from "../../contexts/TrackingContext";
import DreamTeam from "../../img/icons/dreamteam.svg?react";
import { getChipName } from "../../utils/chips";
import ChipList from "../Chips/ChipList";
import { ClubTeamNews } from "../ClubTeamNews";
import { EntryCrest } from "../crests/EntryCrest";
import InitialCrestSheet from "../crestSheets/InitialCrestSheet";
import EntryInfo from "../EntryInfo";
import { HelmetHead } from "../HelmetHead";
import LatestAlert from "../LatestAlert";
import { LeaderboardAd } from "../LeaderboardAd";
import { PlayerPreviewSheet } from "../PlayerSheets/PlayerPreviewSheet";
import { pitchViewToggle } from "../squad/ManageSquad/manageSquad.css";
import { Bench, BenchUnit } from "./Bench";
import { playerInfoWrap, saveBar, teamPitchWrap } from "./myTeam.css";
import { MyTeamPlayerActions } from "./MyTeamPlayerActions";
import MyTeamTable from "./MyTeamTable";
import PitchFormation from "./PitchFormation";
import { TeamSavedModal, TeamSavedPromotion } from "./TeamSavedModal";

const renderPickValue =
  (initProps: { nextEventId?: number }) => (pick: IPickLight) => {
    return (
      <ElementCardFixtures
        eventId={initProps.nextEventId}
        elementId={pick.element}
      />
    );
  };

const MyTeam = () => {
  const { fireClickTrackEvent, firePageViewEvent } = useTrackingContext();
  const [activeView, setActiveView] = useState<string>("pitch");
  const [pickForMenu, setPickForMenu] = useState<IPickProposed | null>(null);
  const [saveModal, setSaveModal] = useState<TeamSavedPromotion>("default");

  const handleViewChange = (keys: Set<Key>) => {
    const view = Array.from(keys)[0] as string;
    setActiveView(view);
  };

  const player = useSelector(getPlayerData) as ILoggedInPlayer; // enforced by EntryRoute
  const activeChip = useSelector(getActiveChip);
  const chipInPlayName = useSelector(getActiveOrProposedTeamChipName);
  const changed = useSelector(hasMyTeamChanged);
  const chipsChanged = useSelector(teamChipsHaveChanged);
  const currentEvent = useSelector(getCurrentEvent);
  const elementsById = useSelector((state: RootState) =>
    getElementsById(state, undefined, activeChip?.id)
  );
  const entry = useSelector((state: RootState) =>
    getEntry(state, player.entry)
  );
  const regionsById = useSelector(getRegionsById);
  const region = player.region ? regionsById[player.region] : undefined;
  const formation = useSelector((state: RootState) =>
    getMyFormation(state, undefined, activeChip?.id)
  );
  const nextEvent = useSelector(getNextEvent);
  const picks = useSelector(getMyPicksProposed);
  const picksLastUpdated = useSelector(getMyPicksLastUpdated);
  const savingState = useSelector(getMyTeamSavingState);
  const settings = useSelector(
    (state: RootState) =>
      getSettings(state, undefined, activeChip?.id) as ISettings
  );
  const valid = useSelector(isMyTeamValid);

  const dispatch = useDispatch<ThunkDispatch>();
  const navigate = useNavigate();

  const { setSaveState, saveState } = useSaveContext();
  const save = () => {
    dispatch(saveMyTeam());
    fireClickTrackEvent(
      {
        event_category: "fantasy team",
        event_component: "fantasy classic clicks",
        event_type: "save team",
      },
      "fantasy pick team",
      activeView === "pitch" ? "pitch view" : "list view"
    );
  };

  useEffect(() => {
    firePageViewEvent(
      "fantasy pick team",
      activeView === "pitch" ? "pitch view" : "list view"
    );
  }, []);

  useEffect(() => {
    // No more changes to be made, shouldn't be here ...
    if (!nextEvent) {
      setTimeout(() => navigate("/", { replace: true }), 0);
    }
    dispatch(fetchMyTeam());
    dispatch(fetchEntrySummary(player.entry));
  }, [dispatch, navigate, nextEvent, player.entry]);

  const { enabled } = useAdobeContext();

  const handleCreateCrest = async (img: Blob, prompt: string) => {
    await dispatch(submitEntryImage(entry.id, img, prompt));
    dispatch(setSuccessImgSrc(img));
    setSaveState(null);
  };

  const handleHideSaveModal = () => {
    setSaveState(null);
  };

  const renderDreamTeam = (pick: IPickLight) =>
    elementsById[pick.element].in_dreamteam ? (
      <ElementIconLink to="/team-of-the-week/" label="Dream Team">
        <DreamTeam className={dreamTeamIcon} aria-hidden />
      </ElementIconLink>
    ) : null;

  const handleSave = () => {
    save();

    if (!currentEvent) {
      // If the game hasn't started yet
      setSaveState("initial");
      return;
    }

    // On first save of the week, if the entry already has an adobe badge we show the default modal
    if (
      picksLastUpdated &&
      new Date(picksLastUpdated) <= new Date(currentEvent.deadline_time)
    ) {
      setSaveState("gameweekFirst");
      setSaveModal(entry.club_badge_src ? "default" : "adobe");
    }
  };

  const element = pickForMenu ? elementsById[pickForMenu.element] : undefined;

  const handleElementCardClick = (element: number) => {
    const matches = picks.filter((p) => p.element === element);
    if (matches.length) {
      setPickForMenu(matches[0]);
    }
    fireClickTrackEvent(
      {
        event_category: "fantasy player",
        event_component: "fantasy classic clicks",
        event_detail: "click icon",
        event_type: "click player",
        modal_name: "",
        player_id: elementsById[element].code,
        team_id: elementsById[element].team_code,
      },
      "fantasy pick team",
      activeView === "pitch" ? "pitch view" : "list view"
    );
  };

  const handleElementListItemClick = (pick: IPickProposed) => {
    setPickForMenu(pick);
  };
  const handleClosePlayerSheet = () => {
    setPickForMenu(null);
  };

  if (!entry || !picks.length) {
    return null;
  }

  // Create a new function on each render as fixtures could have changed and
  // need to ensure a render of connected subcomponents
  const _renderPickValue = renderPickValue({
    nextEventId: nextEvent?.id,
  });
  const entryCrestData: EntryCrestData = {
    id: entry.id,
    name: entry.name,
    club_badge_src: entry.club_badge_src,
  };

  const getBenchPickIndexes = () =>
    range(settings.squad_squadplay, settings.squad_squadsize);

  return (
    <>
      <HelmetHead
        title="Pick Your Fantasy Football Team | Fantasy Premier League"
        description="To pick your Fantasy Premier League team and consider using one of your chips before the next Gameweek deadline, visit the official website of the Premier League."
      />
      <LeaderboardAd slot="Landscape_Top" id="ism-pick-ad" />
      <div className={leftSidebarLayout}>
        <div className={squadMain}>
          <section>
            <SurfaceContainer>
              <div className={teamPitchWrap}>
                <LatestAlert />
                <PageTitle title="Pick Team" />
                {nextEvent && (
                  <>
                    <DeadlineBar />
                  </>
                )}
                <div className={playerInfoWrap}>
                  <EntryCrest entryCrestData={entryCrestData} dimension={35} />
                  <PlayerInfoPanel
                    entry={entry}
                    player={player}
                    region={region}
                  />
                </div>
                <ChipList chipsShown="all" />
                <Alert isInline={true} isCentered>
                  To change your captain use the menu which appears when
                  clicking on a player
                </Alert>

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
                        chipName={chipInPlayName}
                        eventId={nextEvent?.id}
                        formation={formation}
                        picks={picks}
                        renderDreamTeam={renderDreamTeam}
                        renderElementMenu={handleElementCardClick}
                        renderPickValue={_renderPickValue}
                      />

                      <Bench variant={activeChip?.name}>
                        {getBenchPickIndexes().map(
                          (e, i) =>
                            picks[e] && (
                              <BenchUnit
                                key={e}
                                index={i}
                                pick={picks[e]}
                                renderElementMenu={() =>
                                  handleElementCardClick(picks[e].element)
                                }
                                renderDreamTeam={renderDreamTeam}
                                renderPickValue={_renderPickValue}
                              />
                            )
                        )}
                      </Bench>
                    </Pitch>
                  </div>
                )}
                {activeView === "list" && (
                  <MyTeamTable
                    picks={picks}
                    chipInPlayName={chipInPlayName}
                    elementsById={elementsById}
                    handleElementClick={handleElementListItemClick}
                    renderDreamTeam={renderDreamTeam}
                  />
                )}

                {activeChip && activeChip.chip_type === "transfer" && (
                  <Alert isContentCentered>
                    {getChipName(activeChip.name)} Active
                  </Alert>
                )}
                {savingState === "saved" ? (
                  <Alert isContentCentered>Your team has been saved.</Alert>
                ) : (
                  <div className={saveBar}>
                    <Button
                      onPress={handleSave}
                      isDisabled={
                        (!changed && !chipsChanged) ||
                        !valid ||
                        savingState === "saving"
                      }
                      fullWidth
                    >
                      Save Your Team
                    </Button>
                  </div>
                )}
                {/* <ShirtSoonAlert /> */}
                <TeamSavedModal
                  isOpen={saveState === "gameweekFirst"}
                  closeDialog={handleHideSaveModal}
                  currentPromotion={saveModal}
                  handleCreateCrest={handleCreateCrest}
                />
              </div>
            </SurfaceContainer>
          </section>

          <ClubTeamNews />

          {nextEvent && (
            <section>
              <SurfaceContainer>
                <Fixtures eventId={nextEvent.id} />
              </SurfaceContainer>
            </section>
          )}
          {enabled && (
            <>
              {/* Initial sheet shown when first entering the game after entering a team */}
              <InitialCrestSheet
                handleCreateCrest={handleCreateCrest}
                open={saveState === "initial"}
                handleClose={() => setSaveState(null)}
              />
            </>
          )}
        </div>

        <section>
          <SurfaceContainer>
            <EntryInfo entryId={entry.id} />
          </SurfaceContainer>
        </section>
      </div>
      <PlayerPreviewSheet
        element={element}
        open={Boolean(element)}
        handleClose={handleClosePlayerSheet}
        actionButtons={({ handleViewFullProfile }) => {
          if (!pickForMenu) return;
          return (
            <MyTeamPlayerActions
              handleViewFullProfile={handleViewFullProfile}
              pick={pickForMenu}
              handleClosePlayerSheet={handleClosePlayerSheet}
            />
          );
        }}
      />
    </>
  );
};

export default MyTeam;
