import { Button } from "plos/src/components/buttons/Button";
import { ElementNewsLink } from "plos/src/components/links/ElementNewsLink";
import { PlayerNotesPropertyIcon } from "plos/src/components/playerNotes/PlayerNotesPropertyIcon";
import { Disclosure, DisclosurePanel, Heading } from "react-aria-components";
import { ChevronDown } from "../../../icons/Chevrons";
import {
  chevronDown,
  playerNotesContainer,
  playerNotesContent,
  playerNotesDropdownIconContainer,
  playerNotesHeading,
  playerNotesItem,
  playerNotesItemContent,
} from "./playerNotesDropdown.css";
import { PlayerNotesDropdownProps } from "./types";

const PlayerNotesDropdown = ({ element }: PlayerNotesDropdownProps) => {
  const playerNotes = element.scout_risks && element.scout_risks.length > 0;

  if (!playerNotes || !element.scout_risks) {
    return null;
  }

  // Filter to only unique notes
  // Particularly for international duty notes, there may be duplicates
  // as there will be one note per GW that they are expected to miss.
  const uniqueRisks = element.scout_risks.filter(
    (risk, index, self) =>
      index ===
      self.findIndex(
        (r) => r.property === risk.property && r.notes === risk.notes
      )
  );

  return (
    <Disclosure
      className={playerNotesContainer}
      defaultExpanded={uniqueRisks.length === 1}
    >
      <Heading level={2}>
        <Button className={playerNotesHeading} slot="trigger">
          <div className={playerNotesItem}>
            <div className={playerNotesDropdownIconContainer}>
              <PlayerNotesPropertyIcon property="notes_icon" />
            </div>
            {uniqueRisks.length === 1
              ? "Status Update"
              : `${uniqueRisks.length} Status Updates`}
          </div>
          <div>
            <ChevronDown className={chevronDown} />
          </div>
        </Button>
      </Heading>
      <DisclosurePanel className={playerNotesContent}>
        {uniqueRisks.map((risk, index) => {
          return (
            <div key={index} className={playerNotesItem}>
              <div className={playerNotesDropdownIconContainer}>
                <PlayerNotesPropertyIcon property={risk.property} />
              </div>
              <div className={playerNotesItemContent}>
                <p>{risk.notes}</p>
                {risk.url && <ElementNewsLink href={risk.url} />}
              </div>
            </div>
          );
        })}
      </DisclosurePanel>
    </Disclosure>
  );
};

export default PlayerNotesDropdown;
