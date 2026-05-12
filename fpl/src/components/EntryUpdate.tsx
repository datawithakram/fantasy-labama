import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import type { EntryCrestData } from "core-integration/src/store/ui";
import { fetchEntrySummary } from "core-integration/src/store/entries/thunks";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import PageTitle from "plos/src/components/PageTitle";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { entryEventMain, leftSidebarLayout } from "plos/src/layouts";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAdobeContext } from "../contexts/AdobeContext";
import CrestPanel from "./EntryInfo/CrestPanel";
import { HelmetHead } from "./HelmetHead";
import { UpdateTeamDetails } from "./UpdateTeamDetails";

const EntryUpdate = () => {
  const dispatch = useDispatch<ThunkDispatch>();
  const { enabled } = useAdobeContext();

  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  );
  const entry = useSelector((state: RootState) =>
    getEntry(state, player.entry)
  );

  useEffect(() => {
    dispatch(fetchEntrySummary(player.entry));
  }, [dispatch, player.entry]);

  if (!entry) return null;

  // Pass only the crest-related subset so CrestPanel stays decoupled from full IEntry.
  const entryCrestData: EntryCrestData = {
    id: entry.id,
    name: entry.name,
    club_badge_src: entry.club_badge_src,
  };

  return (
    <div>
      <HelmetHead
        title="Fantasy Football Team Details | Fantasy Premier League"
        description="To view your team details including team name and shirt colour, visit the official website of the Premier League."
      />
      <div className={visuallyHidden}>
        <PageTitle title="Team Details" />
      </div>
      <div className={leftSidebarLayout}>
        <section className={entryEventMain}>
          <UpdateTeamDetails entry={entry} />
        </section>
        <section>
          <SurfaceContainer>
            {enabled && <CrestPanel entryCrestData={entryCrestData} />}
          </SurfaceContainer>
        </section>
      </div>
    </div>
  );
};

export default EntryUpdate;
