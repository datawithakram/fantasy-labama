import { Badge } from "plos/src/components/Badge";
import ButtonLink from "plos/src/components/links/ButtonLink";
import { ChevronRight } from "../../icons/Chevrons";
import { getLeagueUrl } from "../../leagues/utils";
import EntryInfoPanel from "../EntryInfoPanel";
import { fanLeagueBadge } from "./fanLeague.css";
import { FanLeagueProps } from "./types";

const FanLeague = ({ fanLeagueData }: FanLeagueProps) => {
  if (!fanLeagueData?.league || !fanLeagueData?.team) {
    return null;
  }
  const headerAction = (
    <ButtonLink
      styleVariant="tonal"
      size="small"
      to={getLeagueUrl(fanLeagueData.league.id, fanLeagueData.league.scoring)}
    >
      View League
      <ChevronRight height={10} width={10} />
    </ButtonLink>
  );

  return (
    <EntryInfoPanel title="Fan League" headerAction={headerAction}>
      <div className={fanLeagueBadge}>
        <Badge team={fanLeagueData.team} />
      </div>
    </EntryInfoPanel>
  );
};

export default FanLeague;
