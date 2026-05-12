import { RootState, ThunkDispatch } from "core-integration/src/store";
import {
  getEntry,
  getPrivateClassicCupLeaguesForEntry,
  getPrivateClassicLeaguesForEntry,
  getPrivateH2HLeaguesForEntry,
  getPublicClassicCupLeaguesForEntry,
  getPublicClassicLeaguesForEntry,
  getPublicH2HLeaguesForEntry,
  getSystemClassicCupLeaguesForEntry,
  getSystemClassicLeaguesForEntry,
} from "core-integration/src/store/entries/reducers";
import { fetchEntrySummary } from "core-integration/src/store/entries/thunks";
import { fetchMyTeam } from "core-integration/src/store/my-team/thunks";
import { selectIsMyEntry } from "core-integration/src/store/player/reducers";
import { getTransferState } from "core-integration/src/store/squad/reducers";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBroadcasterLeagues,
  getFilteredSystemClassicLeagues,
} from "../../leagues/utils";
import { IFanLeagueData } from "../types";

export const useEntryInfo = (entryId: number) => {
  const dispatch = useDispatch<ThunkDispatch>();

  // Core entry data
  const entry = useSelector((state: RootState) => getEntry(state, entryId));
  const mine = useSelector((state: RootState) =>
    selectIsMyEntry(state, entryId)
  );
  const transfersState = useSelector(getTransferState);
  const teamsById = useSelector(getTeamsById);

  // League data
  const systemClassicLeagues = useSelector((state: RootState) =>
    getSystemClassicLeaguesForEntry(state, entryId)
  );
  const privateClassicLeagues = useSelector((state: RootState) =>
    getPrivateClassicLeaguesForEntry(state, entryId)
  );
  const privateH2HLeagues = useSelector((state: RootState) =>
    getPrivateH2HLeaguesForEntry(state, entryId)
  );
  const publicClassicLeagues = useSelector((state: RootState) =>
    getPublicClassicLeaguesForEntry(state, entryId)
  );
  const publicH2HLeagues = useSelector((state: RootState) =>
    getPublicH2HLeaguesForEntry(state, entryId)
  );
  const privateClassicCupLeagues = useSelector((state: RootState) =>
    getPrivateClassicCupLeaguesForEntry(state, entryId)
  );
  const publicClassicCupLeagues = useSelector((state: RootState) =>
    getPublicClassicCupLeaguesForEntry(state, entryId)
  );
  const systemClassicCupLeagues = useSelector((state: RootState) =>
    getSystemClassicCupLeaguesForEntry(state, entryId)
  );

  // Process derived data
  const broadcasterLeagues = getBroadcasterLeagues(systemClassicLeagues);
  const filteredSystemClassicLeagues = getFilteredSystemClassicLeagues(
    systemClassicLeagues,
    broadcasterLeagues
  );
  const broadcasterCupLeagues = getBroadcasterLeagues(systemClassicCupLeagues);
  const filteredSystemCupLeagues = getFilteredSystemClassicLeagues(
    systemClassicCupLeagues,
    broadcasterCupLeagues
  );

  const hasCupLeagues =
    privateClassicCupLeagues.length > 0 ||
    publicClassicCupLeagues.length > 0 ||
    systemClassicCupLeagues.length > 0 ||
    broadcasterCupLeagues.length > 0;

  // Process fan league data
  const fanLeagueData: IFanLeagueData = {
    league: null,
    team: null,
  };
  const FAN_LEAGUE_PATTERN = /^team-(\d+)$/;
  const fanLeagues = systemClassicLeagues.filter((l) =>
    l.short_name?.match(FAN_LEAGUE_PATTERN)
  );

  if (fanLeagues.length) {
    const match = fanLeagues[0].short_name?.match(FAN_LEAGUE_PATTERN);
    if (match) {
      fanLeagueData.league = fanLeagues[0];
      fanLeagueData.team = teamsById[match[1]];
    }
  }

  useEffect(() => {
    if (mine && !transfersState) {
      dispatch(fetchMyTeam());
    }
    if (!entry) {
      dispatch(fetchEntrySummary(entryId));
    }
  }, [dispatch, entry, entryId, mine, transfersState]);

  return {
    // Core data
    entry,
    mine,
    transfersState,

    // League data
    broadcasterLeagues,
    filteredSystemClassicLeagues,
    privateClassicLeagues,
    privateH2HLeagues,
    publicClassicLeagues,
    publicH2HLeagues,
    broadcasterCupLeagues,
    filteredSystemCupLeagues,
    privateClassicCupLeagues,
    publicClassicCupLeagues,
    hasCupLeagues,

    // Fan league data
    fanLeagueData,
  };
};
