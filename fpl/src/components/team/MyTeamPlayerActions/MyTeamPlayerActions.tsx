import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getActiveChip } from "core-integration/src/store/chips/reducers";
import { getSettings } from "core-integration/src/store/game/reducers";
import { ISettings } from "core-integration/src/store/game/types";
import {
  changeCaptain,
  changeViceCaptain,
} from "core-integration/src/store/my-team/actions";
import { actionSubstitution } from "core-integration/src/store/my-team/thunks";
import { IPickProposed } from "core-integration/src/store/my-team/types";
import { Checkbox } from "plos/src/components/Forms/Checkbox";
import { Button } from "plos/src/components/buttons/Button";
import { useDispatch, useSelector } from "react-redux";
import { actionsGridWrapper, checkBoxItem } from "./myTeamPlayerActions.css";

interface MyTeamPlayerActionsProps {
  handleViewFullProfile: () => void;
  handleClosePlayerSheet: () => void;
  pick: IPickProposed;
}

const MyTeamPlayerActions = ({
  pick,
  handleViewFullProfile,
  handleClosePlayerSheet,
}: MyTeamPlayerActionsProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const activeChip = useSelector(getActiveChip);
  const settings = useSelector(
    (state: RootState) =>
      getSettings(state, undefined, activeChip?.id) as ISettings
  );

  const {
    is_captain: isCaptain,
    is_vice_captain: isViceCaptain,
    subStatus: status,
    position,
    element,
  } = pick;

  const substitute = (elementId: number) => {
    handleClosePlayerSheet();
    dispatch(actionSubstitution(elementId));
  };
  const makeCaptain = (elementId: number) => {
    if (isCaptain) return;
    handleClosePlayerSheet();
    dispatch(changeCaptain(elementId));
  };
  const makeViceCaptain = (elementId: number) => {
    if (isViceCaptain) return;
    handleClosePlayerSheet();
    dispatch(changeViceCaptain(elementId));
  };

  const isTarget = status.match(/^(target|)$/);
  const isInstigator = status === "instigator";

  const startMax = settings.squad_squadplay;

  return (
    <div className={actionsGridWrapper}>
      {!status && position <= startMax && (
        <>
          <div className={checkBoxItem}>
            <Checkbox
              isSelected={isCaptain}
              onChange={() => {
                makeCaptain(element);
              }}
            >
              Captain
            </Checkbox>
          </div>
          <div className={checkBoxItem}>
            <Checkbox
              isSelected={isViceCaptain}
              onChange={() => makeViceCaptain(element)}
            >
              Vice Captain
            </Checkbox>
          </div>
        </>
      )}
      <Button onPress={handleViewFullProfile} size="small">
        Full Profile
      </Button>
      {isTarget && (
        <Button onPress={() => substitute(element)} size="small">
          Substitute
        </Button>
      )}
      {isInstigator && (
        <Button onPress={() => substitute(element)} size="small">
          Cancel
        </Button>
      )}
    </div>
  );
};

export default MyTeamPlayerActions;
