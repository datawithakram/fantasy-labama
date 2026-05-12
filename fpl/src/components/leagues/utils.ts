import { ILeagueEntry } from "core-integration/src/store/entries/types";

export const getLeagueUrl = (
  id: number,
  scoring: string,
  defaultEntry?: number
) =>
  scoring === "h"
    ? `/leagues/${id}/matches/${scoring}${
        defaultEntry ? `?default_entry=${defaultEntry}` : ""
      }`
    : `/leagues/${id}/standings/${scoring}`;

export const getBroadcasterLeagues = (systemClassicLeagues: ILeagueEntry[]) => {
  // Extract any broadcaster leagues
  const broadcasterLeagueMatch = /^(brd-|man-brd-)/;
  // Please note the "!" non-null assertion operator on the filter
  return systemClassicLeagues.filter((l) =>
    l.short_name!.match(broadcasterLeagueMatch)
  );
};

export const getFilteredSystemClassicLeagues = (
  systemClassicLeagues: ILeagueEntry[],
  broadcasterLeagues: ILeagueEntry[]
) =>
  systemClassicLeagues.filter(
    (l) => !broadcasterLeagues.length || broadcasterLeagues.indexOf(l) === -1
  );

export const getCupUrl = (
  leagueId: number,
  cup_league: number | null,
  entryId?: number
) => {
  const linkUrl = `/leagues/${leagueId}/cup`;
  if (!cup_league) {
    return `${linkUrl}-not-started`;
  }
  if (entryId) {
    return `${linkUrl}?entry=${entryId}`;
  }
  return linkUrl;
};
