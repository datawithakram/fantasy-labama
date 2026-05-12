import { getElementsById } from "core-integration/src/store/elements/reducers";
import { getEvents } from "core-integration/src/store/events/reducers";
import { IEvent } from "core-integration/src/store/events/types";
import { CarouselPanel } from "plos/src/components/CarouselPanel";
import { useSelector } from "react-redux";
import { EventTopElement } from "./EventTopElement";
import { TopElementCarouselProps } from "./types";

const TopElementCarousel = ({ now }: TopElementCarouselProps) => {
  const elementsById = useSelector(getElementsById);
  const events = useSelector(getEvents);
  // Start from GW1, but if the current event is after GW4, start from three GW before
  const startingEvent = now && now.id > 4 ? now.id - 3 : 0;

  const topElementFromEvent = (event: IEvent) =>
    event.top_element_info && elementsById[event.top_element_info.id];
  const topElementPointsFromEvent = (event: IEvent) =>
    event.top_element_info && event.top_element_info.points;

  return (
    <CarouselPanel
      title="2025/26 Player of the Week"
      initialItemIndex={startingEvent}
    >
      {events.map((event) => (
        <div key={event.id}>
          <EventTopElement
            event={event}
            element={topElementFromEvent(event)}
            points={topElementPointsFromEvent(event)}
          />
        </div>
      ))}
    </CarouselPanel>
  );
};

export default TopElementCarousel;
