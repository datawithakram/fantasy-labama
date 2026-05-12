import ButtonLink from "plos/src/components/links/ButtonLink";
import React from "react";

interface IProps {
  entryId?: number;
}

const ReportCrestButton: React.FC<IProps> = ({ entryId }) => {
  if (!entryId) {
    return null;
  }
  return (
    <ButtonLink
      to={`/help/report-badge?${entryId ? `entryId=${entryId}` : ""}`}
      styleVariant="outlined"
      size="small"
      fullWidth
    >
      Report Offensive Team Badge
    </ButtonLink>
  );
};
export default ReportCrestButton;
