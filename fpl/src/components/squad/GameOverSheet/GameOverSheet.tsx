import { Sheet } from "plos/src/components/Sheet";
import { sheetWrapper } from "./gameOverSheet.css";

interface GameOverSheetProps {
  open: boolean;
  handleClose: () => void;
}

const GameOverSheet = ({ open, handleClose }: GameOverSheetProps) => (
  <Sheet title="Game over" open={open} handleClose={handleClose}>
    <div className={sheetWrapper}>
      <p>
        This game has now finished. Thanks for your interest, come back soon to
        select your squad for next season's game.
      </p>
    </div>
  </Sheet>
);

export default GameOverSheet;
