import { useCallback, useLayoutEffect, useRef, useState } from "react";

/**
 * Manages horizontal scrolling behaviour for column-based tables.
 * Intended for tables or grids with fixed-width columns.
 *
 * The hook also throttles scroll updates with requestAnimationFrame to avoid
 * excessive React state updates during rapid scrolling.
 *
 * @param columnWidth - pixel width of each column (used for scroll snapping)
 * @returns Object with:
 * - wrapperRef: a scroll container ref
 * - canScrollPrev, canScrollNext: state indicating whether previous/next scroll buttons should be enabled
 * - scrollByColumn: helper to scroll exactly one column at a time
 */
export const useHorizontalColumnScroll = (columnWidth: number) => {
  // Scroll container ref to detect scroll position and programmatically scroll columns
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  /* requestAnimationFrame id used to throttle scroll updates
Prevents state updates firing excessively during scroll. */
  const rafRef = useRef<number | null>(null);

  /** Determines if the scroll buttons should be enabled/disabled
   * based on the current scroll position. */
  const updateButtons = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    // Tolerance for floating-point rounding when comparing scroll position
    const eps = 2;

    setCanScrollPrev(scrollLeft > eps);
    setCanScrollNext(scrollLeft + clientWidth < scrollWidth - eps);
  }, []);

  useLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const onScroll = () => {
      if (rafRef.current) return;

      rafRef.current = requestAnimationFrame(() => {
        updateButtons();
        rafRef.current = null;
      });
    };
    // passive: true allows browser to optimize scroll performance (no preventDefault)
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Defer initial check to next frame so layout is settled
    const raf = requestAnimationFrame(() => {
      updateButtons();
    });
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updateButtons]);

  // Scrolls to the previous or next column
  const scrollByColumn = useCallback(
    (direction: "prev" | "next") => {
      const el = wrapperRef.current;
      if (!el) return;

      // Furthest scroll position to the right (total content width - visible container width)
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      // Scroll amount left and right
      const delta = direction === "next" ? columnWidth : -columnWidth;
      let targetPosition = el.scrollLeft + delta;
      targetPosition = Math.max(0, Math.min(targetPosition, maxScrollLeft));

      el.scrollTo({
        left: targetPosition,
        behavior: "smooth",
      });
    },
    [columnWidth]
  );

  return {
    wrapperRef,
    canScrollPrev,
    canScrollNext,
    scrollByColumn,
  };
};
