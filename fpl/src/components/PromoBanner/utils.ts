const ninetyMinutesMs = 90 * 60 * 1000;

export const shouldShowPromoBanner = (
  deadlineTime?: string,
  nowMs: number = Date.now()
): boolean => {
  if (!deadlineTime) {
    return false;
  }

  const deadlineMs = new Date(deadlineTime).getTime();

  if (Number.isNaN(deadlineMs)) {
    return false;
  }

  return nowMs < deadlineMs + ninetyMinutesMs;
};
