import { ThunkDispatch } from "core-integration/src/store";
import { getElementTypes } from "core-integration/src/store/element-types/reducers";
import { updateElementControls } from "core-integration/src/store/elements/actions";
import { getElementControls } from "core-integration/src/store/elements/reducers";
import {
  updateElementControlsAndMaxCost,
  updateElementTypeControl,
} from "core-integration/src/store/elements/thunks";
import {
  IElement,
  IElementControls,
} from "core-integration/src/store/elements/types";
import {
  getAffordableElementsFromControls,
  getProposedElementsById,
  getToSpend,
} from "core-integration/src/store/squad/reducers";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import groupBy from "lodash/groupBy";
import ElementListRow from "plos/src/components/ElementListRow";
import { SearchField } from "plos/src/components/Forms/SearchField";
import { Paginator } from "plos/src/components/Paginator";
import SectionHeader from "plos/src/components/SectionHeader";
import { SquadStatusBar } from "plos/src/components/SquadStatusBar";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import { unstyledButton } from "plos/src/styles";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { integerToMoneyWithCurrency } from "plos/src/utils/money";
import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import { useDispatch, useSelector } from "react-redux";
import {
  getStatDetails,
  getStatFormattedLabel,
  isStatName,
  StatName,
} from "../../../utils/stats";
import { ElementFilterChipRow } from "../../SquadSelectionFilters";
import {
  addElementColumn,
  elementListElement,
  elementListStat,
  elementListStatus,
  elementListTable,
  elementListWrap,
  filtersWrap,
  tableHeader,
  tablesWrap,
} from "./elementList.css";
import { ElementListProps } from "./types";

/**
 * Component that displays a list of elements (players) grouped by their position type.
 */

const ElementList = ({ handleClose, inSheet = false }: ElementListProps) => {
  const [page, setPage] = useState(1);

  const dispatch = useDispatch<ThunkDispatch>();

  const controls = useSelector(getElementControls);

  useEffect(() => {
    setPage(1);
  }, [controls]);

  const currencyDivisor = 10;
  const elementTypes = useSelector(getElementTypes);
  const elements = useSelector(getAffordableElementsFromControls);
  const proposedElementsById = useSelector(getProposedElementsById);

  const teamsById = useSelector(getTeamsById);

  const handleSearchChange = (value: string) => {
    updateControls({
      ...controls,
      search: value,
    });
  };

  // TODO: Fix this properly by preventing invalid sort values from being set in Redux store
  // Root cause: PlayerAvailability and ScoutAvailability components set sort: "news_added"
  // but "news_added" is not a valid stat for ElementList.
  const validateSortValue = (sortValue: string): StatName => {
    if (!isStatName(sortValue)) {
      console.warn(
        `Invalid sort value: "${sortValue}". Falling back to "total_points".`
      );
      return "total_points";
    }
    return sortValue;
  };

  const validatedSort = validateSortValue(String(controls.sort));
  const sortStatDetails = getStatDetails(validatedSort);

  const updateControls = (controls: IElementControls) =>
    dispatch(updateElementControls(controls));
  const updateControlsAndMaxCost = (controls: IElementControls) =>
    dispatch(updateElementControlsAndMaxCost(controls));
  const showElementType = (elementTypeId: number) =>
    dispatch(updateElementTypeControl(elementTypeId));

  useEffect(() => {
    // Skip the useEffect if inSheet is true
    if (inSheet !== true) {
      updateControlsAndMaxCost({
        ...controls,
        filter: "all",
        sort: "total_points",
        search: "",
        getUnavailable: false,
      });
    }
  }, [inSheet]);

  useEffect(() => {
    // Reset to page 1 whenever any filters change
    setPage(1);
  }, [controls.filter, controls.sort, controls.maxCost]);

  const paginateAndGroup = (elements: IElement[], pageSize: number) => {
    const start = (page - 1) * pageSize;
    return {
      data: groupBy(elements.slice(start, start + pageSize), "element_type"),
      totalPages: Math.ceil(elements.length / pageSize),
    };
  };

  const { data, totalPages } = paginateAndGroup(elements.data, 30);

  const bank = useSelector(getToSpend);

  return (
    <div className={elementListWrap}>
      <div className={filtersWrap}>
        <SectionHeader
          title="Player Selection"
          description="Select a maximum of 3 players from a single team or 'Auto Pick' if you're short of time."
        />
        <SearchField
          id="search"
          name="search"
          label="Find a player"
          labelSize="m"
          onChange={handleSearchChange}
          placeholder="Search by name"
          value={controls.search}
        />
        <ElementFilterChipRow />
        <SquadStatusBar>
          <strong role="status">
            {inSheet
              ? `Bank ${integerToMoneyWithCurrency(bank, 10)}`
              : `${elements.data.length} players shown`}
          </strong>
        </SquadStatusBar>
      </div>
      <div className={tablesWrap}>
        {elementTypes.map(
          (et) =>
            data[et.id] && (
              <table
                key={et.id}
                aria-label={et.plural_name}
                className={elementListTable}
              >
                <thead>
                  <tr>
                    <th scope="col" className={elementListStatus}>
                      <Button
                        className={unstyledButton}
                        onPress={() => showElementType(et.id)}
                      >
                        <span className={tableHeader}>
                          {data[et.id].length === 1
                            ? et.singular_name
                            : et.plural_name}
                        </span>
                      </Button>
                    </th>
                    <th scope="col" className={elementListElement}>
                      <span className={visuallyHidden}>Player</span>
                    </th>
                    <th scope="col" className={elementListStat}>
                      Price
                    </th>
                    <th scope="col" className={elementListStat}>
                      <InfoText
                        label={sortStatDetails?.label || "Unknown stat"}
                      >
                        {getStatFormattedLabel(validatedSort)}
                      </InfoText>
                    </th>
                    <th scope="col" className={addElementColumn}>
                      <span className={visuallyHidden}>
                        Add or Remove Player
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data[et.id].map((e: IElement) => (
                    <ElementListRow
                      key={e.id}
                      element={e}
                      isProposed={!!proposedElementsById[e.id]}
                      team={teamsById[e.team]}
                      currencyDivisor={currencyDivisor}
                      sort={controls.sort}
                      hasAddElement
                      handleClose={handleClose}
                    />
                  ))}
                </tbody>
              </table>
            )
        )}
      </div>
      <Paginator totalPages={totalPages} page={page} setPage={setPage} />
    </div>
  );
};

export default ElementList;
