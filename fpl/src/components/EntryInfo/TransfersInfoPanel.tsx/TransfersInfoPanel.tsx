import { IEntry } from "core-integration/src/store/entries/types";
import { ITransferState } from "core-integration/src/store/my-team/types";
import ButtonLink from "plos/src/components/links/ButtonLink";
import { integerToMoneyWithCurrency } from "plos/src/utils/money";
import { ChevronRight } from "../../icons/Chevrons";
import {
  dataList,
  dataListHeading,
  dataListItem,
  dataListValue,
  entryInfoPanelHeading,
  footnote,
} from "../entryInfo.css";
import EntryInfoPanel from "../EntryInfoPanel";

interface PanelProps {
  transfersState: ITransferState | null;
  entry: IEntry;
  mine: boolean;
}

const TransfersInfoPanel = ({ entry, transfersState, mine }: PanelProps) => {
  const headerAction = (
    <ButtonLink
      styleVariant="tonal"
      size="small"
      to={`/entry/${entry.id}/transfers`}
    >
      Transfer History
      <ChevronRight height={10} width={10} />
    </ButtonLink>
  );
  return (
    <EntryInfoPanel title="Transfers" headerAction={headerAction}>
      <ul className={dataList}>
        {mine && transfersState && (
          <li className={dataListItem}>
            <h4 className={dataListHeading}>Gameweek transfers</h4>
            <div className={dataListValue}>{transfersState.made}</div>
          </li>
        )}
        <li className={dataListItem}>
          <h4 className={dataListHeading}>Total transfers</h4>
          <div className={dataListValue}>
            {mine && transfersState
              ? entry.last_deadline_total_transfers + transfersState.made
              : entry.last_deadline_total_transfers}
          </div>
        </li>
      </ul>

      <div className={entryInfoPanelHeading}>
        <h3>Finance</h3>
      </div>
      <ul className={dataList}>
        <li className={dataListItem}>
          <h4 className={dataListHeading}>Squad value</h4>
          <div className={dataListValue}>
            {mine && transfersState
              ? integerToMoneyWithCurrency(transfersState.value, 10)
              : entry.last_deadline_value != null &&
                entry.last_deadline_bank != null
              ? integerToMoneyWithCurrency(
                  entry.last_deadline_value - entry.last_deadline_bank,
                  10
                )
              : "-"}
          </div>
        </li>
        <li className={dataListItem}>
          <h4 className={dataListHeading}>In the bank</h4>
          <div className={dataListValue}>
            {mine && transfersState
              ? integerToMoneyWithCurrency(transfersState.bank, 10)
              : entry.last_deadline_bank !== null
              ? `${integerToMoneyWithCurrency(entry.last_deadline_bank, 10)}`
              : "-"}
          </div>
        </li>
      </ul>
      {!mine && <p className={footnote}>Values at the last deadline</p>}
    </EntryInfoPanel>
  );
};

export default TransfersInfoPanel;
