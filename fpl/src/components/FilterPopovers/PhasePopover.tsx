import { ISelectOption } from "core-integration/src/store";
import { getCurrentEvent } from "core-integration/src/store/events/reducers";
import { getStartedPhases } from "core-integration/src/store/phases/reducers";
import { FilterChip } from "plos/src/components/Chip";
import { PopoverSelect } from "plos/src/components/PopoverSelects";
import { ListBoxItem, Selection } from "react-aria-components";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  getQueryParam,
  updateQueryParams,
} from "../leagues/Classic/StandingsClassic/utils";
import { popoverListItem } from "./filterPopover.css";

export const DEFAULT_PHASE = 1;

const PhasePopover = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const now = useSelector(getCurrentEvent);

  const phase = getQueryParam({ location, key: "phase" });
  const phaseAsNumber = phase ? parseInt(phase) : DEFAULT_PHASE;

  const phases = useSelector(getStartedPhases);
  const hasNoPhases = !phases.length;

  if (!now || hasNoPhases) return null;

  const getSelectedPhase = () => {
    const match = phases.find(({ id }) => id === phaseAsNumber)!;
    return { value: match.id.toString(), label: match.name };
  };

  const selectedPhase = getSelectedPhase();

  const phaseOptions: ISelectOption[] = phases.map((p) => ({
    value: p.id.toString(),
    label: p.name,
  }));

  const handlePhaseChange = (keys: Selection) => {
    const key = Array.from(keys)[0];

    updateQueryParams({
      location,
      navigate,
      newParams: {
        phase: String(key),
        page_new_entries: 1,
        page_standings: 1,
      },
    });
  };

  return (
    <PopoverSelect
      popoverTrigger={
        <FilterChip
          label="Filter by phase"
          selectedOption={[selectedPhase]}
          isModified={selectedPhase.value !== DEFAULT_PHASE.toString()}
        />
      }
      selectedKey={selectedPhase.value}
      handleOnChange={handlePhaseChange}
    >
      {phaseOptions.map(({ value, label }) => (
        <ListBoxItem
          key={value}
          id={value}
          data-selected={value === selectedPhase.value}
          className={popoverListItem}
          textValue={label}
        >
          {label}
        </ListBoxItem>
      ))}
    </PopoverSelect>
  );
};

export default PhasePopover;
