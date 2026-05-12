import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getActiveChip } from "core-integration/src/store/chips/reducers";
import { getElementsById } from "core-integration/src/store/elements/reducers";
import { IElement } from "core-integration/src/store/elements/types";
import { getSettings } from "core-integration/src/store/game/reducers";
import { resetLastChange } from "core-integration/src/store/squad/actions";
import {
  canAutocomplete,
  canReset,
  getErrors,
  getLastChange,
  getProposedElements,
  getSavedPicks,
  getSquadMode,
} from "core-integration/src/store/squad/reducers";
import { autoComplete, reset } from "core-integration/src/store/squad/thunks";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import Alert from "plos/src/components/alerts/Alert";
import DeadlineBar from "plos/src/components/DeadlineBar";
import SectionHeader from "plos/src/components/SectionHeader";
import { SquadPitch } from "plos/src/components/SquadPitch";
import { ToggleButton } from "plos/src/components/ToggleButton";
import { ToggleButtonGroup } from "plos/src/components/ToggleButtonGroup";
import { edgeToEdge } from "plos/src/styles";
import { useCallback, useEffect, useRef, useState } from "react";
import { Key } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { useTrackingContext } from "../../../contexts/TrackingContext";
import { PlayerPreviewSheet } from "../../PlayerSheets/PlayerPreviewSheet";
import { ConfirmTransfersSheet } from "../ConfirmTransfersSheet";
import { CreateSquadSheet } from "../CreateSquadSheet";
import { PlayerActions } from "../PlayerActions";
import SquadListTable from "../SquadListTable";
import TransfersListTable from "../TransfersListTable";
import { PlayerActionType } from "../types";
import { manageSquadWrap, pitchViewToggle } from "./manageSquad.css";
import SquadActionsBar from "./SquadActionsBar/SquadActionsBar";
import { ManageSquadProps } from "./types";

