// Look for errors we potentally can handle
export const getCodeFromError = (error: any) => {
  let errorCode = "";
  if (error && error.badRequest) {
    const e = error.badRequest;
    if (e.transfers && e.transfers.length) {
      for (let i = 0; i < e.transfers.length; i++) {
        if (
          e.transfers[i].non_field_errors &&
          e.transfers[i].non_field_errors.length
        ) {
          errorCode = e.transfers[i].non_field_errors[0].code;
          break;
        }
      }
    } else if (e.non_field_errors && e.non_field_errors.length) {
      errorCode = e.non_field_errors[0].code;
    } else if (e.picks && e.picks.length) {
      for (let i = 0; i < e.picks.length; i++) {
        if (e.picks[i].purchase_price && e.picks[i].purchase_price.length) {
          errorCode = e.picks[i].purchase_price[0].code;
          break;
        }
      }
    }
  }
  return errorCode || "";
};
