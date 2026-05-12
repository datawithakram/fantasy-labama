import { RootState } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { adWrapper } from "./leaderboardAd.css";

interface IProps {
  id: string;
  slot: string;
  targetValue?: string;
}

const LeaderboardAd: React.FC<IProps> = ({ id, slot, targetValue = "" }) => {
  const player = useSelector(getPlayerData) as ILoggedInPlayer;
  const entry = useSelector((state: RootState) =>
    player && player.entry ? getEntry(state, player.entry) : null
  );
  const teamsById = useSelector(getTeamsById);

  // Loading of ad and cleanup goes in first useEffect effectively handling mount and unmount
  useEffect(() => {
    const googletag = (window as any).googletag;

    googletag?.cmd?.push(() => {
      const mapping = googletag
        .sizeMapping()
        .addSize([0, 0], [])
        .addSize(
          [200, 300],
          [
            [320, 50],
            [320, 480],
          ]
        )
        .addSize(
          [450, 300],
          [
            [320, 50],
            [1600, 900],
          ]
        )
        .addSize(
          [750, 300],
          [
            [728, 90],
            [1600, 900],
          ]
        )
        .addSize(
          [990, 300],
          [
            [1600, 900],
            [970, 250],
            [728, 90],
          ]
        )
        .build();
      googletag
        .defineSlot(
          `/131332370/${slot}`,
          [
            [320, 100],
            [728, 90],
            [970, 250],
            [320, 50],
          ],
          id
        )
        .defineSizeMapping(mapping)
        .addService(googletag.pubads());
      googletag.pubads().collapseEmptyDivs();
      googletag.enableServices();
    });
    // cleanup
    return () => {
      if (googletag && googletag.pubadsReady) {
        googletag.destroySlots();
      }
    };
  }, [slot, id]);

  if (!targetValue) {
    // targetValue will remain unset if entry is still being fetched so we can
    // delay showing the ad until it is ready
    if (!player || !player.entry) {
      targetValue = "general";
    } else if (entry) {
      targetValue = entry.favourite_team
        ? teamsById[entry.favourite_team].short_name
        : "general";
    }
  }
  // Showing of ad has to go in separate useEffect because can get called twice on pages like Points (component update)
  useEffect(() => {
    if (targetValue) {
      const googletag = (window as any).googletag;
      googletag?.cmd?.push(() => {
        googletag.pubads().setTargeting("section", targetValue);
        googletag.display(id);
      });
    }
  }, [id, targetValue]);

  return (
    <div className={adWrapper}>
      <div id={id} />
    </div>
  );
};

export default LeaderboardAd;
