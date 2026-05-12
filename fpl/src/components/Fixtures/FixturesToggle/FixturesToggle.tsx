import { ToggleButton } from "plos/src/components/ToggleButton";
import { ToggleButtonGroup } from "plos/src/components/ToggleButtonGroup";
import { toggleWrapper } from "plos/src/components/ToggleButtonGroup/toggleButtonGroup.css";
import { Key } from "react";
import { useNavigate } from "react-router";

type FixturesView = "fixtures" | "fdr";

const linksDict = {
  fixtures: "/fixtures",
  fdr: "/fixtures/fdr",
};

interface FixturesToggleProps {
  selected: FixturesView;
}

const FixturesToggle = ({ selected }: FixturesToggleProps) => {
  const navigate = useNavigate();

  const handleToggleChange = (keys: Set<Key>) => {
    const key = Array.from(keys)[0] as FixturesView;
    if (key) {
      navigate(linksDict[key]);
    }
  };

  return (
    <div className={toggleWrapper}>
      <ToggleButtonGroup
        selectedKeys={new Set([selected])}
        onSelectionChange={handleToggleChange}
      >
        <ToggleButton id={"fixtures"}>Fixtures</ToggleButton>
        <ToggleButton id={"fdr"}>FDR</ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
};

export default FixturesToggle;
