export const getShortNameFromId = (event: number, idOnly = false) => {
  const prefix = idOnly ? "" : "GW";
  return `${prefix}${event}`;
};

export const isBlankWeek = (eventId: number) => (eventId === 0 ? true : false);
