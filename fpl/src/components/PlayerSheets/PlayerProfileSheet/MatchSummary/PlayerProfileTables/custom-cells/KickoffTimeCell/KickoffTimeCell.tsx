import { formatRawAsLocal } from "core-integration/src/utils/datetime";
import { InfoText } from "plos/src/components/tooltips/InfoText";

interface KickoffTimeCellProps {
  kickoffTime: string | null;
}

const KickoffTimeCell = ({ kickoffTime }: KickoffTimeCellProps) => {
  return (
    <>
      {kickoffTime ? (
        <time dateTime={kickoffTime}>{formatRawAsLocal(kickoffTime)}</time>
      ) : (
        <InfoText label="Date To Be Confirmed">TBC</InfoText>
      )}
    </>
  );
};

export default KickoffTimeCell;
