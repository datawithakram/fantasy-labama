import ButtonLink from "plos/src/components/links/ButtonLink";
import { ChevronRight } from "../../icons/Chevrons";
import { footnote } from "../entryInfo.css";
import EntryInfoPanel from "../EntryInfoPanel";
import MyLeagueCupSummary from "../MyLeagueCupSummary";
import { CupsPanelProps } from "./types";

const CupsPanel = ({
  hasCupLeagues,
  broadcasterCupLeagues,
  entry,
  filteredSystemCupLeagues,
  privateClassicCupLeagues,
  publicClassicCupLeagues,
}: CupsPanelProps) => {
  const headerAction = (
    <ButtonLink styleVariant="tonal" size="small" to="/leagues">
      Create/Join Leagues
      <ChevronRight height={10} width={10} />
    </ButtonLink>
  );
  return (
    <EntryInfoPanel title="My Cups" headerAction={headerAction}>
      {hasCupLeagues && entry.id ? (
        <>
          {privateClassicCupLeagues.length > 0 && (
            <MyLeagueCupSummary
              entryId={entry.id}
              leagues={privateClassicCupLeagues.sort((a, b) =>
                a.name.localeCompare(b.name)
              )}
              title="League cups"
            />
          )}
          {publicClassicCupLeagues.length > 0 && (
            <MyLeagueCupSummary
              entryId={entry.id}
              leagues={publicClassicCupLeagues}
              title="Public cups"
            />
          )}
          {filteredSystemCupLeagues.length > 0 && (
            <MyLeagueCupSummary
              entryId={entry.id}
              leagues={filteredSystemCupLeagues}
              title="General cups"
            />
          )}
          {broadcasterCupLeagues.length > 0 && (
            <MyLeagueCupSummary
              entryId={entry.id}
              leagues={broadcasterCupLeagues}
              title="Broadcaster cups"
            />
          )}
        </>
      ) : (
        <p className={footnote}>None of your leagues have a cup yet.</p>
      )}
    </EntryInfoPanel>
  );
};

export default CupsPanel;
