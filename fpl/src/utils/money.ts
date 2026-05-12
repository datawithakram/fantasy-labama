import { integerToMoney } from "core-integration/src/utils/money";

export const integerToMoneyWithCurrency = (int: number, divisor: number) =>
  `£${integerToMoney(int, divisor)}m`;
