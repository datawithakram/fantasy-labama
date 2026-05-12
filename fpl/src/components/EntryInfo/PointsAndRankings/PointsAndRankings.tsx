import { getTotalPlayers } from "core-integration/src/store/game/reducers";
import ButtonLink from "plos/src/components/links/ButtonLink";
import { useSelector } from "react-redux";
import { ChevronRight } from "../../icons/Chevrons";
import {
  dataList,
  dataListHeading,
  dataListItem,
  dataListValue,
} from "../entryInfo.css";
import EntryInfoPanel from "../EntryInfoPanel";
import { PointsAndRankingsProps } from "./types";

const PointsAndRankings = ({ entry }: PointsAndRankingsProps) => {
  const totalPlayers = useSelector(getTotalPlayers);

  const headerAction = (
    <ButtonLink
      styleVariant="tonal"
      size="small"
      to={`/entry/${entry.id}/history`}
    >
      Gameweek History
      <ChevronRight height={10} width={10} />
    </ButtonLink>
  );

  return (
    <EntryInfoPanel title="Points & Rankings" headerAction={headerAction}>
      <dl className={dataList}>
        {entry.summary_overall_points != null && (
          <div className={dataListItem}>
            <dt className={dataListHeading}>Overall points</dt>
            <dd className={dataListValue}>
              {entry.summary_overall_points.toLocaleString()}
            </dd>
          </div>
        )}
        {entry.summary_overall_rank != null && (
          <div className={dataListItem}>
            <dt className={dataListHeading}>Overall rank</dt>
            <dd className={dataListValue}>
              {entry.summary_overall_rank.toLocaleString()}
            </dd>
          </div>
        )}
        <div className={dataListItem}>
          <dt className={dataListHeading}>Total players</dt>
          <dd className={dataListValue}>{totalPlayers?.toLocaleString()}</dd>
        </div>
        {entry.summary_event_points != null && (
          <div className={dataListItem}>
            <dt className={dataListHeading}>Gameweek points</dt>
            <dd className={dataListValue}>{entry.summary_event_points}</dd>
          </div>
        )}
      </dl>
    </EntryInfoPanel>
  );
};

export default PointsAndRankings;
