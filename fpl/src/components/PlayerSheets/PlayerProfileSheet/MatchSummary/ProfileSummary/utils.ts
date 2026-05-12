import { IElement } from "core-integration/src/store/elements/types";

type DisplayNameResult =
  | { showKnownName: true; knownName: string }
  | { showKnownName: false; firstName: string; secondName: string };

/**  Utility for name display logic for PlayerProfileSheet
 * @param element: IElement
 * @returns DisplayNameResult
 * */
export const getDisplayName = (element: IElement): DisplayNameResult => {
  const { first_name, second_name, known_name } = element;

  // If no known_name, use first_name and second_name
  if (!known_name) {
    return {
      showKnownName: false,
      firstName: first_name,
      secondName: second_name,
    };
  }

  // If known_name starts with first_name, split known_name into first name and second name
  if (first_name && known_name.startsWith(first_name + " ")) {
    const restOfName = known_name.substring(first_name.length).trim();
    if (restOfName) {
      return {
        showKnownName: false,
        firstName: first_name,
        secondName: restOfName,
      };
    }
  }

  // Otherwise, use full known_name
  return {
    showKnownName: true,
    knownName: known_name,
  };
};
