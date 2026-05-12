import {
  ISelectOption,
  RootState,
  ThunkDispatch,
} from "core-integration/src/store";
import { getActiveChip } from "core-integration/src/store/chips/reducers";
import {
  getElementControls,
  getElementTypeFilterOptions,
  getTeamFilterOptions,
} from "core-integration/src/store/elements/reducers";
import { updateElementControlsAndMaxCost } from "core-integration/src/store/elements/thunks";
import { IElementControls } from "core-integration/src/store/elements/types";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import { Badge } from "plos/src/components/Badge";
import { FilterChip } from "plos/src/components/Chip";
import { PopoverSelect } from "plos/src/components/PopoverSelects";
import {
  Header,
  ListBoxItem,
  ListBoxSection,
  Selection,
} from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_ELEMENT_FILTERS } from "../SquadSelectionFilters/ElementFilterChipRow";
import { getOptionLabel } from "../SquadSelectionFilters/utils";
import {
  listboxSectionHeader,
  listboxSectionStyles,
  playerFilterListItem,
  popoverListItem,
  teamBadgeContainer,
} from "./filterPopover.css";

const PlayerPopover = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const controls = useSelector(getElementControls);
  const playerFilter = controls.filter;

  const activeChip = useSelector(getActiveChip);
  const elementTypeFilterOptions = useSelector((state: RootState) =>
    getElementTypeFilterOptions(state, undefined, activeChip?.id)
  );
  const teamFilterOptions = useSelector(getTeamFilterOptions);

  const teamId = useSelector(getTeamsById);

  const globalFilterOptions: ISelectOption[] = [
    { label: "All players", value: "all" },
    { label: "Watchlist", value: "wl" },
  ];

  const playerOptions = {
    global: {
      id: "global",
      label: "Global",
      options: globalFilterOptions,
    },
    position: {
      id: "position",
      label: "Position",
      options: elementTypeFilterOptions,
    },
    teams: {
      id: "teams",
      label: "Teams",
      options: teamFilterOptions,
    },
  };

  const updateControlsAndMaxCost = (controls: IElementControls) =>
    dispatch(updateElementControlsAndMaxCost(controls));

  const handleFilterChange = (keys: Selection) => {
    const key = Array.from(keys)[0];
    const newFilter = String(key ?? DEFAULT_ELEMENT_FILTERS.filter);
    updateControlsAndMaxCost({
      ...controls,
      filter: newFilter,
    });
  };

  const selectedOption = {
    value: playerFilter,
    label: getOptionLabel({
      options: Object.values(playerOptions).flatMap((group) => group.options),
      value: playerFilter,
    }),
  };

  return (
    <PopoverSelect
      popoverTrigger={
        <FilterChip
          label="Filter by player"
          selectedOption={[selectedOption]}
          isModified={playerFilter !== DEFAULT_ELEMENT_FILTERS.filter}
        />
      }
      selectedKey={playerFilter}
      handleOnChange={handleFilterChange}
    >
      {Object.entries(playerOptions).map(([_, value]) => (
        <ListBoxSection key={value.id} className={listboxSectionStyles}>
          <Header className={listboxSectionHeader}>{value.label}</Header>
          {value.options.map(({ value, label }) => {
            let teamBadge = null;
            if (value.startsWith("te_")) {
              const optionTeamId = parseInt(value.split("_")[1], 10);
              if (teamId[optionTeamId]) {
                teamBadge = (
                  <div className={teamBadgeContainer}>
                    <Badge team={teamId[optionTeamId]} isPresentation />
                  </div>
                );
              }
            }
            return (
              <ListBoxItem
                key={value}
                id={value}
                data-selected={value === selectedOption.value}
                className={popoverListItem}
                textValue={label}
              >
                <div className={playerFilterListItem} autoFocus={false}>
                  {teamBadge}
                  <span>{label}</span>
                </div>
              </ListBoxItem>
            );
          })}
        </ListBoxSection>
      ))}
    </PopoverSelect>
  );
};

export default PlayerPopover;
