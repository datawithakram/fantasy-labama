import { ReactNode } from "react";
import {
  buttonWrapper,
  callToActionContainer,
  headerWrapper,
  headingText,
} from "./leagueCallToAction.css";

interface LeagueCallToActionProps {
  heading: string;
  description: string;
  children: ReactNode;
}

const LeagueCallToAction = ({
  heading,
  description,

  children,
}: LeagueCallToActionProps) => {
  return (
    <div className={headerWrapper}>
      <div className={callToActionContainer}>
        <h3 className={headingText}>{heading}</h3>
        <p>{description}</p>
      </div>
      <div className={buttonWrapper}>{children}</div>
    </div>
  );
};
export default LeagueCallToAction;
