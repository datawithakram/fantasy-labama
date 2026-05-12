import { ThunkDispatch } from "core-integration/src/store";
import { getElementControls } from "core-integration/src/store/elements/reducers";
import { updateElementControlsAndMaxCost } from "core-integration/src/store/elements/thunks";
import { IElementControls } from "core-integration/src/store/elements/types";
import { isKeyInType } from "plos";
import { FilterChip } from "plos/src/components/Chip";
import { chipRowStyles } from "plos/src/components/FilterSheet/FilterChipRow/filterChipRow.css";
import { useDispatch, useSelector } from "react-redux";
import { PlayerPopover, PricePopover, SortByPopover } from "../FilterPopovers";

export const DEFAULT_ELEMENT_FILTERS: Pick<
  IElementControls,
  "sort" | "filter" | "maxCost"
> = {
  sort: "total_points",
  filter: "all",
  maxCost: 150,
};

const ElementFilterChipRow = () => {
  const dispatch = useDispatch<ThunkDispatch>();

  const controls = useSelector(getElementControls);
  const hasModifiedFilters = !Object.entries(DEFAULT_ELEMENT_FILTERS).every(
    ([key, value]) => {
      if (isKeyInType(controls, key)) {
        return value === controls[key];
      }
      return false;
    }
  );

  const handleResetFilters = () => {
    dispatch(
      updateElementControlsAndMaxCost({
        ...controls,
        ...DEFAULT_ELEMENT_FILTERS,
      })
    );
  };

  return (
    <div className={chipRowStyles}>
      <PlayerPopover />
      <SortByPopover />
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

export default ElementFilterChipRow;
