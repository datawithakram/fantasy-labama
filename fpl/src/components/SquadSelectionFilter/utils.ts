import { ISelectOption } from "core-integration/src/store";

export const getOptionLabel = ({
  options,
  value,
}: {
  options: ISelectOption[];
  value: string;
}) => options.find((option) => option.value == value)?.label ?? "Undefined";
