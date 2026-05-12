import {
  formatDateAsISO,
  formatRawAsLocal,
} from "core-integration/src/utils/datetime";
import { useMediaQuery } from "plos/src/hooks/useMediaQuery";
import { Fragment, useCallback } from "react";
import { TimeLeft, useCountdown } from "../../hooks/useCountdown";
import {
  labelStyle,
  separator,
  timeUnit,
  timerContainer,
} from "./countdownTimer.css";

interface CountdownTimerProps {
  targetDate: Date | null;
  onComplete?: () => void;
}

type UnitKey = "days" | "hours" | "minutes" | "seconds";

interface CountdownDisplayProps {
  values: Record<UnitKey, string>;
  timeLeft: TimeLeft;
  targetDate: Date;
  ariaLabel: string;
}

const formatTime = (value: number) => String(value).padStart(2, "0");

const UNITS = [
  { key: "days", singular: "Day", plural: "Days" },
  { key: "hours", singular: "Hour", plural: "Hours" },
  { key: "minutes", singular: "Minute", plural: "Minutes" },
  { key: "seconds", singular: "Second", plural: "Seconds" },
] as const;

const CountdownDisplay = ({
  values,
  timeLeft,
  targetDate,
  ariaLabel,
}: CountdownDisplayProps) => (
  <div role="timer" aria-label={ariaLabel}>
    <time dateTime={formatDateAsISO(targetDate)} className={timerContainer}>
      {UNITS.map((unit, index) => {
        const numericValue = timeLeft[unit.key];
        const label = numericValue === 1 ? unit.singular : unit.plural;
        return (
          <Fragment key={unit.key}>
            <span className={timeUnit}>
              <div className={labelStyle}>{label}</div>
              <div>{values[unit.key]}</div>
            </span>
            {index < UNITS.length - 1 && (
              <span className={separator} aria-hidden="true">
                :
              </span>
            )}
          </Fragment>
        );
      })}
    </time>
  </div>
);

const CountdownTimer = ({ targetDate, onComplete }: CountdownTimerProps) => {
  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)"
  );

  // Keep a stable callback reference so the hook doesn't see a new function every render
  const handleComplete = useCallback(() => {
    onComplete?.();
  }, [onComplete]);

  const timeLeft = useCountdown(targetDate, {
    onComplete: handleComplete,
  });

  if (!targetDate || !timeLeft) {
    return null;
  }

  if (prefersReducedMotion) {
    const formatted = formatRawAsLocal(
      targetDate.toISOString(),
      "E d MMM, HH:mm"
    );
    const label = `Deadline at ${formatted}`;

    return (
      <div role="timer" aria-label={label}>
        <time dateTime={formatDateAsISO(targetDate)}>{formatted}</time>
      </div>
    );
  }

  const isExpired = timeLeft.total <= 0;

  const values: Record<UnitKey, string> = isExpired
    ? {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      }
    : {
        days: formatTime(timeLeft.days),
        hours: formatTime(timeLeft.hours),
        minutes: formatTime(timeLeft.minutes),
        seconds: formatTime(timeLeft.seconds),
      };

  const ariaLabel = isExpired
    ? "Countdown expired"
    : `Time remaining: ${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds`;

  return (
    <CountdownDisplay
      values={values}
      timeLeft={timeLeft}
      targetDate={targetDate}
      ariaLabel={ariaLabel}
    />
  );
};

export default CountdownTimer;
