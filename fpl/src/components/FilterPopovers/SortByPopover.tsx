import { ISelectOption, ThunkDispatch } from "core-integration/src/store";
import { updateElementControls } from "core-integration/src/store/elements/actions";
import { getElementControls } from "core-integration/src/store/elements/reducers";
import { IElementControls } from "core-integration/src/store/elements/types";
import { FilterChip } from "plos/src/components/Chip";
import { PopoverSelect } from "plos/src/components/PopoverSelects";
import { ListBoxItem, Selection } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { statDetails } from "../../utils/stats";
import { DEFAULT_ELEMENT_FILTERS } from "../SquadSelectionFilters/ElementFilterChipRow";
import { getOptionLabel } from "../SquadSelectionFilters/utils";
import { popoverListItem } from "./filterPopover.css";

const SortByPopover = () => {
  const dispatch = useDispatch<ThunkDispatch>();

  const controls = useSelector(getElementControls);
  const sortFilter = controls.sort;
  const updateControls = (controls: IElementControls) =>
    dispatch(updateElementControls(controls));

  const handleSortChange = (keys: Selection) => {
    const key = Array.from(keys)[0];
    const newFilter = key ?? DEFAULT_ELEMENT_FILTERS.sort;
    updateControls({
      ...controls,
      sort: newFilter,
    });
  };

  const sortByOptions: ISelectOption[] = Object.entries(statDetails).map(
    ([key, value]) => ({
      value: key,
      label: value.label,
    })
  );

  const selectedOption = {
    value: String(sortFilter),
    label: getOptionLabel({
      options: sortByOptions,
      value: String(sortFilter),
    }),
  };

  return (
    <PopoverSelect
      popoverTrigger={
        <FilterChip
          label="Sort by"
          selectedOption={[selectedOption]}
          isModified={sortFilter !== DEFAULT_ELEMENT_FILTERS.sort}
        />
      }
      selectedKey={sortFilter}
      handleOnChange={handleSortChange}
    >
      {sortByOptions.map(({ value, label }) => (
        <ListBoxItem
          key={value}
          id={value}
          data-selected={value === selectedOption.value}
          className={popoverListItem}
          textValue={label}
        >
          {label}
        </ListBoxItem>
      ))}
    </PopoverSelect>
  );
};

export default SortByPopover;
