import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getSettings } from "core-integration/src/store/game/reducers";
import {
  getActiveEntryInLeague,
  getAutoJoinCode,
  getJoinPrivateLeagueError,
  getJoinPrivateLeagueSuccess,
  getLeagueFromCode,
} from "core-integration/src/store/leagues/reducers";
import {
  checkLeagueCode,
  clearCode,
  joinPrivateLeague,
} from "core-integration/src/store/leagues/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { ErrorAlert } from "plos/src/components/alerts/Alert";
import { Button } from "plos/src/components/buttons/Button";
import Dialog from "plos/src/components/Dialog";
import { formatErrorMsg, getErrorType } from "../errors";
import Subheading from "plos/src/components/Subheading";
import {
  dialogButtonWrapper,
  dialogContentWrapper,
} from "./autoJoinDialog.css";

const AutoJoinDialog = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const navigate = useNavigate();

  const code = useSelector(getAutoJoinCode);
  const player = useSelector(getPlayerData);
  const error = useSelector((state: RootState) =>
    getErrorType(getJoinPrivateLeagueError(state))
  );
  const settings = useSelector(getSettings);
  const joinedPrivateLeagueSuccess = useSelector(getJoinPrivateLeagueSuccess);

  // Most important part, if it returns null, nothing renders
  const league = useSelector((state: RootState) =>
    code ? getLeagueFromCode(state, code) : null
  );

  // Check if entry is already apart of the league
  const isPlayerInLeague = useSelector((state: RootState) =>
    league
      ? getActiveEntryInLeague(
          state,
          league.id,
          league.scoring === "c" ? "classic" : "h2h"
        )
      : null
  );

  // If we have a code, try and fetch the associated league. If there is an
  // issue fetching the league clear the code from local storage so we don't
  // try again
  useEffect(() => {
    // If you're logged in check the code
    // You might be logged out and we don't want a 403 forbidden
    if (player && player.entry && code) {
      dispatch(checkLeagueCode(code));
    }
  }, [player, code, dispatch]);

  const handleHide = () => {
    dispatch(clearCode());
  };

  const confirmJoinLeague = (code: string) => {
    dispatch(joinPrivateLeague({ code }));
  };

  if (joinedPrivateLeagueSuccess && code && league) {
    handleHide();
    navigate(`/leagues/${league.id}/standings/${league.scoring}`);
    return null;
  }

  if (!league) return null;

  return (
    <Dialog isOpen={Boolean(league)} handleClose={handleHide}>
      <Subheading>Join League{league && `: ${league.name}`}</Subheading>
      <div className={dialogContentWrapper}>
        {isPlayerInLeague ? (
          <ErrorAlert>You are already in this league</ErrorAlert>
        ) : (
          <>
            {error ? (
              <ErrorAlert>
                {settings && formatErrorMsg(error, settings)}
              </ErrorAlert>
            ) : (
              <>
                <p>Please press confirm to join league: {league.name}.</p>
                <div className={dialogButtonWrapper}>
                  {code && (
                    <Button onPress={() => confirmJoinLeague(code)} fullWidth>
                      Confirm
                    </Button>
                  )}
                  <Button
                    onPress={handleHide}
                    styleVariant="outlined"
                    fullWidth
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Dialog>
  );
};

export default AutoJoinDialog;
