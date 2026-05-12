import {
  formatRawAsDate,
  formatRawAsISO,
} from "core-integration/src/utils/datetime";
import { useEffect, useState } from "react";
import SortAscIcon from "../../../img/icons/sort-asc.svg?react";
import SortDescIcon from "../../../img/icons/sort-desc.svg?react";
import {
  EventNameAndDateStyles,
  FDRHeadingStyles,
  HeaderStyles,
  SortingIconStyles,
  SortingWrapperStyles,
  iconPlaceholder,
} from "./fdrHeadingCell.css";
import { FDRHeadingProps } from "./types";

const FDRHeadingCell = ({
  id,
  eventName = "Heading",
  eventDeadline,
  onHandleClick,
  activeEventId,
}: FDRHeadingProps) => {
  const [active, setActive] = useState(true);
  const [, setIsTeam] = useState(true);
  const [sortOrderAsc, setOrderAsc] = useState(true);

  useEffect(() => {
    if (activeEventId !== id) {
      setOrderAsc(false);
      setActive(false);
      setIsTeam(false);
    }
  }, [id, activeEventId]);

  function handleHeadingClick() {
    const newOrderAsc = !sortOrderAsc;
    setOrderAsc(newOrderAsc);
    setActive(true);
    onHandleClick(id, newOrderAsc ? "asc" : "dsc");
  }

  return (
    <div className={FDRHeadingStyles} onClick={handleHeadingClick}>
      <header className={HeaderStyles}>
        <div className={EventNameAndDateStyles}>{eventName}</div>
        {eventDeadline && (
          <time
            className={EventNameAndDateStyles}
            dateTime={formatRawAsISO(eventDeadline)}
          >
            {formatRawAsDate(eventDeadline)}
          </time>
        )}
      </header>
      <div className={SortingWrapperStyles}>
        {active ? (
          <>
            {sortOrderAsc ? (
              <SortAscIcon className={SortingIconStyles} />
            ) : (
              <SortDescIcon className={SortingIconStyles} />
            )}
          </>
        ) : (
          <div className={iconPlaceholder} />
        )}
      </div>
    </div>
  );
};

export default FDRHeadingCell;
