import { FixturesByEvent } from "core-integration/src/store/fixtures/types";
import { ITeam } from "core-integration/src/store/teams/types";
import { IFixturesWithDifficultyByEventAndTeam } from "./types";

export const formatFixturesByEventAndTeam = (
  fixturesByEvent: FixturesByEvent
) => {
  const data: IFixturesWithDifficultyByEventAndTeam = {};
  for (const eventId in fixturesByEvent) {
    if (data[eventId] === undefined) {
      data[eventId] = {};
    }
    fixturesByEvent[eventId].forEach((fixture) => {
      ["h", "a"].forEach((ha) => {
        // Set constants dependent on if we are dealing with home or away
        const myTeamKey =
          ha === "h" ? fixture.team_h.toString() : fixture.team_a.toString();
        const opponent = ha === "h" ? fixture.team_a : fixture.team_h;
        const difficulty =
          ha === "h" ? fixture.team_h_difficulty : fixture.team_a_difficulty;

        // Add correct fixture data, initialise if is first time we've seen team
        if (!data[eventId][myTeamKey]) {
          data[eventId][myTeamKey] = { eventDifficulty: 0, fixtures: [] };
        }
        data[eventId][myTeamKey].fixtures.push({
          ...fixture,
          difficulty: difficulty || 0,
          isHome: ha === "h",
          opponent,
        });
      });
    });
    // Now we've processed the event update eventDifficulty for all teams with
    // fixtures
    for (const teamId in data[eventId]) {
      const totalFixtures = data[eventId][teamId].fixtures.length;
      if (totalFixtures) {
        const totalEventDifficulty = data[eventId][teamId].fixtures.reduce(
          (acc, f) => acc + f.difficulty,
          0
        );
        data[eventId][teamId].eventDifficulty =
          totalEventDifficulty / totalFixtures;
      }
    }
  }
  return data;
};

export const sortTeamsByEventDiff = (
  teamFixtures: IFixturesWithDifficultyByEventAndTeam,
  activeEventId: number,
  sortType: string,
  teams: ITeam[]
) => {
  return teams.slice().sort((a, b) => {
    if (sortType === "a-z") {
      return a.name.localeCompare(b.name);
    }
    // If it's the title
    if (activeEventId === 0) {
      if (sortType === "asc") {
        return a.name.localeCompare(b.name);
      } else if (sortType === "dsc") {
        return b.name.localeCompare(a.name);
      }
    }
    if (activeEventId > 0) {
      const aTeamDifficulty =
        teamFixtures[activeEventId] && teamFixtures[activeEventId][a.id]
          ? teamFixtures[activeEventId][a.id].eventDifficulty
          : 0;
      const bTeamDifficulty =
        teamFixtures[activeEventId] && teamFixtures[activeEventId][b.id]
          ? teamFixtures[activeEventId][b.id].eventDifficulty
          : 0;

      if (aTeamDifficulty !== bTeamDifficulty) {
        // Difficulty of 0 (no fixtures) always last
        if (aTeamDifficulty === 0) return 1;
        if (bTeamDifficulty === 0) return -1;

        return sortType === "asc"
          ? aTeamDifficulty - bTeamDifficulty
          : bTeamDifficulty - aTeamDifficulty;
      }
    }

    // The default sort is ascending name
    return a.name.localeCompare(b.name);
  });
};
