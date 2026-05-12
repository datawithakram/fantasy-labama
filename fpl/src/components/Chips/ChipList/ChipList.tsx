import { RootState } from "core-integration/src/store";
import { getPotentialChips } from "core-integration/src/store/chips/reducers";
import { IPotentialChip } from "core-integration/src/store/chips/types";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { getMyPicksProposed } from "core-integration/src/store/my-team/reducers";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { ILoggedInPlayer } from "core-integration/src/store/player/types";
import { Fragment, useState } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router";
import { getChipName } from "../../../utils/chips";
import ChipCard from "../ChipCard";
import { ChipSheet } from "../ChipSheet";
import { chipCardLink, listStyles } from "./chipList.css";
import { IChipList } from "./types";

const ChipList = ({ chipsShown = "all" }: IChipList) => {
  const [selectedChip, setSelectedChip] = useState<IPotentialChip | null>(null);
  const player = useSelector(
    (state: RootState) => getPlayerData(state) as ILoggedInPlayer
  );
  const entry = useSelector((state: RootState) =>
    getEntry(state, player.entry)
  );
  const potentialChips = useSelector(getPotentialChips);
  const picks = useSelector(getMyPicksProposed);

  if (!entry || !picks.length) {
    return null;
  }

  const getSortedChips = () => {
    const chipsByName = potentialChips.reduce<Record<string, IPotentialChip>>(
      (acc, c) => {
        acc[c.name] = c;
        return acc;
      },
      {}
    );
    const sortedChipNames = [
      ...(chipsShown === "all" ? ["bboost", "3xc"] : []),
      "wildcard",
      "freehit",
    ];

    // filter because transfers chips aren't returned pre-rollover
    return sortedChipNames
      .filter((name) => chipsByName[name])
      .map((name) => chipsByName[name]);
  };

  const chipCardVariant = chipsShown === "all" ? "responsive" : "default";

  return (
    <>
      <ul className={listStyles}>
        {getSortedChips().map((c) => {
          const chipId = `ism-${c.name}`;
          return (
            <Fragment key={chipId}>
              {c.status_for_entry === "played" ? (
                <RouterLink
                  className={chipCardLink[chipCardVariant]}
                  to={`/entry/${entry.id}/event/${c.played_by_entry[0]}`}
                >
                  <ChipCard
                    chip={c}
                    title={getChipName(c.name)}
                    variant={chipCardVariant}
                  />
                </RouterLink>
              ) : (
                <ChipCard
                  chip={c}
                  onClick={() => setSelectedChip(c)}
                  title={getChipName(c.name)}
                  variant={chipCardVariant}
                />
              )}
            </Fragment>
          );
        })}
      </ul>
      <ChipSheet chip={selectedChip} setChip={setSelectedChip} />
    </>
  );
};

export default ChipList;
