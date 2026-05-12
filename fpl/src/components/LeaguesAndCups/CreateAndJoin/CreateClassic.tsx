import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { getEvents } from "core-integration/src/store/events/reducers";
import { getSettings } from "core-integration/src/store/game/reducers";
import { getCreateClassicLeagueError } from "core-integration/src/store/leagues/reducers";
import { createClassicLeague } from "core-integration/src/store/leagues/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import { ErrorAlert } from "plos/src/components/alerts/Alert";
import { Button } from "plos/src/components/buttons/Button";
import { FormSelect, FormTextField } from "plos/src/components/Forms";
import HorizontalDivider from "plos/src/components/HorizontalDivider";
import SectionHeader from "plos/src/components/SectionHeader";
import { Sheet } from "plos/src/components/Sheet";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { rightSidebarLayout } from "plos/src/layouts";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTrackingContext } from "../../../contexts/TrackingContext";
import HelmetHeadLeagues from "../../leagues/HelmetHeadLeagues";
import {
  cupExplainButton,
  cupExplainList,
  explainSheetStyles,
  formElementWrapper,
  gridDivider,
  leagueGridLayout,
  leaguesMainContent,
} from "../leaguesAndCups.css";

const CreateClassic = () => {
  const [name, setName] = useState("");
  const [startEvent, setStartEvent] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [explainSheetOpen, setExplainSheetOpen] = useState(false);

  const { fireClickTrackEvent, firePageViewEvent } = useTrackingContext();

  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  ); // enforced by EntryRoute
  const playerEntry = player.entry;
  const entry = useSelector((state: RootState) => getEntry(state, playerEntry));

  const error = useSelector(getCreateClassicLeagueError);
  const events = useSelector(getEvents);
  const settings = useSelector(getSettings);

  const dispatch = useDispatch<ThunkDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    firePageViewEvent("fantasy leagues & cups", "create league classic");
  }, []);

  const handleNameChange = (val: string) => {
    setName(val);
  };

  const handleStartEventChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setStartEvent(parseInt(e.currentTarget.value, 10));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await dispatch(
      createClassicLeague({
        name,
        has_cup: true,
        start_event: startEvent,
      })
    );
    fireClickTrackEvent(
      {
        event_category: "fantasy league",
        event_component: "fantasy classic clicks",
        event_detail: "create classic cta",
        event_type: "create league / cup",
      },
      "fantasy create classic league"
    );
    navigate("/leagues");
  };

  const disabled = !name || !startEvent || isSubmitting;

  const nonFieldError = error?.badRequest?.non_field_errors?.[0];
  const errorMessage =
    nonFieldError?.code === "max_private_entries"
      ? `You may only enter ${settings?.league_join_private_max} invitational leagues`
      : JSON.stringify(error);

  if (!entry) {
    return null;
  }

  return (
    <>
      <HelmetHeadLeagues />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <div className={leaguesMainContent}>
            {nonFieldError && <ErrorAlert>{errorMessage}</ErrorAlert>}
            <SectionHeader title="Create an Invitational League" />
            <form onSubmit={handleSubmit}>
              <div className={leagueGridLayout}>
                <div className={formElementWrapper}>
                  <FormTextField
                    label="League Name"
                    description="Maximum 30 characters"
                    value={name}
                    onChange={(val) => handleNameChange(val)}
                    placeholder="Enter Name Here"
                    maxLength={30}
                  />
                  <p>
                    Please think carefully before entering your league name.
                    Leagues with names that are deemed inappropriate or
                    offensive may result in your account being deleted. Please
                    refer to the Terms & Conditions of entry for more
                    information.
                  </p>
                </div>

                <div className={gridDivider}>
                  <HorizontalDivider />
                </div>

                <div className={formElementWrapper}>
                  <FormSelect
                    id="scoring-starts"
                    label="Scoring starts"
                    value={startEvent}
                    onChange={handleStartEventChange}
                  >
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </FormSelect>
                  <p>
                    In a league with classic scoring, teams are ranked based on
                    their total points in the game. You can join or league a
                    league with classic scoring at any point during the season.
                  </p>
                </div>

                <div className={gridDivider}>
                  <HorizontalDivider />
                </div>

                <div>
                  <p>
                    A League Cup will also be created for those who join your
                    Invitational Classic Leagues. The League Cups will start in
                    the second half of the season dependent on the size of your
                    league and will conclude in Gameweek 38.
                  </p>
                  <Button
                    className={cupExplainButton}
                    onPress={() => setExplainSheetOpen(true)}
                  >
                    How does the Cup work?
                  </Button>
                  <Button type="submit" isDisabled={disabled}>
                    {isSubmitting ? "Please wait..." : "Create League"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </SurfaceContainer>
      </div>
      <Sheet
        title="How does the Cup work?"
        open={explainSheetOpen}
        handleClose={() => setExplainSheetOpen(false)}
      >
        <div className={explainSheetStyles}>
          <p>
            Each qualifying team will be randomly drawn against another in the
            first round. The winner (the team with the highest Gameweek score
            minus any transfer points), will progress to the second round and
            another random draw, the losers are out! This process continues
            until the final round when the two remaining teams contest the cup
            final.
          </p>
          <p>
            If a cup match is drawn, then the following tie-breaks will be
            applied until a winner is found:
          </p>
          <ol className={cupExplainList}>
            <li>Most goals scored in the Gameweek</li>
            <li>Fewest goals conceded in the Gameweek</li>
            <li>Virtual coin toss</li>
          </ol>
        </div>
      </Sheet>
    </>
  );
};

export default CreateClassic;
