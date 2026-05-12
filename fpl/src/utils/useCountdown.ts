import { useEffect, useRef, useState } from "react";

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

interface UseCountdownOptions {
  updateInterval?: number;
  onComplete?: () => void;
}

const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = MS_PER_SECOND * 60;
const MS_PER_HOUR = MS_PER_MINUTE * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

const calculateTimeLeft = (targetDate: Date): TimeLeft => {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  // If the target time has passed or is exactly now, return zeros
  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0,
    };
  }

  // Derive days, hours, minutes, and seconds from the difference
  const days = Math.floor(difference / MS_PER_DAY);
  const remainderAfterDays = difference % MS_PER_DAY;

  const hours = Math.floor(remainderAfterDays / MS_PER_HOUR);
  const remainderAfterHours = remainderAfterDays % MS_PER_HOUR;

  const minutes = Math.floor(remainderAfterHours / MS_PER_MINUTE);
  const remainderAfterMinutes = remainderAfterHours % MS_PER_MINUTE;

  const seconds = Math.floor(remainderAfterMinutes / MS_PER_SECOND);

  // Return the structured result
  return {
    days,
    hours,
    minutes,
    seconds,
    total: difference,
  };
};

export const useCountdown = (
  targetDate: Date | null,
  options?: UseCountdownOptions
): TimeLeft | null => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    targetDate ? calculateTimeLeft(targetDate) : null
  );
  const intervalRef = useRef<number | null>(null);

  // Keep latest onComplete in a ref to avoid restarting interval when it changes
  const onCompleteRef = useRef<(() => void) | undefined>();
  useEffect(() => {
    onCompleteRef.current = options?.onComplete;
  }, [options?.onComplete]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // If there is no target date, reset state and exit
    if (!targetDate) {
      setTimeLeft(null);
      return;
    }

    // Calculate initial time left
    const initial = calculateTimeLeft(targetDate);
    setTimeLeft(initial);

    // If already expired, call onComplete and don't start an interval
    const intervalMs = options?.updateInterval ?? 1000;
    if (initial.total <= 0) {
      onCompleteRef.current?.();
      return;
    }

    // Set up the interval
    intervalRef.current = window.setInterval(() => {
      // Recalculate the time left
      const next = calculateTimeLeft(targetDate);

      // Update state
      setTimeLeft(next);

      // If expired, clear interval and call onComplete once
      if (next.total <= 0) {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        onCompleteRef.current?.();
      }
    }, intervalMs);

    // Cleanup: clear the interval on unmount / deps change
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [targetDate, options?.updateInterval]);

  return timeLeft;
};
