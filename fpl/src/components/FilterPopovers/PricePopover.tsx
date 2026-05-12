import { ISelectOption, ThunkDispatch } from "core-integration/src/store";
import { updateElementControls } from "core-integration/src/store/elements/actions";
import { getElementControls } from "core-integration/src/store/elements/reducers";
import { IElementControls } from "core-integration/src/store/elements/types";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import {
  getAffordableElementsFromControls,
  getToSpend,
} from "core-integration/src/store/squad/reducers";
import range from "lodash/range";
import { FilterChip } from "plos/src/components/Chip";
import { PopoverSelect } from "plos/src/components/PopoverSelects";
import { ListBoxItem, Selection } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import { integerToMoneyWithCurrency } from "../../utils/money";
import { DEFAULT_ELEMENT_FILTERS } from "../SquadSelectionFilters/ElementFilterChipRow";
import { popoverListItem } from "./filterPopover.css";

const CURRENCY_DIVISOR = 10;

const PricePopover = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const controls = useSelector(getElementControls);
  const elements = useSelector(getAffordableElementsFromControls);

  const player = useSelector(getPlayerData);

  const maxCost = controls.maxCost;
  const toSpend = useSelector(getToSpend);

  const priceOptions: ISelectOption[] = range(
    elements.maxCost,
    elements.minCost - 1,
    -5
  ).map((cost) => ({
    value: String(cost),
    label: `${integerToMoneyWithCurrency(cost, CURRENCY_DIVISOR)}`,
  }));

  const selectedOption = {
    value: String(maxCost),
    label:
      maxCost === toSpend
        ? `Affordable (${integerToMoneyWithCurrency(
            toSpend,
            CURRENCY_DIVISOR
          )})`
        : `${integerToMoneyWithCurrency(maxCost, CURRENCY_DIVISOR)}`,
  };

  const updateControls = (controls: IElementControls) =>
    dispatch(updateElementControls(controls));

  const handleMaxCostChange = (keys: Selection) => {
    const key = Array.from(keys)[0];

    if (key === "affordable") {
      updateControls({
        ...controls,
        maxCost: toSpend,
      });
    } else {
      const newMaxCost = key ? Number(key) : DEFAULT_ELEMENT_FILTERS.maxCost;
      updateControls({
        ...controls,
        maxCost: newMaxCost,
      });
    }
  };

  return (
    <PopoverSelect
      popoverTrigger={
        <FilterChip
          label="Filter by price"
          selectedOption={[selectedOption]}
          isModified={maxCost !== DEFAULT_ELEMENT_FILTERS.maxCost}
        />
      }
      selectedKey={String(maxCost)}
      handleOnChange={handleMaxCostChange}
    >
      {/* Hide the affordable filter if player isn't logged in as it's not relevant without a bank */}
      {player && (
        <ListBoxItem
          key={-1}
          id="affordable"
          data-selected={"affordable" === selectedOption.value}
          className={popoverListItem}
        >
          Affordable
        </ListBoxItem>
      )}
      {priceOptions.map(({ value, label }) => (
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

export default PricePopover;
