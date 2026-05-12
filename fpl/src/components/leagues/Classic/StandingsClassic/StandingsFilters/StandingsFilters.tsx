import { FilterChip } from "plos/src/components/Chip";
import { chipRowStyles } from "plos/src/components/FilterSheet/FilterChipRow/filterChipRow.css";
import { useLocation, useNavigate } from "react-router";
import PhasePopover from "../../../../FilterPopovers/PhasePopover";
import { getQueryParam, updateQueryParams } from "../utils";

export const DEFAULT_PHASE = 1;

const StandingsFilters = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const phase = getQueryParam({ location, key: "phase" });
  const phaseAsNumber = parseInt(phase as string, 10) || DEFAULT_PHASE;

  const handleReset = () => {
    updateQueryParams({
      location,
      navigate,
      newParams: {
        phase: 1,
        page_new_entries: 1,
        page_standings: 1,
      },
    });
  };

  const hasModifiedFilters = phaseAsNumber !== DEFAULT_PHASE;

  return (
    <div className={chipRowStyles}>
      <PhasePopover />
      <FilterChip
        label="Reset"
        onClick={handleReset}
        isDisabled={!hasModifiedFilters}
        mode="reset"
      />
    </div>
  );
};

export default StandingsFilters;
