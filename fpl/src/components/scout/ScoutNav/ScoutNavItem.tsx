import { forwardRef } from "react";
import { NavLink } from "react-router";
import { navItemStyles } from "../../GameHeader/Nav/NavItem/NavItem.css";
import { activeScoutLinkStyles, scoutNavLinkStyles } from "./scoutNav.css";
import { ScoutNavLink } from "./types";

const ScoutNavItem = forwardRef<HTMLLIElement, ScoutNavLink>(
  ({ text, href, exact = false }, ref) => (
    <li className={navItemStyles} ref={ref}>
      <NavLink
        className={({ isActive }) =>
          `${scoutNavLinkStyles} ${isActive ? activeScoutLinkStyles : ""}`
        }
        to={href}
        end={exact}
      >
        {text}
      </NavLink>
    </li>
  )
);

export default ScoutNavItem;
