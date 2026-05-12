import { IEventsById } from "core-integration/src/store/events/types";
import { formatRawAsLocal } from "core-integration/src/utils/datetime";
import { ReactNode } from "react";
import { chipDescriptionStyles } from "./chipSheet.css";

const PStyled = ({ children }: { children: ReactNode }) => (
  <p className={chipDescriptionStyles}>{children}</p>
);

export const getChipDescriptions = ({
  showModalConfirmation,
  eventsById,
}: {
  showModalConfirmation: boolean;
  eventsById: IEventsById;
}): { [key: string]: ReactNode } => ({
  bboost: (
    <>
      <PStyled>
        The points scored by your benched players in a Gameweek will be added to
        your total.
      </PStyled>
      <PStyled>
        It can be cancelled at anytime before the Gameweek deadline.
      </PStyled>
      <PStyled>
        {`You lose the first Bench Boost after the Gameweek 19 deadline, ${formatRawAsLocal(
          eventsById[19].deadline_time
        )}.`}
      </PStyled>
      <PStyled>{`The second Bench Boost will be available after ${formatRawAsLocal(
        eventsById[19].deadline_time
      )}.`}</PStyled>
    </>
  ),
  "3xc": (
    <>
      <PStyled>
        The points scored by your captain will be tripled instead of doubled in
        a Gameweek.
      </PStyled>
      <PStyled>
        It can be cancelled at anytime before the Gameweek deadline.
      </PStyled>
      <PStyled>
        {`You lose the first Triple Captain after the Gameweek 19 deadline, ${formatRawAsLocal(
          eventsById[19].deadline_time
        )}.`}
      </PStyled>
      <PStyled>{`The second Triple Captain will be available after ${formatRawAsLocal(
        eventsById[19].deadline_time
      )}.`}</PStyled>
    </>
  ),
  freehit: (
    <>
      {showModalConfirmation ? (
        <PStyled>
          <strong>
            You have already made a transfer this Gameweek so you will not be
            able to cancel this chip once played.
          </strong>
        </PStyled>
      ) : (
        <>
          <PStyled>
            Make unlimited free transfers for a single Gameweek. In the next
            Gameweek, your squad will return to how it was at the start of the
            last Gameweek.
          </PStyled>
          <PStyled>
            This chip cannot be cancelled after you play it, unless you have not
            yet made a transfer this Gameweek.
          </PStyled>
          <PStyled>
            {`You lose the first Free Hit after the Gameweek 19 deadline, ${formatRawAsLocal(
              eventsById[19].deadline_time
            )}.`}
          </PStyled>
          <PStyled>{`The second Free Hit will be available after ${formatRawAsLocal(
            eventsById[19].deadline_time
          )}.`}</PStyled>
          <PStyled>
            The Free Hit chip cannot be played in consecutive Gameweeks. So, if
            the first chip is played in Gameweek 19, the second Free Hit cannot
            be made active until Gameweek 21.
          </PStyled>
        </>
      )}
    </>
  ),
  wildcard: (
    <>
      {showModalConfirmation ? (
        <PStyled>
          <strong>
            You have already made a transfer this Gameweek so you will not be
            able to cancel this chip once played.
          </strong>
        </PStyled>
      ) : (
        <>
          <PStyled>
            Make unlimited permanent transfers in a Gameweek without incurring
            the usual 4 point cost for each.
          </PStyled>
          <PStyled>
            {`You lose the first Wildcard after the Gameweek 19 deadline, ${formatRawAsLocal(
              eventsById[19].deadline_time
            )}.`}
          </PStyled>
          <PStyled>{`The second Wildcard will be available after ${formatRawAsLocal(
            eventsById[19].deadline_time
          )}.`}</PStyled>
          <PStyled>
            This chip cannot be cancelled if you have made 2 or more transfers
            this Gameweek. Once the chip status has changed from “Pending” to
            “Active”, the activation cannot be cancelled or reversed.
          </PStyled>
        </>
      )}
    </>
  ),
});
