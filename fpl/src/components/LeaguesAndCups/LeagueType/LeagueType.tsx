import { useMemo } from "react";
import LeagueTypePlaceholder from "./LeagueTypePlaceholder";
import LeagueTypeTable from "./LeagueTypeTable";
import { LeagueTypeTableProps } from "./types";

const LeagueType = ({ leagues, title }: LeagueTypeTableProps) => {
  const sortedLeagues = useMemo(() => {
    return [...leagues].sort((a, b) => a.name.localeCompare(b.name));
  }, [leagues]);

  return (
    <div>
      {leagues.length === 0 ? (
        <LeagueTypePlaceholder title={title} />
      ) : (
        <LeagueTypeTable leagues={sortedLeagues} title={title} />
      )}
    </div>
  );
};

export default LeagueType;
