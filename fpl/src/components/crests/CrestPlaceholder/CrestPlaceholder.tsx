import AddCrestIcon from "../../../img/adobe/add-crest.svg?react";
import PendingCrestIcon from "../../../img/adobe/pending-crest.svg?react";
import {
  crestPlaceholderIcon,
  crestPlaceholderStyles,
  crestPlaceholderText,
} from "./crestPlaceholder.css";

interface CrestPlaceholderProps {
  size?: "sm" | "lg";
  status?: "add" | "pending";
}

export const CrestPlaceholder = ({
  size = "sm",
  status = "add",
}: CrestPlaceholderProps) => {
  const placeholderText =
    status === "add" ? "Generate team badge" : "Pending moderation";
  const placeholderIcon =
    status === "add" ? (
      <AddCrestIcon className={crestPlaceholderIcon[size]} aria-hidden />
    ) : (
      <PendingCrestIcon className={crestPlaceholderIcon[size]} aria-hidden />
    );

  return (
    // Has to be a span because sometimes it's nested in a button which must contain phrasing content
    // https://html.spec.whatwg.org/multipage/form-elements.html#the-button-element
    <span className={crestPlaceholderStyles({ size, status })}>
      {placeholderIcon}
      <span className={crestPlaceholderText[size]}>{placeholderText}</span>
    </span>
  );
};
