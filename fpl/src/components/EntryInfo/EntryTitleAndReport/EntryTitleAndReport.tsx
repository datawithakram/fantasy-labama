import { RootState } from "core-integration/src/store";
import type { EntryCrestData } from "core-integration/src/store/ui";
import { selectIsMyEntry } from "core-integration/src/store/player/reducers";
import EntryTitle from "plos/src/components/entry/EntryTitle";
import { useSelector } from "react-redux";
import { EntryCrest } from "../../crests/EntryCrest";
import ReportNameButton from "../../ReportNameButton";
import {
  entryTitleAndReportStyles,
  entryTitleWrapperHeader,
} from "./entryTitleAndReport.css";
import { EntryTitleAndReportProps } from "./types";

const EntryTitleAndReport = ({ entry }: EntryTitleAndReportProps) => {
  const { id: entryId } = entry;
  const mine = useSelector((state: RootState) =>
    selectIsMyEntry(state, entryId)
  );
  const entryCrestData: EntryCrestData = {
    id: entry.id,
    name: entry.name,
    club_badge_src: entry.club_badge_src,
  };

  return (
    <div className={entryTitleAndReportStyles}>
      <div className={entryTitleWrapperHeader}>
        <EntryCrest entryCrestData={entryCrestData} dimension={48} />
        <EntryTitle entryId={entryId} />
      </div>
      {!mine && <ReportNameButton entryId={entryId} />}
    </div>
  );
};

export default EntryTitleAndReport;
