import { HeadingInContainer } from "plos/src/components/HeadingInContainer";
import { SurfaceContainer } from "plos/src/components/SurfaceContainer";
import { statusPanelWrap } from "./statusPanel.css";
import { StatusPanelProps } from "./types";

const StatusPanel = ({ title, url, children }: StatusPanelProps) => {
  return (
    <SurfaceContainer>
      <div className={statusPanelWrap}>
        <HeadingInContainer title={title} url={url} />
        {children}
      </div>
    </SurfaceContainer>
  );
};
export default StatusPanel;
