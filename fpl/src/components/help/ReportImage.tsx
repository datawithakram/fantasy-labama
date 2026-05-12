import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import { fetchEntrySummary } from "core-integration/src/store/entries/thunks";
import PageTitle from "plos/src/components/PageTitle";
import { contentMain, pagePadding } from "plos/src/layouts/layouts.css";
import qs from "qs";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { HelmetHead } from "../HelmetHead";
import ContactUs from "./ContactUs";
import { OffensiveCopyBadge } from "./OffensiveCopy";

const ReportImage = () => {
  const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  const entryId = Number(query.entryId) || 0;

  // Fetch entry in case of page reload / direct link
  const reduxDispatch = useDispatch<ThunkDispatch>();
  useEffect(() => {
    if (entryId) {
      reduxDispatch(fetchEntrySummary(entryId));
    }
  }, [entryId, reduxDispatch]);

  // Get entry summary for now. Delay rendering if not there.
  const entry = useSelector((state: RootState) =>
    entryId ? getEntry(state, entryId) : null
  );
  if (!entry) {
    return null;
  }

  const subject = `Report offensive Team Badge - Manager name: ${entry.player_first_name} ${entry.player_last_name}, Team ID: ${entry.id}, Team name: ${entry.name}`;

  return (
    <>
      <HelmetHead
        title="Report Offensive Badge | Fantasy Premier League"
        description="To find out how you can report an offensive badge in Fantasy Premier League, visit the official website of the Premier League."
      />
      <div className={`${contentMain} ${pagePadding}`}>
        <PageTitle title="Report Offensive Image" />
        <OffensiveCopyBadge />
        <ContactUs
          message="Please include any further details here"
          subject={subject}
          canCancel={true}
        />
      </div>
    </>
  );
};

export default ReportImage;
