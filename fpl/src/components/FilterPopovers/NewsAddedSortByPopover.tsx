import { ISelectOption, ThunkDispatch } from "core-integration/src/store";
import { updateElementControls } from "core-integration/src/store/elements/actions";
import { getElementControls } from "core-integration/src/store/elements/reducers";
import { IElementControls } from "core-integration/src/store/elements/types";
import { FilterChip } from "plos/src/components/Chip";
import { PopoverSelect } from "plos/src/components/PopoverSelects";
import { ListBoxItem, Selection } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { getOptionLabel } from "../SquadSelectionFilters/utils";
import { DEFAULT_AVAILABILITY_FILTERS } from "../scout/ScoutAvailabilityFilters/ScoutAvailabilityFilters";
import { popoverListItem } from "./filterPopover.css";

const NewsAddedSortByPopover = () => {
  const dispatch = useDispatch<ThunkDispatch>();

  const controls = useSelector(getElementControls);
  const sortFilter = controls.sort;

  const updateControls = (controls: IElementControls) =>
    dispatch(updateElementControls(controls));

  const sortOptions: ISelectOption[] = [
    { label: "Most recently added", value: "news_added" },
    {
      label: "Chance of playing",
      value: "chance_of_playing_next_round",
    },
  ];

  const handleSortChange = (keys: Selection) => {
    const key = Array.from(keys)[0];
    const newFilter = key ?? DEFAULT_AVAILABILITY_FILTERS.sort;
    updateControls({
      ...controls,
      sort: newFilter,
    });
  };

  const selectedOption = {
    value: String(controls.sort),
    label: getOptionLabel({
      options: sortOptions,
      value: String(controls.sort),
    }),
  };

  return (
    <PopoverSelect
      popoverTrigger={
        <FilterChip
          label={"Sort by news added"}
          selectedOption={[selectedOption]}
          isModified={sortFilter !== DEFAULT_AVAILABILITY_FILTERS.sort}
        />
      }
      selectedKey={sortFilter}
      handleOnChange={handleSortChange}
    >
      {sortOptions.map(({ value, label }) => (
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

export default NewsAddedSortByPopover;
