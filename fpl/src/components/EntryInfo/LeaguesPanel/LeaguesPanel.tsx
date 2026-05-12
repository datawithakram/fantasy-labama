import ButtonLink from "plos/src/components/links/ButtonLink";
import { ChevronRight } from "../../icons/Chevrons";
import EntryInfoPanel from "../EntryInfoPanel";
import LeagueSummary from "../LeagueSummary";
import { LeaguesPanelProps } from "./types";

const LeaguesPanel = ({
  entry,
  broadcasterLeagues,
  filteredSystemClassicLeagues,
  privateClassicLeagues,
  privateH2HLeagues,
  publicClassicLeagues,
  publicH2HLeagues,
}: LeaguesPanelProps) => {
  const headerAction = (
    <ButtonLink styleVariant="tonal" size="small" to="/leagues">
      Create/Join Leagues
      <ChevronRight height={10} width={10} />
    </ButtonLink>
  );

  return (
    <EntryInfoPanel title="My Leagues" headerAction={headerAction}>
      {broadcasterLeagues.length > 0 && (
        <LeagueSummary
          title="Broadcaster Leagues"
          leagues={broadcasterLeagues}
          entry={entry}
        />
      )}
      {privateClassicLeagues.length > 0 && (
        <LeagueSummary
          title="Invitational Classic Leagues"
          leagues={privateClassicLeagues}
          entry={entry}
        />
      )}
      {privateH2HLeagues.length > 0 && (
        <LeagueSummary
          title="Invitational Head-to-Head Leagues"
          leagues={privateH2HLeagues}
          entry={entry}
        />
      )}
      {publicClassicLeagues.length > 0 && (
        <LeagueSummary
          title="Public Classic Leagues"
          leagues={publicClassicLeagues}
          entry={entry}
        />
      )}
      {publicH2HLeagues.length > 0 && (
        <LeagueSummary
          title="Public Head-to-Head Leagues"
          leagues={publicH2HLeagues}
          entry={entry}
        />
      )}
      <LeagueSummary
        title="General Leagues"
        leagues={filteredSystemClassicLeagues}
        entry={entry}
      />
    </EntryInfoPanel>
  );
};

export default LeaguesPanel;
