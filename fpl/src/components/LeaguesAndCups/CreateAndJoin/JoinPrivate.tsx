import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { getSettings } from "core-integration/src/store/game/reducers";
import {
  getJoinPrivateLeagueError,
  getJoinPrivateLeagueSuccess,
} from "core-integration/src/store/leagues/reducers";
import { joinPrivateLeague } from "core-integration/src/store/leagues/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import { ErrorAlert } from "plos/src/components/alerts";
import { Button } from "plos/src/components/buttons/Button";
import { FormTextField } from "plos/src/components/Forms";
import SectionHeader from "plos/src/components/SectionHeader";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { rightSidebarLayout } from "plos/src/layouts";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTrackingContext } from "../../../contexts/TrackingContext";
import { formatErrorMsg, getErrorType } from "../../leagues/errors";
import HelmetHeadLeagues from "../../leagues/HelmetHeadLeagues";
import {
  formItem,
  leagueGridLayout,
  leaguesMainContent,
} from "../leaguesAndCups.css";

const JoinPrivate = () => {
  const [code, setCode] = useState("");
  const { fireClickTrackEvent, firePageViewEvent } = useTrackingContext();
  const dispatch = useDispatch<ThunkDispatch>();
  const navigate = useNavigate();

  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  ); // enforced by EntryRoute
  const playerEntry = player.entry;
  const entry = useSelector((state: RootState) => getEntry(state, playerEntry));
  const error = useSelector(getJoinPrivateLeagueError);
  const settings = useSelector(getSettings);
  const hasJoinedPrivate = useSelector(getJoinPrivateLeagueSuccess);

  useEffect(() => {
    firePageViewEvent("fantasy leagues & cups", "join private league");
  }, []);

  useEffect(() => {
    if (hasJoinedPrivate) {
      navigate("/leagues");
    }
  }, [hasJoinedPrivate, navigate]);

  const handleCodeChange = (val: string) => {
    setCode(val);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(joinPrivateLeague({ code }));
    fireClickTrackEvent(
      {
        event_category: "fantasy league",
        event_component: "fantasy classic clicks",
        event_detail: "join invitational cta",
        event_type: "join invitational league / cup",
      },
      "fantasy join private league"
    );
  };

  const disabled = !code;
  const errorType = getErrorType(error);

  if (!entry) {
    return null;
  }

  return (
    <>
      <HelmetHeadLeagues />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <div className={leaguesMainContent}>
            {errorType && settings && (
              <ErrorAlert>{formatErrorMsg(errorType, settings)}</ErrorAlert>
            )}
            <SectionHeader title="Join an Invitational League & Cup" />
            <form onSubmit={handleSubmit}>
              <div className={leagueGridLayout}>
                <div className={formItem}>
                  <FormTextField
                    label="League Code"
                    onChange={handleCodeChange}
                    value={code}
                    placeholder="Enter league code"
                    maxLength={20}
                  />
                </div>
                <div className={formItem}>
                  <Button type="submit" isDisabled={disabled}>
                    Join League
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </SurfaceContainer>
      </div>
    </>
  );
};

export default JoinPrivate;
