import { getElementTypesById } from "core-integration/src/store/element-types/reducers";
import {
  getCurrentEvent,
  getNextEvent,
} from "core-integration/src/store/events/reducers";
import { getTeamsById } from "core-integration/src/store/teams/reducers";
import { ElementPhoto } from "plos/src/components/ElementPhoto";
import ExternalButtonLink from "plos/src/components/links/ExternalButtonLink";
import { externalLinkIcon } from "plos/src/components/links/links.css";
import { StatsList } from "plos/src/components/StatsList";
import ExternalIcon from "plos/src/img/icons/external.svg?react";
import { visuallyHidden } from "plos/src/styles/utils.css";
import { fetchPlayer, fetchTeam } from "plos/src/utils/pulse";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { MatchSummary } from "../MatchSummary";
import PlayerNotesDropdown from "../PlayerNotesDropdown";
import { getRankTypeString, getStatItems, StatItemType } from "../utils";
import {
  buttonLinkWrapper,
  externalLinkText,
  firstNameText,
  nameBlock,
  playerImageStyles,
  playerInfoStyles,
  positionText,
  profileHeaderInner,
  profileHeaderOuter,
  profileSummary,
  secondNameText,
  teamText,
} from "./profileSummary.css";
import {
  PlayerInfo,
  ProfileSummaryLinkProps,
  ProfileSummaryProps,
} from "./types";

import { getDisplayName } from "./utils";

export const PlayerInfoSection = ({ position, team, element }: PlayerInfo) => {
  const displayName = getDisplayName(element);

  return (
    <div className={playerInfoStyles}>
      <div className={positionText}>{position}</div>
      <h1 id="sheet-title" className={nameBlock}>
        {displayName.showKnownName ? (
          <div className={secondNameText}>{displayName.knownName}</div>
        ) : (
          <>
            <div className={firstNameText}>{displayName.firstName}</div>
            <div className={secondNameText}>{displayName.secondName}</div>
          </>
        )}
      </h1>
      <div className={teamText}>{team}</div>
    </div>
  );
};

const PREVIEW_STATS = [
  "now_cost",
  "points_per_game",
  "form",
  "selected_by_percent",
];

// TODO(FPL-2185): Refactor ButtonLink/RouterLink into a polymorphic link API (`to` | `href`) with type-safe union props and clear internal vs external semantics.
// https://premierleague.atlassian.net/browse/FPL-2185
const ProfileSummaryLink = ({ href, label }: ProfileSummaryLinkProps) => (
  <ExternalButtonLink
    href={href}
    fullWidth
    styleVariant="tonal"
    size="small"
    target="_blank"
    rel="noopener noreferrer"
  >
    <span className={externalLinkText}>{label}</span>
    <ExternalIcon className={externalLinkIcon} aria-hidden />
    <span className={visuallyHidden}>(external site, opens in a new tab)</span>
  </ExternalButtonLink>
);

const ProfileSummary = ({
  element,
  variant = "full-profile",
}: ProfileSummaryProps) => {
  const [shirtUrl, setShirtUrl] = useState<string | null>(null);
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  const elementTypesById = useSelector(getElementTypesById);
  const elementType = elementTypesById[element.element_type];
  const { singular_name: position } = elementType;

  const currentEvent = useSelector(getCurrentEvent);
  const nextEvent = useSelector(getNextEvent);

  const teamsById = useSelector(getTeamsById);
  const team = teamsById[element.team].name;

  useEffect(() => {
    const fetchPlayerUrls = async () => {
      try {
        const teamData = await fetchTeam(element.team_code);
        const playerData = await fetchPlayer(element.code);

        if (teamData) {
          setShirtUrl(teamData.metadata.shirt_url);
        }

        if (playerData) {
          setProfileUrl(playerData.metadata.web_profile_url);
        }
      } catch (err) {
        console.error("Fetch failed:", err);
        return null;
      }
    };

    fetchPlayerUrls();
  }, []);

  const getEventId = () => {
    if (currentEvent) {
      return currentEvent.id;
    }
    if (nextEvent) {
      return nextEvent.id;
    }
    return null;
  };

  const eventId = getEventId();
  const { element_count: elementCount } = elementType;

  const stats: StatItemType[] = getStatItems({
    element,
    eventId,
  });
  const formattedStats = stats
    .filter((s) =>
      variant === "preview" ? PREVIEW_STATS.includes(s.id) : true
    )
    .map(({ rankType, ...rest }) => ({
      ...rest,
      subValue: getRankTypeString({ elementCount, rankType }),
    }));

  return (
    <div className={profileSummary}>
      <div className={profileHeaderOuter}>
        <div className={profileHeaderInner}>
          <div className={playerImageStyles}>
            <ElementPhoto alt="" elementId={element.id} />
          </div>
          <PlayerInfoSection
            position={position}
            team={team}
            element={element}
          />
        </div>
      </div>
      <PlayerNotesDropdown element={element} />
      <div className={buttonLinkWrapper}>
        {profileUrl && (
          <ProfileSummaryLink href={profileUrl} label="Player Profile" />
        )}
        {shirtUrl && (
          <ProfileSummaryLink href={shirtUrl} label="Buy Player Shirt" />
        )}
      </div>
      <StatsList stats={formattedStats} />
      <MatchSummary element={element} />
    </div>
  );
};

export default ProfileSummary;
