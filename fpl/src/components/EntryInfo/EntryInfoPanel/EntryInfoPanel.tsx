import { entryInfoPanel, entryInfoPanelHeading } from "../entryInfo.css";
import { EntryInfoPanelProps } from "./types";

const EntryInfoPanel = ({
  title,
  headerAction,
  children,
}: EntryInfoPanelProps) => (
  <div className={entryInfoPanel}>
    <div className={entryInfoPanelHeading}>
      <h3>{title}</h3>
      {headerAction}
    </div>
    {children}
  </div>
);

export default EntryInfoPanel;
