import debounce from "lodash/debounce";
import { Button } from "plos/src/components/buttons/Button";
import { ChevronLeft, ChevronRight } from "../../icons/Chevrons";
import { buttonWrapperStyles } from "./fdrTableNav.css";
import { FDRTableNavProps } from "./types";

const FDRTableNav = ({
  showPrevBtn,
  showNextBtn,
  onHandlePrevClick,
  onHandleNextClick,
}: FDRTableNavProps) => {
  return (
    <div className={buttonWrapperStyles}>
      <Button
        aria-label="Previous Gameweek"
        styleVariant="outlined"
        size="small"
        fullWidth={true}
        onPress={debounce(onHandlePrevClick, 250)}
        data-testid="prev-btn"
        isDisabled={!showPrevBtn}
      >
        <ChevronLeft height={12} width={12} />
        Previous GW
      </Button>

      <Button
        aria-label="Next Gameweek"
        styleVariant="outlined"
        size="small"
        fullWidth={true}
        onPress={debounce(onHandleNextClick, 250)}
        data-testid="next-btn"
        isDisabled={!showNextBtn}
      >
        Next GW
        <ChevronRight height={12} width={12} />
      </Button>
    </div>
  );
};
export default FDRTableNav;
