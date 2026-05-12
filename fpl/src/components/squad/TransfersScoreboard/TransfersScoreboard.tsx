import { getNextEvent } from "core-integration/src/store/events/reducers";
import { getTransferState } from "core-integration/src/store/squad/reducers";
import { BasicScoreboard } from "plos/src/components/Scoreboard";
import { CostScoreboard } from "plos/src/components/Scoreboard/CostScoreboard";
import useScoreboard from "plos/src/components/Scoreboard/useScoreboard";
import { Alert } from "plos/src/components/alerts";
import { useSelector } from "react-redux";
import ChipList from "../../Chips/ChipList";
import { costWrapper } from "./transfersScoreboard.css";

const TransfersScoreboard = () => {
  const {
    currencyDivisor,
    elementTypesByPosition,
    proposedElements,
    toSpend,
    isNeedElements,
    isBudgetExceeded,
  } = useScoreboard();

  const nextEvent = useSelector(getNextEvent);
  const transfersState = useSelector(getTransferState);

  const sharedProps = {
    currencyDivisor,
    elementTypesByPosition,
    proposedElements,
    toSpend,
    isNeedElements,
    isBudgetExceeded,
  };

  if (!transfersState) {
    return null;
  }

  if (!nextEvent) {
    return (
      <div data-variant={"transfers-basic"}>
        <BasicScoreboard {...sharedProps} />
      </div>
    );
  }

  if (transfersState.status === "cost") {
    return (
      <div className={costWrapper}>
        <ChipList chipsShown="transfer" />
        <CostScoreboard {...sharedProps} />
      </div>
    );
  }

  return (
    <>
      <div data-variant={"transfers-basic"}>
        <BasicScoreboard {...sharedProps} />
      </div>
      <Alert isCentered isInline>
        You can make unlimited free transfers before the {nextEvent.name}{" "}
        deadline
      </Alert>
    </>
  );
};

export default TransfersScoreboard;
