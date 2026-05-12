import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { getFutureEvents } from "core-integration/src/store/events/reducers";
import { getSettings } from "core-integration/src/store/game/reducers";
import { ISettings } from "core-integration/src/store/game/types";
import { getCreateH2HLeagueError } from "core-integration/src/store/leagues/reducers";
import { createH2HLeague } from "core-integration/src/store/leagues/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import range from "lodash/range";
import { ErrorAlert } from "plos/src/components/alerts";
import { Button } from "plos/src/components/buttons/Button";
import { FormSelect, FormTextField } from "plos/src/components/Forms";
import HorizontalDivider from "plos/src/components/HorizontalDivider";
import SectionHeader from "plos/src/components/SectionHeader";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { rightSidebarLayout } from "plos/src/layouts";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useTrackingContext } from "../../../contexts/TrackingContext";
import HelmetHeadLeagues from "../../leagues/HelmetHeadLeagues";
import {
  formElementWrapper,
  formItem,
  gridDivider,
  leagueGridLayout,
  leaguesMainContent,
} from "../leaguesAndCups.css";

const CreateH2H = () => {
  const navigate = useNavigate();
  const { fireClickTrackEvent, firePageViewEvent } = useTrackingContext();
  const dispatch = useDispatch<ThunkDispatch>();

  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  ); // enforced by EntryRoute
  const playerEntry = player.entry;
  const entry = useSelector((state: RootState) => getEntry(state, playerEntry));

  const events = useSelector(getFutureEvents);
  const settings = useSelector(
    (state: RootState) => getSettings(state) as ISettings
  );
  const error = useSelector(getCreateH2HLeagueError);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [koRounds, setKoRounds] = useState(0);
  const [maxEntries, setMaxEntries] = useState(0);
  const [startEvent, setStartEvent] = useState(
    events.length ? events[0].id : 1
  );

  const handleSetName = (val: string) => {
    setName(val);
  };
  const handleSetStartEvent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStartEvent(parseInt(e.currentTarget.value, 10));
  };
  const handleSetMaxEntries = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxEntries(parseInt(e.currentTarget.value, 10));
  };
  const handleSetKoRounds = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setKoRounds(parseInt(e.currentTarget.value, 10));
  };

  const noEvents = !events.length;

  useEffect(() => {
    firePageViewEvent("fantasy leagues & cups", "create league head to head");
  }, []);

  useEffect(() => {
    if (noEvents) {
      navigate("/", { replace: true });
    }
  }, [noEvents, navigate]);

  const maximumKoRounds = () => {
    const remainingEvents = events.length;
    if (remainingEvents <= 1) {
      return 0;
    }
    return Math.min(
      settings.league_max_ko_rounds_private_h2h,
      remainingEvents - 1
    );
  };

  const minimumSize = (koRounds: number) =>
    koRounds ? Math.pow(2, koRounds) : 2;

  const validStartingEvents = (koRounds: number) =>
    koRounds ? events.slice(0, -koRounds) : events;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    await dispatch(
      createH2HLeague({
        ko_rounds: koRounds || null,
        max_entries: maxEntries || null,
        name,
        start_event: startEvent,
      })
    );
    fireClickTrackEvent(
      {
        event_category: "fantasy league",
        event_component: "fantasy classic clicks",
        event_detail: "create h2h cta",
        event_type: "create league / cup",
      },
      "fantasy create h2h league"
    );
    navigate("/leagues");
  };

  const disabled = !name || !startEvent || isSubmitting;

  const nonFieldError = error?.badRequest?.non_field_errors?.[0];
  const errorMessage =
    nonFieldError?.code === "max_private_entries"
      ? `You may only enter ${settings?.league_join_private_max} invitational leagues`
      : JSON.stringify(error);

  if (noEvents || !entry) {
    return null;
  }

  return (
    <>
      <HelmetHeadLeagues />
      <div className={rightSidebarLayout}>
        <SurfaceContainer>
          <div className={leaguesMainContent}>
            {nonFieldError && <ErrorAlert>{errorMessage}</ErrorAlert>}
            <SectionHeader title="Create a new Head-to-Head League" />
            <form onSubmit={handleSubmit}>
              <div className={leagueGridLayout}>
                <div className={formElementWrapper}>
                  <FormTextField
                    label="League Name"
                    description="Maximum 30 characters"
                    value={name}
                    onChange={(val) => handleSetName(val)}
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

                <div className={formItem}>
                  <FormSelect
                    id="scoring-starts"
                    label="Scoring starts"
                    value={startEvent}
                    onChange={handleSetStartEvent}
                  >
                    {validStartingEvents(koRounds).map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </FormSelect>
                </div>

                <div className={formItem}>
                  <FormSelect
                    id="maximum-size"
                    value={maxEntries}
                    onChange={handleSetMaxEntries}
                    label="Maximum size"
                  >
                    <option value={0} aria-selected={!maxEntries}>
                      Unlimited
                    </option>
                    {range(
                      minimumSize(koRounds),
                      settings.league_max_size_private_h2h + 1
                    ).map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </FormSelect>
                </div>

                {maximumKoRounds() > 0 && (
                  <div className={formItem}>
                    <FormSelect
                      id="ko-rounds"
                      value={koRounds}
                      onChange={handleSetKoRounds}
                      label="Knockout rounds"
                    >
                      <option value={0} aria-selected={!koRounds}>
                        None
                      </option>
                      {range(1, maximumKoRounds() + 1).map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </FormSelect>
                  </div>
                )}

                <div className={formItem}>
                  <Button type="submit" isDisabled={disabled}>
                    {isSubmitting ? "Please wait..." : "Create League"}
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
export default CreateH2H;
