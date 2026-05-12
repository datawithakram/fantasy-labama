import { ILeague } from "core-integration/src/store/leagues/types";
import ButtonLink from "plos/src/components/links/ButtonLink";

interface ReportNameButtonProps {
  entryId?: number;
  league?: ILeague;
}

const ReportNameButton = ({ entryId, league }: ReportNameButtonProps) => {
  // We only want one or the other so return nothing if both or neither.
  if ((entryId && league) || (!entryId && !league)) {
    return null;
  }
  return (
    <ButtonLink
      to={`/help/report-name?${entryId ? `entryId=${entryId}` : ""}${
        league ? `leagueId=${league.id}&leagueName=${league.name}` : ""
      }`}
      styleVariant="outlined"
      size="small"
      fullWidth
    >
      Report Offensive Name
    </ButtonLink>
  );
};
export default ReportNameButton;
