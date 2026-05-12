import { IError } from "core-integration/src/store";
import { ISettings } from "core-integration/src/store/game/types";

export const getErrorType = (errors: IError | null) => {
  if (errors) {
    if (errors.badRequest) {
      if (errors.badRequest.non_field_errors) {
        return errors.badRequest.non_field_errors[0].code;
      }
      if (errors.badRequest.code) {
        return errors.badRequest.code[0].code;
      }
    }
    return JSON.stringify(errors);
  }
  return "";
};

export const formatErrorMsg = (error: string, settings: ISettings) => {
  switch (error) {
    case "max_length": {
      return `Invalid code entered. Please check the code.`;
    }
    case "invalid": {
      return `Invalid code entered. Please check the code and confirm with the league administrator if you are still having problems.`;
    }
    case "league_closed": {
      return `This league is closed to new entries.`;
    }
    case "already_joined": {
      return `You are already entered in this league.`;
    }
    case "entry_banned": {
      return `The creator of this league has banned you from entering.`;
    }
    case "max_private_entries": {
      return `You are in the maximum number of ${settings.league_join_private_max} invitational leagues &amp; cups. Before you can join a new league you will need to leave one of these leagues.`;
    }
    case "public_league_max_exceeded": {
      return `You may only enter ${settings.league_join_public_max} public leagues`;
    }
    default:
      return error;
  }
};
