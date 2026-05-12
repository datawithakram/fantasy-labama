import { vars } from "plos/src/styles/theme.css";
import { resultStyles } from "./result.css";

interface ResultProps {
  resultChar: string;
}

const resultDict = {
  w: "win",
  d: "draw",
  l: "loss",
};

const Result = ({ resultChar }: ResultProps) => {
  const result = resultChar.toLowerCase() as keyof typeof vars.colors.result;

  return (
    <span
      aria-label={`Match result: ${resultDict[result]}`}
      className={resultStyles[result]}
    >
      {resultChar}
    </span>
  );
};

export default Result;
