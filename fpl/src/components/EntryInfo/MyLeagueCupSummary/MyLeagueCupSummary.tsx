import { RootState } from "core-integration/src/store";
import { getCupMatchesByLeagueId } from "core-integration/src/store/entries/reducers";
import { CupMatchesByLeagueId } from "core-integration/src/store/entries/types";
import RouterLink from "plos/src/components/links/RouterLink";
import { useSelector } from "react-redux";
import { getShortNameFromId } from "../../../utils/events";
import { getCupUrl } from "../../leagues/utils";
import { CupSummaryScore } from "../../LeaguesAndCups";
import { Result } from "../../Result";
import {
  leagueRow,
  leagueSummaryWrapper,
  leaguesWrapper,
  movementStyles,
} from "../LeagueSummary/leagueSummary.css";
import {
  CupSummaryDataProps,
  CupTypeRowProps,
  MyLeagueCupSummaryProps,
} from "../types";

const CupSummaryData = ({ match, entryId }: CupSummaryDataProps) => {
  const resultChar = match.winner === entryId ? "W" : match.winner ? "L" : "";
  return (
    <span className={movementStyles}>
      <span>{getShortNameFromId(match.event)}</span>
      {match.winner ? (
        <Result resultChar={resultChar} />
      ) : (
        <CupSummaryScore match={match} entryId={entryId} />
      )}
    </span>
  );
};

const CupTypeRow = ({ cupMatch, entryId, league }: CupTypeRowProps) => (
  <RouterLink
    className={leagueRow}
    to={getCupUrl(league.id, league.cup_league, entryId)}
  >
    {league.name} Cup
    <span className={movementStyles}>
      {cupMatch && league.cup_qualified ? (
        <CupSummaryData entryId={entryId} match={cupMatch} />
      ) : (
        ""
      )}
    </span>
  </RouterLink>
);

const MyLeagueCupSummary = ({
  leagues,
  title,
  entryId,
}: MyLeagueCupSummaryProps) => {
  const cupMatches: CupMatchesByLeagueId | null = useSelector(
    (state: RootState) =>
      entryId ? getCupMatchesByLeagueId(state, entryId) : null
  );
  return (
    <div className={leagueSummaryWrapper}>
      <h4>{title}</h4>
      <div className={leaguesWrapper}>
        {leagues.map((l) => (
          <CupTypeRow
            key={l.id}
            cupMatch={
              cupMatches && l.cup_league ? cupMatches[l.cup_league] : null
            }
            entryId={entryId}
            league={l}
          />
        ))}
      </div>
    </div>
  );
};

export default MyLeagueCupSummary;
