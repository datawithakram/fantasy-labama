import { IEvent } from "core-integration/src/store/events/types";
import CountdownTimer from "../CountdownTimer/CountdownTimer";
import { container, countdownWrapper } from "./eventDeadlineCountdown.css";

interface EventDeadlineCountdownProps {
  event: IEvent | null;
  onComplete?: () => void;
}

const EventDeadlineCountdown = ({
  event,
  onComplete,
}: EventDeadlineCountdownProps) => {
  if (!event) {
    return null;
  }

  const targetDate = new Date(event.deadline_time);

  return (
    <div className={container}>
      <h4>{event.name}</h4>
      <div className={countdownWrapper}>
        <CountdownTimer targetDate={targetDate} onComplete={onComplete} />
      </div>
    </div>
  );
};

export default EventDeadlineCountdown;
