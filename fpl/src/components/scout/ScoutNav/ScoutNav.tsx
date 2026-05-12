import { subNavStyles } from "../../GameHeader/Nav/Nav.css";
import ScoutNavItem from "./ScoutNavItem";

const ScoutNav = () => {
  const links = [
    { href: "/the-scout", text: "News", exact: true },
    { href: "/the-scout/set-piece-takers", text: "Set-Pieces" },
    { href: "/the-scout/player-news", text: "Availability" },
  ];
  return (
    <ul className={subNavStyles}>
      {links.map((link) => (
        <ScoutNavItem {...link} key={link.text} />
      ))}
    </ul>
  );
};

export default ScoutNav;
