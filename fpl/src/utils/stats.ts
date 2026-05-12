export type StatName = keyof typeof statDetails;

export interface IStatDetails {
  key: StatName;
  label: string;
  description?: string;
  shortName?: string;
}

// TODO: Get these changes reviewed by MS/PL
export const statDetails = {
  total_points: {
    description: "Total points earned this season.",
    key: "total_points",
    label: "Total points",
    shortName: "TP",
  },
  event_points: {
    description: "Total points earned in the latest Gameweek.",
    key: "event_points",
    label: "Gameweek points",
    shortName: "GWP",
  },
  now_cost: {
    description: "Current buying price in the transfer market.",
    key: "now_cost",
    label: "Price",
    shortName: "£",
  },
  selected_by_percent: {
    description:
      "The percentage of overall Fantasy managers who currently own the player.",
    key: "selected_by_percent",
    label: "Teams selected by %",
    shortName: "TSB",
  },
  minutes: {
    description: "Total minutes played this season.",
    key: "minutes",
    label: "Minutes played",
    shortName: "MP",
  },
  goals_scored: {
    description: "Total goals scored this season.",
    key: "goals_scored",
    label: "Goals scored",
    shortName: "GS",
  },
  assists: {
    description:
      "Total goal assists - awarded to the player from the goalscoring team who makes the final pass before a goal is scored, including own goals.",
    key: "assists",
    label: "Assists",
    shortName: "A",
  },
  clean_sheets: {
    description:
      "Total clean sheets - awarded to players who do not concede a goal and have played at least 60 minutes.",
    key: "clean_sheets",
    label: "Clean sheets",
    shortName: "CS",
  },
  goals_conceded: {
    description:
      "Total number of goals conceded by a team while the player has been on the pitch.",
    key: "goals_conceded",
    label: "Goals conceded",
    shortName: "GC",
  },
  own_goals: {
    description:
      "Awarded to a player who puts the ball into his own team's goal.",
    key: "own_goals",
    label: "Own goals",
    shortName: "OG",
  },
  penalties_saved: {
    description:
      "Awarded to a goalkeeper who touches the ball when saving a penalty.",
    key: "penalties_saved",
    label: "Penalties saved",
    shortName: "PS",
  },
  penalties_missed: {
    description:
      "Awarded to a player who takes a penalty but does not score from the penalty spot.",
    key: "penalties_missed",
    label: "Penalties missed",
    shortName: "PM",
  },
  yellow_cards: {
    description: "Total yellow cards this season.",
    key: "yellow_cards",
    label: "Yellow cards",
    shortName: "YC",
  },
  red_cards: {
    description: "Total red cards this season.",
    key: "red_cards",
    label: "Red cards",
    shortName: "RC",
  },
  saves: {
    description: "Total times a goalkeeper has saved a shot on goal.",
    key: "saves",
    label: "Saves",
    shortName: "S",
  },
  bonus: {
    description:
      "The three best performing players in each match according to the BPS will receive additional bonus points - 3 points will be awarded to the highest scoring player, 2 to the second best and 1 to the third.",
    key: "bonus",
    label: "Bonus points",
    shortName: "B",
  },
  bps: {
    description:
      "The Bonus Points System (BPS) uses a range of stats to create a BPS score for each player. The three best performing players in each match will be awarded bonus points.",
    key: "bps",
    label: "Bonus Points System",
    shortName: "BPS",
  },
  influence: {
    description:
      "Influence evaluates a player's impact on a match, taking into account actions that could directly or indirectly affect the match outcome. Part of the ICT index.",
    key: "influence",
    label: "Influence",
    shortName: "I",
  },
  creativity: {
    description:
      "Creativity assesses player performance in terms of producing goalscoring opportunities for other players. Part of the ICT index.",
    key: "creativity",
    label: "Creativity",
    shortName: "C",
  },
  threat: {
    description:
      "Threat gauges players who are most likely to score goals. Part of the ICT index.",
    key: "threat",
    label: "Threat",
    shortName: "T",
  },
  ict_index: {
    description:
      "Statistical index developed specifically to assess a player as an FPL asset, combining Influence, Creativity and Threat scores.",
    key: "ict_index",
    label: "ICT Index",
    shortName: "ICT",
  },
  form: {
    description:
      "Form is a player's average score per match, calculated from all matches played by his club in the last 30 days.",
    key: "form",
    label: "Form",
    shortName: "F",
  },
  dreamteam_count: {
    description:
      "The number of times a player has been selected in a Gameweek Dream Team. Players with the most points in a Gameweek in a valid formation earn a place in the Dream Team.",
    key: "dreamteam_count",
    label: "Times in Dream Team",
    shortName: "DT",
  },
  value_form: {
    description: "Player's form divided by player's value.",
    key: "value_form",
    label: "Value (form)",
    shortName: "V(F)",
  },
  value_season: {
    description: "Player's total points divided by player's value.",
    key: "value_season",
    label: "Value (season)",
    shortName: "V(S)",
  },
  points_per_game: {
    description: "Player's total points divided by player's number of matches.",
    key: "points_per_game",
    label: "Points per match",
    shortName: "PPM",
  },
  transfers_in: {
    description:
      "Total number of times a player has been transferred in to a team this season.",
    key: "transfers_in",
    label: "Transfers in",
    shortName: "TI",
  },
  transfers_out: {
    description:
      "Total number of times a player has been transferred out of a team this season.",
    key: "transfers_out",
    label: "Transfers out",
    shortName: "TO",
  },
  transfers_in_event: {
    description:
      "Total number of times a player has been transferred in to a team this Gameweek.",
    key: "transfers_in_event",
    label: "Transfers in (Gameweek)",
    shortName: "TI(GW)",
  },
  transfers_out_event: {
    description:
      "Total number of times a player has been transferred out of a team this Gameweek.",
    key: "transfers_out_event",
    label: "Transfers out (Gameweek)",
    shortName: "TO(GW)",
  },
  cost_change_start: {
    description:
      "How much a player's price has increased since the start of the season.",
    key: "cost_change_start",
    label: "Price rise",
    shortName: "PR",
  },
  cost_change_start_fall: {
    description:
      "How much a player price has fallen since the start of the season.",
    key: "cost_change_start_fall",
    label: "Price fall",
    shortName: "PF",
  },
  cost_change_event: {
    description: "How much a player's price has increased this Gameweek.",
    key: "cost_change_event",
    label: "Price rise (Gameweek)",
    shortName: "PR(GW)",
  },
  cost_change_event_fall: {
    description: "How much a player's price has fallen this Gameweek.",
    key: "cost_change_event_fall",
    label: "Price fall (Gameweek)",
    shortName: "PF(GW)",
  },
  expected_assists: {
    description: "Expected assists since the start of the season",
    key: "expected_assists",
    label: "Expected assists (Total)",
    shortName: "xA(T)",
  },
  expected_goals: {
    description: "Expected goals since the start of the season",
    key: "expected_goals",
    label: "Expected goals (Total)",
    shortName: "xG(T)",
  },
  expected_goal_involvements: {
    description: "Expected goal involvements since the start of the season",
    key: "expected_goal_involvements",
    label: "Expected goal involvements (Total)",
    shortName: "xGI(T)",
  },
  expected_goals_conceded: {
    description: "Expected goals conceded since the start of the season",
    key: "expected_goals_conceded",
    label: "Expected goals conceded (Total)",
    shortName: "xGC(T)",
  },
  starts: {
    description: "Total games started this season",
    key: "starts",
    label: "Starts",
    shortName: "ST",
  },
  tackles: {
    description: "Total tackles this season.",
    key: "tackles",
    label: "Tackles",
    shortName: "TKL",
  },
  clearances_blocks_interceptions: {
    description: "Total clearances blocks and interceptions (CBI) this season.",
    key: "clearances_blocks_interceptions",
    label: "Clearances Blocks and Interceptions",
    shortName: "CBI",
  },
  recoveries: {
    description: "Total recoveries this season.",
    key: "recoveries",
    label: "Recoveries",
    shortName: "REC",
  },
  defensive_contribution: {
    description:
      "Points gained from cumulative clearances, blocks and interceptions.",
    key: "defensive_contribution",
    label: "Defensive Contributions",
    shortName: "DC",
  },
} as const;

