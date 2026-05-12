import { visuallyHidden } from "plos/src/styles/utils.css";

/**
 * Screen-reader-only fixture label used in player sheets for fixture and history items and table cells.
 * @param name - Opponent team name.
 * @param isHome - Whether the fixture is at home.
 */
export const AccessibleFixtureText = ({
  name,
  isHome,
}: {
  name: string;
  isHome: boolean;
}) => (
  <span className={visuallyHidden}>{`${name}, ${
    isHome ? "Home" : "Away"
  }`}</span>
);
