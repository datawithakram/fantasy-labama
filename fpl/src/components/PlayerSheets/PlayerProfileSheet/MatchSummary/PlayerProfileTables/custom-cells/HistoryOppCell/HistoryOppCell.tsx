import { IElementHistory } from "core-integration/src/store/elements/types";
import { ITeam } from "core-integration/src/store/teams/types";
import { Badge } from "plos/src/components/Badge";
import { getSuffixFromId } from "../../../../../../utils/fixtures";
import { AccessibleFixtureText } from "../../../../../AccessibleFixtureText";
import { badgeWrap } from "../../tableStyles.css";
import { oppTeamStyles } from "./historyOppCell.css";

const HistoryOppCell = ({
  oppTeam,
  history,
}: {
  oppTeam: ITeam;
  history: IElementHistory;
}) => {
  const { name, short_name: shortName } = oppTeam;
  const { fixture, was_home: wasHome } = history;

  return (
    <span className={oppTeamStyles}>
      <span className={badgeWrap}>
        <Badge team={oppTeam} isPresentation />
      </span>
      <span aria-hidden="true">
        {`${shortName} ${getSuffixFromId(fixture, wasHome)}`}
      </span>
      <AccessibleFixtureText name={name} isHome={wasHome} />
    </span>
  );
};

export default HistoryOppCell;
