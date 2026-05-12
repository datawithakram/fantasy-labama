import { RootState, ThunkDispatch } from "core-integration/src/store";
import { joinPrivateLeague } from "core-integration/src/store/leagues/thunks";
import {
  getPlayerData,
  selectIsMyEntry,
} from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import { getRegions } from "core-integration/src/store/regions/reducers";
import { Button } from "plos/src/components/buttons/Button";
import RouterLink from "plos/src/components/links/RouterLink";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ukISOCodes } from "../../../utils/regions";
import Movement from "../../leagues/Movement";
import { getLeagueUrl } from "../../leagues/utils";
import { ILeagueSummaryProps, IRowProps, ITNTRowProps } from "../types";
import {
  leagueRow,
  leagueSummaryWrapper,
  leaguesWrapper,
  movementStyles,
  rank,
  tntLeagueRow,
} from "./leagueSummary.css";

const LeagueSummaryRow = ({ entry, leagueEntry }: IRowProps) => (
  <RouterLink
    className={leagueRow}
    to={getLeagueUrl(leagueEntry.id, leagueEntry.scoring, entry.id)}
  >
    {leagueEntry.name}

    <span className={movementStyles}>
      <span className={rank}>
        {leagueEntry.entry_rank
          ? leagueEntry.entry_rank.toLocaleString()
          : null}
      </span>
      <Movement
        lastRank={leagueEntry.entry_last_rank}
        rank={leagueEntry.entry_rank}
      />
    </span>
  </RouterLink>
);

export const TNTLeagueJoinRow = ({ leagues }: ITNTRowProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  );
  const regions = useSelector((state: RootState) => getRegions(state));

  const permittedRegionIds = regions
    .filter((region) => ukISOCodes.includes(region.iso_code_long))
    .map((region) => region.id);

  const hasTNTLeague = leagues.some(
    (league) =>
      league.name === "TNT Sports League" && league.league_type === "s"
  );
  const isEligibleRegion = permittedRegionIds.includes(Number(player?.region));

  if (hasTNTLeague || !isEligibleRegion) return null;

  return (
    <div className={tntLeagueRow}>
      <Button
        onPress={() => dispatch(joinPrivateLeague({ code: "tnt" }))}
        styleVariant="tonal"
        size="small"
      >
        Join TNT Sports League
      </Button>
    </div>
  );
};

const LeagueSummary = ({ leagues, title, entry }: ILeagueSummaryProps) => {
  const mine = useSelector((state: RootState) =>
    selectIsMyEntry(state, entry.id)
  );

  const sortedLeagues = useMemo(() => {
    return [...leagues].sort((a, b) => a.name.localeCompare(b.name));
  }, [leagues]);

  return (
    <div className={leagueSummaryWrapper}>
      <h4>{title}</h4>
      <div className={leaguesWrapper}>
        {sortedLeagues.map((l) => (
          <LeagueSummaryRow key={l.id} leagueEntry={l} entry={entry} />
        ))}
        {mine && title === "Broadcaster Leagues" && (
          <TNTLeagueJoinRow leagues={leagues} />
        )}
      </div>
    </div>
  );
};

export default LeagueSummary;
