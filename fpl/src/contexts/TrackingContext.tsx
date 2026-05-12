import { getPlayerData } from "core-integration/src/store/player/reducers";
import { createContext, useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router";
import { gtmPush } from "shared-utils/src/gtm";

// Global Data
interface IGlobalDataLayer {
  active_tab_name: string | undefined;
  app_os: string | undefined;
  event: string;
  fpl_entry_id: number | null;
  logged_in_state: string;
  screen_page_category: string;
  screen_page_name?: string;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_term: string | null;
}

interface IClickTrackEventData {
  event_category?: string;
  event_component: string;
  event_detail?: string;
  event_type?: string;
  // Additional Optional Parameters
  click_url?: string;
  modal_name?: string;
  player_id?: number;
  tab_name?: string;
  team_id?: number;
}

// Click Event Type
interface IClickTrackEvent extends IClickTrackEventData, IGlobalDataLayer {}

// Page View Event Type
interface IPageViewEvent extends IGlobalDataLayer {
  platform: string;
  sso_id: string | null;
}

interface ITrackingContext {
  fireClickTrackEvent: (
    eventData: IClickTrackEventData,
    screenName?: string,
    tabName?: string
  ) => void;
  firePageViewEvent: (screenName: string, tabName?: string) => void;
}

const TrackingContext = createContext<ITrackingContext | null>(null);

export default TrackingContext;

interface ITrackingProviderProps {
  children: React.ReactNode;
}

export const TrackingProvider: React.FC<ITrackingProviderProps> = ({
  children,
}) => {
  const [searchParams] = useSearchParams();

  const player = useSelector(getPlayerData);

  const fireClickTrackEvent = (
    eventData: IClickTrackEventData,
    screenName?: string,
    tabName?: string
  ) => {
    const data: IClickTrackEvent = {
      event: "click_track",
      active_tab_name: tabName,
      app_os: undefined,
      ...eventData,
      fpl_entry_id: player ? player.entry : null,
      logged_in_state: player ? "logged in" : "logged out",
      screen_page_category: "fantasy",
      screen_page_name: screenName,
      utm_campaign: searchParams.get("campaign"),
      utm_content: searchParams.get("content"),
      utm_source: searchParams.get("source"),
      utm_medium: searchParams.get("medium"),
      utm_term: searchParams.get("term"),
    };

    gtmPush({ ...data });
  };

  const firePageViewEvent = (screenName: string, tabName?: string) => {
    const data: IPageViewEvent = {
      event: "page_view",
      active_tab_name: tabName,
      app_os: undefined,
      fpl_entry_id: player ? player.entry : null,
      logged_in_state: player ? "logged in" : "logged out",
      platform: "web",
      screen_page_category: "fantasy",
      screen_page_name: screenName,
      sso_id: player ? player.sso_id : null,
      utm_campaign: searchParams.get("campaign"),
      utm_content: searchParams.get("content"),
      utm_source: searchParams.get("source"),
      utm_medium: searchParams.get("medium"),
      utm_term: searchParams.get("term"),
    };

    gtmPush({ ...data });
  };

  useEffect(() => {
    const filteredHosts = ["premierleague.com"];

    const handleExternalLinkInteraction = (event: MouseEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");
      if (!anchor || !anchor.href) {
        return;
      }

      if (event.type === "click") {
        if (event.button !== 0) {
          return;
        }
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }
      } else if (event.type === "auxclick") {
        if (event.button !== 1) {
          return;
        }
      } else if (event.type == "contextmenu") {
        return;
      }

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.origin);
      } catch (err) {
        return;
      }

      const isSameHost = url.hostname === window.location.hostname;
      const isFiltered = filteredHosts.some(
        (allowedHost) =>
          url.hostname === allowedHost ||
          url.hostname.endsWith(`.${allowedHost}`)
      );

      if (!isSameHost && !isFiltered) {
        console.log(url.toString());
        fireClickTrackEvent({
          event_component: "outbound link click",
          click_url: url.toString(),
        });
      }
    };

    document.addEventListener("click", handleExternalLinkInteraction, true);
    document.addEventListener("auxclick", handleExternalLinkInteraction, true);

    return () => {
      document.removeEventListener(
        "click",
        handleExternalLinkInteraction,
        true
      );
      document.removeEventListener(
        "auxclick",
        handleExternalLinkInteraction,
        true
      );
    };
  }, []);

  return (
    <TrackingContext.Provider
      value={{
        fireClickTrackEvent,
        firePageViewEvent,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTrackingContext = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error(
      "useTrackingContext must be used within a TrackingProvider"
    );
  }
  return context;
};
