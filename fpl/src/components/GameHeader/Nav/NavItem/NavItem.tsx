import { INavLink } from "core-integration/src/hooks/types";
import { forwardRef } from "react";
import { NavLink } from "react-router";
import { activeLinkStyles, navItemStyles, navLinkStyles } from "./NavItem.css";

const NavItem = forwardRef<HTMLLIElement, INavLink>(
  ({ text, href, rel, useRouter }, ref) => (
    <li className={navItemStyles} ref={ref}>
      {useRouter ? (
        <NavLink
          className={({ isActive }) =>
            `${navLinkStyles} ${isActive ? activeLinkStyles : ""}`
          }
          to={href}
        >
          {text}
        </NavLink>
      ) : (
        <a className={navLinkStyles} href={href} target="_blank" rel={rel}>
          {text}
        </a>
      )}
    </li>
  )
);

export default NavItem;
