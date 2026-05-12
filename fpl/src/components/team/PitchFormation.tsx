import { ThunkDispatch } from "core-integration/src/store";
import { IPickLight } from "core-integration/src/store/entries/types";
import { actionSubstitution } from "core-integration/src/store/my-team/thunks";
import {
  defenderRow,
  forwardsRow,
  goalkeeperRow,
  midfielderRow,
} from "plos/src/components/Pitch/Pitch.css";
import PitchUnit from "plos/src/components/Pitch/PitchUnit";
import TeamPitchElement from "plos/src/components/TeamPitchElement";
import { ReactNode, useCallback } from "react";
import { useDispatch } from "react-redux";

interface IFormationProps {
  generateProps: (i: number) => {
    actionMe: () => void;
    chipName: string | null;
    eventId?: number;
    pick: IPickLight;
    renderDreamTeam: (pick: IPickLight) => ReactNode;
    renderElementMenu: () => void;
    renderPickValue: (pick: IPickLight) => ReactNode;
  };
}

const FiveFourOne = ({ generateProps }: IFormationProps) => (
  <>
    <div className={goalkeeperRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(0)} />
      </PitchUnit>
    </div>
    <div className={defenderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(1)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(2)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(3)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(4)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(5)} />
      </PitchUnit>
    </div>
    <div className={midfielderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(6)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(7)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(8)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(9)} />
      </PitchUnit>
    </div>
    <div className={forwardsRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(10)} />
      </PitchUnit>
    </div>
  </>
);

const FiveThreeTwo = ({ generateProps }: IFormationProps) => (
  <>
    <div className={goalkeeperRow}>
      <TeamPitchElement {...generateProps(0)} />
    </div>
    <div className={defenderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(1)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(2)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(3)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(4)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(5)} />
      </PitchUnit>
    </div>
    <div className={midfielderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(6)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(7)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(8)} />
      </PitchUnit>
    </div>
    <div className={forwardsRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(9)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(10)} />
      </PitchUnit>
    </div>
  </>
);

const FiveTwoThree = ({ generateProps }: IFormationProps) => (
  <>
    <div className={goalkeeperRow}>
      <TeamPitchElement {...generateProps(0)} />
    </div>
    <div className={defenderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(1)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(2)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(3)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(4)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(5)} />
      </PitchUnit>
    </div>
    <div className={midfielderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(6)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(7)} />
      </PitchUnit>
    </div>
    <div className={forwardsRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(8)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(9)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(10)} />
      </PitchUnit>
    </div>
  </>
);

const FourFiveOne = ({ generateProps }: IFormationProps) => (
  <>
    <div className={goalkeeperRow}>
      <TeamPitchElement {...generateProps(0)} />
    </div>
    <div className={defenderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(1)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(2)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(3)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(4)} />
      </PitchUnit>
    </div>
    <div className={midfielderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(5)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(6)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(7)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(8)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(9)} />
      </PitchUnit>
    </div>
    <div className={forwardsRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(10)} />
      </PitchUnit>
    </div>
  </>
);

const FourThreeThree = ({ generateProps }: IFormationProps) => (
  <>
    <div className={goalkeeperRow}>
      <TeamPitchElement {...generateProps(0)} />
    </div>
    <div className={defenderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(1)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(2)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(3)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(4)} />
      </PitchUnit>
    </div>
    <div className={midfielderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(5)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(6)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(7)} />
      </PitchUnit>
    </div>
    <div className={forwardsRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(8)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(9)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(10)} />
      </PitchUnit>
    </div>
  </>
);

const FourFourTwo = ({ generateProps }: IFormationProps) => (
  <>
    <div className={goalkeeperRow}>
      <TeamPitchElement {...generateProps(0)} />
    </div>
    <div className={defenderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(1)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(2)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(3)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(4)} />
      </PitchUnit>
    </div>
    <div className={midfielderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(5)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(6)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(7)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(8)} />
      </PitchUnit>
    </div>
    <div className={forwardsRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(9)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(10)} />
      </PitchUnit>
    </div>
  </>
);

const ThreeFourThree = ({ generateProps }: IFormationProps) => (
  <>
    <div className={goalkeeperRow}>
      <TeamPitchElement {...generateProps(0)} />
    </div>
    <div className={defenderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(1)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(2)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(3)} />
      </PitchUnit>
    </div>
    <div className={midfielderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(4)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(5)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(6)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(7)} />
      </PitchUnit>
    </div>
    <div className={forwardsRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(8)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(9)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(10)} />
      </PitchUnit>
    </div>
  </>
);

const ThreeFiveTwo = ({ generateProps }: IFormationProps) => (
  <>
    <div className={goalkeeperRow}>
      <TeamPitchElement {...generateProps(0)} />
    </div>
    <div className={defenderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(1)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(2)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(3)} />
      </PitchUnit>
    </div>
    <div className={midfielderRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(4)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(5)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(6)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(7)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(8)} />
      </PitchUnit>
    </div>
    <div className={forwardsRow}>
      <PitchUnit>
        <TeamPitchElement {...generateProps(9)} />
      </PitchUnit>
      <PitchUnit>
        <TeamPitchElement {...generateProps(10)} />
      </PitchUnit>
    </div>
  </>
);

interface IProps {
  chipName: string | null;
  eventId?: number;
  formation: string;
  picks: IPickLight[];
  renderDreamTeam: (pick: IPickLight) => ReactNode;
  renderElementMenu: (element: number) => void;
  renderPickValue: (pick: IPickLight) => ReactNode;
}

interface IFormations {
  [key: string]: ReactNode;
}

const PitchFormation = ({
  chipName,
  eventId,
  formation,
  picks,
  renderDreamTeam,
  renderElementMenu,
  renderPickValue,
}: IProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const substitute = useCallback(
    (elementId: number) => dispatch(actionSubstitution(elementId)),
    [dispatch]
  );

  const sharedTeamPitchElementProps = (i: number) => ({
    actionMe: () => substitute(picks[i].element),
    chipName,
    eventId,
    pick: picks[i],
    renderDreamTeam,
    renderElementMenu: () => renderElementMenu(picks[i].element),
    renderPickValue,
  });

  const formations: IFormations = {
    "1-5-4-1": <FiveFourOne generateProps={sharedTeamPitchElementProps} />,
    "1-5-3-2": <FiveThreeTwo generateProps={sharedTeamPitchElementProps} />,
    "1-5-2-3": <FiveTwoThree generateProps={sharedTeamPitchElementProps} />,
    "1-4-5-1": <FourFiveOne generateProps={sharedTeamPitchElementProps} />,
    "1-4-4-2": <FourFourTwo generateProps={sharedTeamPitchElementProps} />,
    "1-4-3-3": <FourThreeThree generateProps={sharedTeamPitchElementProps} />,
    "1-3-5-2": <ThreeFiveTwo generateProps={sharedTeamPitchElementProps} />,
    "1-3-4-3": <ThreeFourThree generateProps={sharedTeamPitchElementProps} />,
  };
  return <>{formations[formation]}</>;
};

export default PitchFormation;
