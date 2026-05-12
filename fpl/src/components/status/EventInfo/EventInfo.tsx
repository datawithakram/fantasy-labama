import { getElementsById } from "core-integration/src/store/elements/reducers";
import { useSelector } from "react-redux";
import { eventInfoContainer } from "./eventInfo.css";
import { InfoItem, InfoItemPhoto } from "./InfoItem";
import { EventInfoProps } from "./types";

const EventInfo = ({ now }: EventInfoProps) => {
  const elementsById = useSelector(getElementsById);
  if (!now) {
    return null;
  }

  const matches = now.chip_plays.filter((cp) => cp.chip_name === "wildcard");
  const wildcards = matches.length ? matches[0].num_played : "-";
  const totalChipsPlayed = now.chip_plays.reduce(
    (sum, chip) => sum + chip.num_played,
    0
  );

  // Extract elements to reduce repetition
  const mostSelectedElement = now.most_selected
    ? elementsById[now.most_selected]
    : null;
  const mostViceCaptainedElement = now.most_vice_captained
    ? elementsById[now.most_vice_captained]
    : null;
  const mostTransferredInElement = now.most_transferred_in
    ? elementsById[now.most_transferred_in]
    : null;
  const mostCaptainedElement = now.most_captained
    ? elementsById[now.most_captained]
    : null;

  return (
    <div className={eventInfoContainer}>
      {now.id === 1 && (
        <>
          <InfoItem
            heading="Chips Played"
            value={totalChipsPlayed ? totalChipsPlayed.toLocaleString() : "-"}
          />
          <InfoItemPhoto
            heading="Most Selected Player"
            element={mostSelectedElement}
          />
          <InfoItemPhoto
            heading="Most Vice Captained"
            element={mostViceCaptainedElement}
          />
        </>
      )}
      {now.id > 1 && (
        <>
          <InfoItem
            heading="Transfers Made"
            value={
              now.transfers_made ? now.transfers_made.toLocaleString() : "-"
            }
          />
          <InfoItem
            heading="Wildcards Played"
            value={wildcards === null ? "-" : wildcards.toLocaleString()}
          />
          <InfoItemPhoto
            heading="Most Transferred In"
            element={mostTransferredInElement}
          />
        </>
      )}
      <InfoItemPhoto heading="Most Captained" element={mostCaptainedElement} />
    </div>
  );
};

export default EventInfo;
