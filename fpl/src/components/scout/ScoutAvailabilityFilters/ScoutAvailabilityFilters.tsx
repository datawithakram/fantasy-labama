import { isKeyInType } from "plos/src/utils";
import { chipRowStyles } from "plos/src/components/FilterSheet/FilterChipRow/filterChipRow.css";
import { PlayerPopover } from "../../FilterPopovers";
import { PricePopover } from "../../FilterPopovers";
import { FilterChip } from "plos/src/components/Chip";
import { NewsAddedSortByPopover } from "../../FilterPopovers";
import { IElementControls } from "core-integration/src/store/elements/types";
import { updateElementControlsAndMaxCost } from "core-integration/src/store/elements/thunks";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "core-integration/src/store";
import { getElementControls } from "core-integration/src/store/elements/reducers";

export const DEFAULT_AVAILABILITY_FILTERS: Pick<
  IElementControls,
  "sort" | "filter" | "maxCost"
> = {
  sort: "news_added",
  filter: "all",
  maxCost: 150,
};

const ScoutAvailabilityFilters = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const controls = useSelector(getElementControls);

  const hasModifiedFilters = !Object.entries(
    DEFAULT_AVAILABILITY_FILTERS
  ).every(([key, value]) => {
    if (isKeyInType(controls, key)) {
      return value === controls[key];
    }
    return false;
  });

  const handleResetFilters = () => {
    dispatch(
      updateElementControlsAndMaxCost({
        ...controls,
        ...DEFAULT_AVAILABILITY_FILTERS,
      })
    );
  };

  return (
    <div className={chipRowStyles}>
      <PlayerPopover />
      <NewsAddedSortByPopover />
      <PricePopover />
      <FilterChip
        label="Reset"
        onClick={handleResetFilters}
        isDisabled={!hasModifiedFilters}
        mode="reset"
      />
    </div>
  );
};

export default ScoutAvailabilityFilters;
