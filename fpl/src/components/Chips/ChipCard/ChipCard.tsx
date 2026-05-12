import { IPotentialChip } from "core-integration/src/store/chips/types";
import { Button } from "plos/src/components/buttons/Button";
import ChevronRightIcon from "plos/src/img/icons/chevron-right.svg?react";
import { getShortNameFromId } from "../../../utils/events";
import ChipBadge from "../ChipBadge";
import {
  cardStyles,
  chipActionLabel,
  chipButtonStyles,
  chipTitle,
  labelWrapper,
} from "./chipCard.css";

interface ChipChardProps {
  onClick?: () => void;
  title: string;
  chip: IPotentialChip;
  variant?: "responsive" | "default";
}

const ChipCard = ({
  chip,
  onClick,
  title,
  variant = "default",
}: ChipChardProps) => {
  const chipLabelText = () => {
    switch (chip.status_for_entry) {
      case "unavailable":
        return "Unavailable";
      case "proposed":
        return "Pending";
      case "active":
        if (chip.is_pending) {
          return "Pending";
        }
        return "Active";
      case "cancelled":
      case "available":
        return "Play";
      case "played": {
        const eventsPlayed = chip.played_by_entry.map((id) =>
          getShortNameFromId(id, true)
        );
        return (
          <>
            {"Played "}
            {eventsPlayed.length > 1
              ? eventsPlayed.join(", ")
              : `GW${eventsPlayed[0]}`}
          </>
        );
      }
      default:
        return "";
    }
  };
  const chipIsUnavailable = chip.status_for_entry === "unavailable";
  const chipLabel = chipLabelText();
  const buttonStyleVariant = chipIsUnavailable ? "unavailable" : "default";

  return (
    <li aria-label={`${title} chip`} className={cardStyles[variant]}>
      <Button
        className={chipButtonStyles[buttonStyleVariant]}
        onPress={onClick}
        isDisabled={chipIsUnavailable}
      >
        <ChipBadge path={`/img/chips/${chip.name}`} sizes={"24px"} />
        <h4 className={chipTitle}>{title}</h4>
        <span className={labelWrapper}>
          <span className={chipActionLabel[chip.status_for_entry]}>
            {chipLabel}
          </span>
          {chip.status_for_entry === "played" && (
            <ChevronRightIcon aria-hidden width={10} height={10} />
          )}
        </span>
      </Button>
    </li>
  );
};

export default ChipCard;
