import { ThunkDispatch } from "core-integration/src/store";
import { updateEntry } from "core-integration/src/store/entries/thunks";
import {
  IEntry,
  IUpdateEntryData,
} from "core-integration/src/store/entries/types";
import { getEvents } from "core-integration/src/store/events/reducers";
import { getTeams } from "core-integration/src/store/teams/reducers";
import { formatRawAsLocal } from "core-integration/src/utils/datetime";
import { Alert } from "plos/src/components/alerts";
import { Button } from "plos/src/components/buttons/Button";
import { FormSelect } from "plos/src/components/Forms";
import { FormTextField } from "plos/src/components/Forms/FormTextField";
import HorizontalDivider from "plos/src/components/HorizontalDivider";
import Subheading from "plos/src/components/Subheading";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  containerStyles,
  explainText,
  favouriteClubTitle,
  headerStyles,
  inputWrapper,
} from "./updateTeamDetails.css";

type FormState = {
  favourite_team: IEntry["favourite_team"];
  name: IEntry["name"];
};

interface UpdateTeamDetailsProps {
  entry: IEntry;
}

const checkForChanges = ({
  formState,
  entry,
}: {
  formState: FormState;
  entry: IEntry;
}) => {
  const { favourite_team: faveTeam, name: nameValue } = formState;

  const faveValue = faveTeam === -1 ? null : faveTeam;

  return nameValue === entry.name && faveValue === entry.favourite_team;
};

const UpdateTeamDetails = ({ entry }: UpdateTeamDetailsProps) => {
  const [hasUpdate, setHasUpdate] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    favourite_team: entry.favourite_team,
    name: entry.name,
  });

  const dispatch = useDispatch<ThunkDispatch>();
  const teams = useSelector(getTeams);
  const events = useSelector(getEvents);

  const handleNameChange = (value: string) => {
    setFormState({ ...formState, name: value });
  };

  const handleFaveChange = (e: FormEvent<HTMLSelectElement>) => {
    setFormState({
      ...formState,
      favourite_team: parseInt(e.currentTarget.value, 10),
    });
  };

  const handleUpdateEntry = async (data: IUpdateEntryData) => {
    try {
      await dispatch(updateEntry(data));
      setHasUpdate(true);
      setTimeout(() => setHasUpdate(false), 3000);
    } catch (error) {
      console.error("Failed to update entry", error);
    }
  };

  const handleUpdateTeamDetails = () => {
    const newName = formState.name;
    const newFavouriteTeam = formState.favourite_team;

    handleUpdateEntry({
      name: newName,
      favourite_team: newFavouriteTeam === -1 ? null : newFavouriteTeam,
      kit: null,
      email: false,
    });
  };

  const formHasNoChanges = checkForChanges({ formState, entry });
  const emptyNameValue = !formState.name;

  const updateIsDisabled = formHasNoChanges || emptyNameValue;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleUpdateTeamDetails();
  };

  return (
    <SurfaceContainer>
      <form className={containerStyles} onSubmit={handleSubmit}>
        <div className={headerStyles}>
          <Subheading>My Details</Subheading>
          {hasUpdate && (
            <Alert isContentCentered variant={"success"}>
              Updated
            </Alert>
          )}
        </div>

        <span className={inputWrapper}>
          <FormTextField
            label="Team Name"
            value={formState.name}
            placeholder="Enter Name Here"
            onChange={(val) => handleNameChange(val)}
            maxLength={20}
            isDisabled={entry.name_change_blocked}
          />
          <span className={explainText}>
            Please think carefully before entering your team name. Teams with
            names that are deemed inappropriate or offensive may result in your
            account being deleted. Please refer to the Terms & Conditions of
            entry for more information.
          </span>
        </span>
        <HorizontalDivider />
        <span className={inputWrapper}>
          <h4 className={favouriteClubTitle}>Favourite Club</h4>
          <span className={explainText}>
            Choose your favourite Premier League club if you would like to be
            entered into a supporters league. If you do not select an option
            before {formatRawAsLocal(events[0].deadline_time)}, you will not be
            entered into a supporters league.
          </span>
        </span>
        <FormSelect
          id="favourite-club"
          label="Favourite club"
          value={
            formState.favourite_team === null ? -1 : formState.favourite_team
          }
          onChange={handleFaveChange}
        >
          {teams.map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
          <option key={-1} value={-1}>
            None
          </option>
        </FormSelect>
        <Button
          type="submit"
          fullWidth
          size="small"
          isDisabled={updateIsDisabled}
        >
          Update Details
        </Button>
      </form>
    </SurfaceContainer>
  );
};

export default UpdateTeamDetails;
