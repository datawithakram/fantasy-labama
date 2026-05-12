import { IPotentialChip } from "core-integration/src/store/chips/types";
import { getEventsById } from "core-integration/src/store/events/reducers";
import { Sheet } from "plos/src/components/Sheet";
import { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import { getChipName } from "../../../utils/chips";
import ChipBadge from "../ChipBadge";
import ChipAction from "./ChipAction";
import {
  chipNameStyles,
  content,
  header,
  sheetContainer,
} from "./chipSheet.css";
import TransfersChipAction from "./TransfersChipAction";
import { getChipDescriptions } from "./utils";

interface ChipProps {
  chip: IPotentialChip | null;
  setChip: Dispatch<SetStateAction<IPotentialChip | null>>;
}

const ChipSheet = ({ chip, setChip }: ChipProps) => {
  const [showModalConfirmation, setShowModalConfirmation] = useState(false);
  const eventsById = useSelector(getEventsById);

  if (chip == null) return null;

  const { name } = chip;

  const chipName = getChipName(name);

  const handleClose = () => {
    setChip(null);
  };

  const chipDescription = getChipDescriptions({
    showModalConfirmation,
    eventsById,
  });

  const chipAction =
    chip.chip_type === "transfer" ? (
      <TransfersChipAction
        chip={chip}
        handleClose={handleClose}
        showModalConfirmation={showModalConfirmation}
        setShowModalConfirmation={setShowModalConfirmation}
      />
    ) : (
      <ChipAction chip={chip} handleClose={handleClose} />
    );

  return (
    <Sheet open={Boolean(chip)} handleClose={handleClose} footer={chipAction}>
      <div className={sheetContainer}>
        <div className={content}>
          <div className={header}>
            <span>
              <ChipBadge path={`/img/chips/${name}`} sizes={"120px"} />
            </span>
            <h2 className={chipNameStyles}>{chipName}</h2>
          </div>
          {chipDescription[name]}
        </div>
      </div>
    </Sheet>
  );
};

export default ChipSheet;
