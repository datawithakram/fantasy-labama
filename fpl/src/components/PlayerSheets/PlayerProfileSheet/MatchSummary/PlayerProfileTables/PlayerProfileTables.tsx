import { IElement } from "core-integration/src/store/elements/types";
import { ToggleButton } from "plos/src/components/ToggleButton";
import { ToggleButtonGroup } from "plos/src/components/ToggleButtonGroup";
import { Key, useState } from "react";
import EventHistoryTable from "./EventHistoryTable/EventHistoryTable";
import FixturesTable from "./FixturesTable/FixturesTable";
import SeasonHistoryTable from "./SeasonHistoryTable/SeasonHistoryTable";
import {
  historyTablesWrapper,
  playerProfileTablesWrapper,
  tablesWrapper,
  toggleButtonGroupWrapper,
} from "./tableStyles.css";

type TableView = "history" | "fixtures";

interface TablesProps {
  element: IElement;
}

const PlayerProfileTables = ({ element }: TablesProps) => {
  const [tableView, setTableView] = useState<TableView>("history");
  const elementId = element.id;

  const handleSelectionChange = (keys: Set<Key>) => {
    const key = Array.from(keys)[0] as TableView;
    if (key) {
      setTableView(key);
    }
  };

  return (
    <div className={playerProfileTablesWrapper}>
      <div className={toggleButtonGroupWrapper}>
        <ToggleButtonGroup
          selectedKeys={new Set([tableView])}
          onSelectionChange={handleSelectionChange}
        >
          <ToggleButton id={"history"}>History</ToggleButton>
          <ToggleButton id={"fixtures"}>Fixtures</ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className={tablesWrapper}>
        {tableView === "history" && (
          <div className={historyTablesWrapper}>
            <EventHistoryTable elementId={elementId} />
            <SeasonHistoryTable elementId={elementId} />
          </div>
        )}
        {tableView === "fixtures" && <FixturesTable element={element} />}
      </div>
    </div>
  );
};

export default PlayerProfileTables;
