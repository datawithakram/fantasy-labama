import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { fetchEntrySummary } from "core-integration/src/store/entries/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import type { EntryCrestData } from "core-integration/src/store/ui";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdobeStandalone from "./AdobeStandalone";

const CrestCreate = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const player = useSelector(getPlayerData) as ILoggedInPlayer;

  // Entry Route so we can assert player.entry
  const entry = useSelector((state: RootState) =>
    getEntry(state, player.entry!)
  );

  useEffect(() => {
    dispatch(fetchEntrySummary(player.entry));
  }, [dispatch, player.entry]);

  if (!entry) {
    return null;
  }

  // Pass only the crest-related subset so AdobeStandalone stays decoupled from full IEntry.
  const entryCrestData: EntryCrestData = {
    id: entry.id,
    name: entry.name,
    club_badge_src: entry.club_badge_src,
  };

  return <AdobeStandalone entryCrestData={entryCrestData} />;
};

export default CrestCreate;
