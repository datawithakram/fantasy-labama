export const getSuffixFromId = (id: number, isHome: boolean) => {
  const neutralIds: number[] = [];
  return neutralIds.indexOf(id) > -1 ? "(N)" : isHome ? "(H)" : "(A)";
};

export const isElementFixtureHome = (
  elementTeam: number,
  fixtureTeamH: number
) => elementTeam === fixtureTeamH;
