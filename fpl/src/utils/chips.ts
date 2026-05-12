export const getChipName = (name: string) => {
  const chipNames: Record<string, string> = {
    bboost: "Bench Boost",
    "3xc": "Triple Captain",
    freehit: "Free Hit",
    wildcard: "Wildcard",
  };
  return chipNames[name] || "";
};