export const isStatName = (name: string): name is StatName =>
  name in statDetails;

/**
 * Retrieves stat details for a given stat name with optional overrides.
 *
 * @param name - The stat name to retrieve details for (must be a valid StatName)
 * @param overrides - Optional overrides for label and/or shortName. Useful when you need
 *                    context-specific display text while keeping the key and description
 *                    from the central registry.
 *
 * @returns The stat details object with any overrides applied, or null if the stat name is invalid
 *
 * @example
 * // Get standard stat details
 * const nowCost = getStatDetails("now_cost");
 * // Returns: { key: "now_cost", label: "Price", shortName: "£", description: "..." }
 *
 * @example
 * // Override label and shortName for context-specific display
 * const currentPrice = getStatDetails("now_cost", {
 *   label: "Current Price",
 *   shortName: "CP"
 * });
 * // Returns: { key: "now_cost", label: "Current Price", shortName: "CP", description: "..." }
 */
export const getStatDetails = (
  name: StatName,
  overrides?: Partial<Omit<IStatDetails, "key" | "description">>
): IStatDetails | null => {
  const details = statDetails[name];
  if (!details) return null;

  return {
    ...details,
    ...overrides,
  };
};

export const getStatNames = () => Object.keys(statDetails) as StatName[];

export const getStatDescription = (statName: StatName) => {
  return getStatDetails(statName)?.description ?? "No description available";
};

export const getStatFormattedLabel = (statName: StatName) => {
  const stat = getStatDetails(statName);

  if (!stat) return "**";

  return (
    stat.shortName ??
    stat.label
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
  );
};

/**
 * Utility to filter out null/undefined stats and ensure a consistent array of IStatDetails.
 */
export const getStatColumns = (
  stats: (IStatDetails | null | undefined)[]
): IStatDetails[] => {
  return stats.filter((stat): stat is IStatDetails => !!stat);
};