const ManageSquad = ({
  title,
  scoreboard,
  handleOpenElemListSheet,
  elementPosition,
  setElementPosition,
}: ManageSquadProps) => {
  const { firePageViewEvent } = useTrackingContext();
  const [activeView, setActiveView] = useState<string>("pitch");

  const handleViewChange = (keys: Set<Key>) => {
    const view = Array.from(keys)[0] as string;
    setActiveView(view);
  };

  const pitchUnitRefs = useRef<Record<number, HTMLDivElement | null>>({});

  // Callback to set refs for each position
  const setPitchUnitRef = useCallback(
    (position: number) => (element: HTMLDivElement | null) => {
      pitchUnitRefs.current[position] = element;
    },
    []
  );

  // Function to focus a specific position
  const focusPitchUnit = useCallback((position: number) => {
    const element = pitchUnitRefs.current[position];
    if (element) {
      element.focus();
    }
  }, []);

  const activeChip = useSelector(getActiveChip);
  const canUserAutocomplete = useSelector((state: RootState) =>
    canAutocomplete(state, undefined, activeChip?.id)
  );
  const canUserReset = useSelector(canReset);

  const elementsById = useSelector((state: RootState) =>
    getElementsById(state, undefined, activeChip?.id)
  );
  const errors = useSelector((state: RootState) =>
    getErrors(state, undefined, activeChip?.id)
  );
  const lastChange = useSelector(getLastChange);
  const mode = useSelector(getSquadMode);
  const proposedElements = useSelector((state: RootState) =>
    getProposedElements(state, undefined, activeChip?.id)
  );
  const savedPicks = useSelector(getSavedPicks);
  const settings = useSelector((state: RootState) =>
    getSettings(state, undefined, activeChip?.id)
  );
  const teamsById = useSelector(getTeamsById);

  const handleClosePlayerSheet = () => setElementPosition(0);

  let element: IElement | undefined;
  let actionMode: PlayerActionType | undefined;

  if (proposedElements[elementPosition]) {
    element = proposedElements[elementPosition];
    actionMode = "remove";
  } else if (savedPicks[elementPosition]) {
    element = elementsById[savedPicks[elementPosition].element];
    actionMode = "restore";
  }

  const dispatch = useDispatch<ThunkDispatch>();

  const autoPick = () => {
    if (!dispatch(autoComplete())) {
      // We should do something :-)
      window.console.log("Failed to autocomplete");
    }
  };

  const handleShowMenuForElement = (position: number) =>
    setElementPosition(position);

  const handleReset = () => dispatch(reset());

  useEffect(() => {
    dispatch(resetLastChange());
  }, [dispatch]);

  useEffect(() => {
    if (mode == "transfers") {
      firePageViewEvent(
        "fantasy transfers",
        activeView === "pitch" ? "pitch view" : "list view"
      );
    }
  }, []);

  let latestAction: React.ReactNode = null;
  if (lastChange.type === "addition") {
    latestAction = (
      <Alert isInline isCentered>
        <span role="status" aria-atomic="true">
          <strong>{elementsById[lastChange.element].web_name}</strong> has been
          added to your squad
        </span>
      </Alert>
    );
  } else if (lastChange.type === "removal") {
    latestAction = (
      <Alert isInline isCentered>
        <span role="status" aria-atomic="true">
          <strong>{elementsById[lastChange.element].web_name}</strong> has been
          removed from your squad
        </span>
      </Alert>
    );
  }

  const hasErrors = Boolean(Object.keys(errors).length);

  const showStatus = latestAction || errors.overTeamLimit;

  return (
    <>
      <div className={manageSquadWrap}>
        <SectionHeader
          title={title}
          description={`Select a maximum of ${
            settings?.squad_team_limit || 3
          } players from a single team or 'Auto Pick' if you are short of time.`}
        />
        <DeadlineBar />
        {scoreboard}
        <div role="status">
          {showStatus && (
            <>
              {latestAction && latestAction}
              {errors.overTeamLimit && (
                <Alert variant="error" isInline isCentered>
                  Too many players selected from{" "}
                  <strong>
                    {errors.overTeamLimit
                      .map((team) => teamsById[team].name)
                      .join(", ")}
                  </strong>
                </Alert>
              )}
            </>
          )}
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
            <SquadPitch
              renderElementMenu={handleShowMenuForElement}
              handleOpenElemListSheet={handleOpenElemListSheet}
              setPitchUnitRef={setPitchUnitRef}
            />
          </div>
        )}
        {activeView === "list" && (
          <>
            {mode === "selection" && (
              <SquadListTable
                handleOpenElemListSheet={handleOpenElemListSheet}
                proposedElements={proposedElements}
                handleElementClick={handleShowMenuForElement}
              />
            )}
            {mode === "transfers" && (
              <TransfersListTable
                handleOpenElemListSheet={handleOpenElemListSheet}
                proposedElements={proposedElements}
                handleElementClick={handleShowMenuForElement}
              />
            )}
          </>
        )}

        <SquadActionsBar
          handleAutoPick={autoPick}
          isAutoPickDisabled={!canUserAutocomplete}
          handleReset={handleReset}
          isResetDisabled={!canUserReset}
        >
          {mode === "selection" ? (
            <CreateSquadSheet isTriggerDisabled={hasErrors} />
          ) : mode === "transfers" ? (
            <ConfirmTransfersSheet isTriggerDisabled={hasErrors} />
          ) : null}
        </SquadActionsBar>
        {/* <ShirtSoonAlert /> */}
      </div>
      <PlayerPreviewSheet
        element={element}
        open={Boolean(element)}
        handleClose={handleClosePlayerSheet}
        actionButtons={({ handleViewFullProfile }) => {
          if (!element) return null;

          return (
            <PlayerActions
              actionMode={actionMode}
              handleViewFullProfile={handleViewFullProfile}
              element={element}
              position={elementPosition}
              handleClosePlayerSheet={handleClosePlayerSheet}
              handleOpenElemListSheet={handleOpenElemListSheet}
              focusPitchUnit={focusPitchUnit}
            />
          );
        }}
      />
    </>
  );
};

export default ManageSquad;
