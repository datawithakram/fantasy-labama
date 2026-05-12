import { INavLink } from "core-integration/src/hooks/types";
import { RootState } from "core-integration/src/store";
import { getEntry } from "core-integration/src/store/entries/reducers";
import {
  getCurrentEvent,
  getNextEvent,
} from "core-integration/src/store/events/reducers";
import { getServerError } from "core-integration/src/store/global/reducers";
import { getPlayerData } from "core-integration/src/store/player/reducers";
import { maxWidthContainer } from "plos/src/layouts";
import { useCallback, useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { useSelector } from "react-redux";
import { clearPingCookies } from "shared-utils/src/ping";
import { navListStyles, navStyles } from "./Nav.css";
import NavItem from "./NavItem";

const Nav = () => {
  const player = useSelector(getPlayerData);
  const currentEvent = useSelector(getCurrentEvent);
  const nextEvent = useSelector(getNextEvent);
  const serverError = useSelector(getServerError);
  const entry = useSelector((state: RootState) =>
    player?.entry ? getEntry(state, player.entry) : null
  );

  const auth = useAuth();
  const navRef = useRef<HTMLElement>(null);

  const handleLogout = useCallback(
    (e: Event) => {
      e.preventDefault();
      clearPingCookies();
      auth
        .signoutRedirect({
          id_token_hint: auth.user?.id_token,
          post_logout_redirect_uri: `${window.location.origin}/`,
        })
        .catch((error) => {
          console.error("Logout failed:", error);
        });
    },
    [auth]
  );

  // Setup a click handler that intercepts clicks on the logout link
  useEffect(() => {
    const handleNavClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const linkElement = target.closest("a");

      if (!linkElement) return;

      // Check if it's the logout link
      const isLogoutLink =
        linkElement.textContent?.includes("Sign Out") ||
        linkElement.querySelector("span")?.textContent?.includes("Sign Out");

      if (isLogoutLink) {
        handleLogout(e);
      }
    };

    const navElement = navRef.current;
    if (navElement) {
      navElement.addEventListener("click", handleNavClick);
    }

    return () => {
      if (navElement) {
        navElement.removeEventListener("click", handleNavClick);
      }
    };
  }, [handleLogout]);

  const logoutNavLink: INavLink = {
    useRouter: false,
    href: "#", // Changed to a simple hash link that won't navigate away
    text: "Sign Out",
  };

  const fplChallengeLink: INavLink = {
    useRouter: false,
    href: "//fplchallenge.premierleague.com",
    text: "FPL Challenge",
  };

  const podcastNavLink: INavLink = {
    useRouter: false,
    href: "//premierleague.com/official-fpl-podcast/",
    text: "Podcast",
  };

  const injuriesNavLink: INavLink = {
    useRouter: false,
    href: "//premierleague.com/latest-player-injuries/",
    text: "Injuries",
  };

  let links: INavLink[] = [];
  const useRouter = !serverError;

  if (player?.entry) {
    links = [{ useRouter, href: "/", text: currentEvent ? "Status" : "Home" }];
    if (currentEvent && entry && entry.started_event <= currentEvent.id) {
      links.push({
        useRouter,
        href: `/entry/${player.entry}/event/${currentEvent.id}`,
        text: "Points",
      });
    }
    if (nextEvent) {
      links.push({ useRouter, href: "/my-team", text: "Pick Team" });
    }
    links.push(
      { useRouter, href: "/transfers", text: "Transfers" },
      { useRouter, href: "/leagues", text: "Leagues & Cups" },
      { useRouter, href: "/fixtures", text: "Fixtures" },
      { useRouter, href: "/the-scout", text: "The Scout" },
      injuriesNavLink,
      podcastNavLink,
      { useRouter, href: "/statistics", text: "Stats" },
      { useRouter, href: "/prizes", text: "Prizes" },
      { useRouter, href: "/help", text: "Help" },
      fplChallengeLink,
      logoutNavLink
    );
  } else if (player) {
    links = [
      { useRouter, href: "/", text: "Home" },
      { useRouter, href: "/squad-selection", text: "Squad Selection" },
      { useRouter, href: "/help", text: "Help" },
      logoutNavLink,
    ];
  } else {
    links = [
      { useRouter, href: "/", text: "Home" },
      { useRouter, href: "/prizes", text: "Prizes" },
      { useRouter, href: "/the-scout", text: "Scout" },
      injuriesNavLink,
      podcastNavLink,
      { useRouter, href: "/help", text: "Help" },
      { useRouter, href: "/statistics", text: "Statistics" },
      fplChallengeLink,
    ];
  }

  return (
    <nav ref={navRef} className={navStyles}>
      <div className={maxWidthContainer}>
        <ul className={navListStyles}>
          {links.map((link) => (
            <NavItem {...link} key={link.text} />
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
