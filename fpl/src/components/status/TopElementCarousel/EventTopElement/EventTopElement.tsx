import { ThunkDispatch } from "core-integration/src/store";
import { showElementSummary } from "core-integration/src/store/elements/thunks";
import { ElementPhoto } from "plos/src/components/ElementPhoto";
import { Button } from "react-aria-components";
import { useDispatch } from "react-redux";
import { getShortNameFromId, isBlankWeek } from "../../../../utils/events";
import {
  topElementContainer,
  topElementName,
  topElementPhotoContainer,
  topElementValue,
  topElementWrap,
} from "./eventTopElement.css";
import { EventTopElementProps } from "./types";

const EventTopElement = ({ element, event, points }: EventTopElementProps) => {
  const dispatch = useDispatch<ThunkDispatch>();

  const showElementDialog = (elementId: number) => {
    dispatch(showElementSummary(elementId));
  };
  return (
    <div className={topElementWrap}>
      {element && !isBlankWeek(event.id) ? (
        <Button
          onPress={() => showElementDialog(element.id)}
          className={topElementContainer.button}
        >
          <span className={topElementPhotoContainer}>
            <ElementPhoto elementId={element.id} alt={element.web_name} />
          </span>
          <span className={topElementName}>{element.web_name}</span>
          <span className={topElementValue}>
            <span>{getShortNameFromId(event.id)}</span>
            <span>{`${points} pts`}</span>
          </span>
        </Button>
      ) : (
        <div className={topElementContainer.placeholder}>
          <span className={topElementPhotoContainer}>
            <ElementPhoto alt="Placeholder photo" />
          </span>
          <div>
            <div className={topElementName}>-</div>
            <div className={topElementValue}>
              <span>{getShortNameFromId(event.id)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventTopElement;
