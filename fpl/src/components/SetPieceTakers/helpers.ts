import { IElement } from "core-integration/src/store/elements/types";
import { ITeam } from "core-integration/src/store/teams/types";
import { INotesById, INotesItem, ISPTById } from "./types";

export const reduceElementsBySetPieceTakers = (
  elements: IElement[],
  teams: ITeam[]
): ISPTById => {
  const byTeamId = teams.reduce((acc: ISPTById, team: ITeam): ISPTById => {
    acc[team.id] = {
      team: team,
      penalties: [],
      direct_freekicks: [],
      corners_and_indirect_freekicks: [],
    };
    return acc;
  }, {});

  for (let i = 0; i < elements.length; i++) {
    const element: IElement = elements[i];
    if (element.penalties_order) {
      byTeamId[element.team].penalties.push({
        id: element.id,
        name: element.web_name,
        order: element.penalties_order,
      });
    }
    if (element.direct_freekicks_order) {
      byTeamId[element.team].direct_freekicks.push({
        id: element.id,
        name: element.web_name,
        order: element.direct_freekicks_order,
      });
    }
    if (element.corners_and_indirect_freekicks_order) {
      byTeamId[element.team].corners_and_indirect_freekicks.push({
        name: element.web_name,
        id: element.id,
        order: element.corners_and_indirect_freekicks_order,
      });
    }
  }

  return byTeamId;
};

export const reduceNotesByTeamId = (teamNotes: INotesItem[]): INotesById => {
  return teamNotes.reduce(
    (acc: INotesById, item: INotesItem) => ({
      ...acc,
      [item.id]: item,
    }),
    {}
  );
};
