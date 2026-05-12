import { ThunkDispatch } from "core-integration/src/store";
import { getNextEvent } from "core-integration/src/store/events/reducers";
import { getSquadError } from "core-integration/src/store/squad/reducers";
import { createEntry } from "core-integration/src/store/squad/thunks";
import { ICreateEntryData } from "core-integration/src/store/squad/types";
import { getTeams } from "core-integration/src/store/teams/reducers";
import { Button } from "plos/src/components/buttons/Button";
import { Checkbox } from "plos/src/components/Forms/Checkbox";
import { FormSelect } from "plos/src/components/Forms/FormSelect";
import { FormTextField } from "plos/src/components/Forms/FormTextField";
import RouterLink from "plos/src/components/links/RouterLink";
import { Sheet } from "plos/src/components/Sheet";
import { FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSaveContext } from "../../../contexts/SaveContext";
import { useTrackingContext } from "../../../contexts/TrackingContext";
import { GameOverSheet } from "../GameOverSheet";
import { getCodeFromError } from "../helpers";
import {
  footerStyles,
  formContentWrapperStyles,
  formInputWrapperStyles,
  formStyles,
  infoText,
} from "./createSquadSheet.css";

const requiredFields: Array<keyof ICreateEntryData> = [
  "name",
  "terms_agreed",
  "favourite_team",
];

interface CreateSquadSheetProps {
  isTriggerDisabled: boolean;
}

const CreateSquadSheet = ({ isTriggerDisabled }: CreateSquadSheetProps) => {
  const [open, setOpen] = useState(false);

  const [formState, setFormState] = useState<ICreateEntryData>({
    email: false,
    favourite_team: null,
    name: "",
    terms_agreed: false,
  });

  const { setSaveState } = useSaveContext();
  const { fireClickTrackEvent } = useTrackingContext();

  const navigate = useNavigate();

  const dispatch = useDispatch<ThunkDispatch>();
  const isValid = requiredFields.every((e) => Boolean(formState[e]));

  const nextEvent = useSelector(getNextEvent);
  const teams = useSelector(getTeams);
  const error = useSelector(getSquadError);
  const errorCode = getCodeFromError(error);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sharedSheetProps = {
    open,
    handleOpen,
    handleClose,
  };

  const handleFaveChange = (e: FormEvent<HTMLSelectElement>) => {
    setFormState({
      ...formState,
      favourite_team: parseInt(e.currentTarget.value, 10),
    });
  };

  const handleNameChange = (value: string) =>
    setFormState({ ...formState, name: value });

  const handleTermsChange = (value: boolean) =>
    setFormState({
      ...formState,
      terms_agreed: value,
    });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid) {
      formState.favourite_team =
        formState.favourite_team === -1 ? null : formState.favourite_team;
      await dispatch(createEntry(formState));
      fireClickTrackEvent(
        {
          event_category: "fantasy team",
          event_component: "fantasy classic clicks",
          event_detail: "submit team",
          event_type: "create team",
        },
        "fantasy squad selection"
      );
      setSaveState("initial");
      navigate("/my-team");
    }
  };

  if (error) {
    const handledErrorCodes = ["price_changed"];
    if (handledErrorCodes.indexOf(errorCode) === -1) {
      window.location.reload();
      return null;
    }
  }

  return (
    <>
      <Button
        onPress={handleOpen}
        size="medium"
        fullWidth
        isDisabled={isTriggerDisabled}
      >
        Enter Squad
      </Button>
      {!nextEvent ? (
        <GameOverSheet {...sharedSheetProps} />
      ) : (
        <Sheet title="Enter Squad" {...sharedSheetProps}>
          <form onSubmit={handleSubmit} className={formStyles}>
            <div className={formContentWrapperStyles}>
              <div className={formInputWrapperStyles}>
                <FormTextField
                  label="Pick your team name (maximum 20 characters)"
                  placeholder="Enter Name Here"
                  onChange={(val) => handleNameChange(val)}
                  maxLength={20}
                />
                <FormSelect
                  id="favourite-club"
                  label="Choose your favourite club"
                  value={formState.favourite_team ?? ""}
                  placeholder="Pick Team"
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
                <div>
                  <Checkbox
                    data-testid="terms-checkbox"
                    onChange={(val) => handleTermsChange(val)}
                  >
                    I accept the Terms & Conditions
                  </Checkbox>
                  <div>
                    <RouterLink
                      to="/help/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Read the full Terms & Conditions"
                    >
                      (Read full terms)
                    </RouterLink>
                  </div>
                </div>
              </div>
              <p className={infoText}>
                By creating a Fantasy team you will automatically receive
                updates relating to Fantasy if you are already opted into our
                general Premier League emails.
              </p>
            </div>
            <div className={footerStyles}>
              <Button
                fullWidth
                size="medium"
                styleVariant="outlined"
                onPress={handleClose}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                size="medium"
                type="submit"
                isDisabled={!isValid}
                data-testid="enter-squad-sheet"
              >
                Enter Squad
              </Button>
            </div>
          </form>
        </Sheet>
      )}
    </>
  );
};

export default CreateSquadSheet;
