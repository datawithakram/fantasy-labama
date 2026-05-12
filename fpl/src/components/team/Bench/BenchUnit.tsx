import { RootState, ThunkDispatch } from "core-integration/src/store";
import { getActiveChip } from "core-integration/src/store/chips/reducers";
import { getElementTypesById } from "core-integration/src/store/element-types/reducers";
import { getElement } from "core-integration/src/store/elements/reducers";
import { actionSubstitution } from "core-integration/src/store/my-team/thunks";
import TeamPitchElement from "plos/src/components/TeamPitchElement";
import { InfoText } from "plos/src/components/tooltips/InfoText";
import { useDispatch, useSelector } from "react-redux";
import { benchUnitHeading } from "./bench.css";
import { BenchUnitProps } from "./types";
const BenchUnit = ({
  index,
  pick,
  renderDreamTeam,
  renderElementMenu,
  renderPickValue,
}: BenchUnitProps) => {
  const activeChip = useSelector(getActiveChip);
  const element = useSelector((state: RootState) =>
    getElement(state, pick.element)
  );
  const elementTypesById = useSelector((state: RootState) =>
    getElementTypesById(state, undefined, activeChip?.id)
  );
  const reduxDispatch = useDispatch<ThunkDispatch>();

  if (!element) {
    return null;
  }
  const elementType = elementTypesById[element.element_type];
  return (
    <div>
      <h5 className={benchUnitHeading}>
        {index ? `${index}. ` : ""}
        <InfoText label={elementType.singular_name}>
          {elementType.singular_name_short}
        </InfoText>
      </h5>
      <TeamPitchElement
        actionMe={() => reduxDispatch(actionSubstitution(pick.element))}
        pick={pick}
        renderDreamTeam={renderDreamTeam}
        renderElementMenu={() => renderElementMenu(pick)}
        renderPickValue={renderPickValue}
      />
    </div>
  );
};

export default BenchUnit;
