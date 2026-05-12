import { ReactNode } from "react";
import { matchGroup, matchList, titleStyles } from "./styles.css";

interface MatchGroupProps {
  title: string;
  children: ReactNode;
  direction?: "rtl" | "ltr";
}

const MatchGroup = ({
  title,
  direction = "ltr",
  children,
}: MatchGroupProps) => {
  return (
    <div className={matchGroup}>
      <h2 className={titleStyles}>{title}</h2>
      <ul className={matchList[direction]}>{children}</ul>
    </div>
  );
};

export default MatchGroup;
