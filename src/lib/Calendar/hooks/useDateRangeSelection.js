import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { throttle } from "throttle-debounce";

import leftArrowImg from "@/assets/icons/arrow-left.png";
import rightArrowImg from "@/assets/icons/arrow-right.png";
import { datesEqual, getCoordinates, parseLocalDateString } from "../utils";

const calculateDateRange = (newDate, startDate, endDate, mode) => {
  if (mode === "start") {
    if (newDate <= endDate) {
      return {
        newStart: newDate,
        newEnd: endDate,
        newMode: "start",
      };
    } else {
      return {
        newStart: endDate,
        newEnd: newDate,
        newMode: "end",
      };
    }
  } else {
    // mode === "end"
    if (newDate >= startDate) {
      return {
        newStart: startDate,
        newEnd: newDate,
        newMode: "end",
      };
    } else {
      return {
        newStart: newDate,
        newEnd: startDate,
        newMode: "start",
      };
    }
  }
};

const useDateRangeSelection = ({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  alignView,
  setPreviousMonth,
  setNextMonth,
  containerRef,
}) => {
  const [selectingDate, setSelectingDate] = useState(null); // null | 'start' | 'end'
  const navigationTimeoutRef = useRef();

  const resetNavigationTimer = () => {
    clearTimeout(navigationTimeoutRef.current);
    navigationTimeoutRef.current = null;
  };

  const resetCursor = () => {
    document.body.style.cursor = "default";
  };

  // Cleanup the timer on unmount, reset cursor
  useEffect(
    () => () => {
      resetNavigationTimer();
      resetCursor();
    },
    []
  );

  // When user hovers beyond the grid, change the view to the previous or next month
  const handleEdgeNavigation = useCallback(
    (e) => {
      if (!selectingDate || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const { clientX } = e;

      const isNearLeftEdge = clientX < containerRect.left;
      const isNearRightEdge = clientX > containerRect.right;

      // Clear the timeout when mouse is back in the grid
      if (navigationTimeoutRef.current && !isNearLeftEdge && !isNearRightEdge) {
        resetNavigationTimer();
        resetCursor();
      }

      if (
        !navigationTimeoutRef.current &&
        (isNearLeftEdge || isNearRightEdge)
      ) {
        document.body.style.cursor = `url(${
          isNearLeftEdge ? leftArrowImg : rightArrowImg
        }), auto`;
        // While the mouse is outside the grid continue changing the view
        const continueNavigating = (ms) => {
          navigationTimeoutRef.current = setTimeout(() => {
            if (isNearLeftEdge) setPreviousMonth();
            else setNextMonth();

            // Subsequent navigations happen with longer pause
            continueNavigating(1200);
          }, ms);
        };
        continueNavigating(500);
      }
    },
    [selectingDate, setPreviousMonth, setNextMonth, containerRef]
  );

  const handlePointerDown = useCallback(
    (e) => {
      if (selectingDate) return;

      e.preventDefault();

      const coord = getCoordinates(e);
      const dateCell = document
        .elementFromPoint(coord.x, coord.y)
        ?.closest("[data-date]");
      if (!dateCell) return;

      const date = parseLocalDateString(dateCell.dataset.date);

      // Mark which end we started dragging
      if (datesEqual(date, startDate)) setSelectingDate("start");
      else if (datesEqual(date, endDate)) setSelectingDate("end");
    },
    [selectingDate, startDate, endDate]
  );

  const handlePointerUp = useCallback(() => {
    if (!selectingDate) return;
    resetNavigationTimer();
    resetCursor();
    // Change the view of the calendar, if we selected outside the current month
    alignView(selectingDate === "start" ? startDate : endDate);
    setSelectingDate(null);
  }, [selectingDate, startDate, endDate, alignView]);

  // Throttled function need to be memoized
  const handlePointerMove = useMemo(
    () =>
      throttle(25, (e) => {
        if (!selectingDate) return;

        // Handle case when pointer is outside the grid
        handleEdgeNavigation(e);

        const dateCell = document
          .elementFromPoint(e.clientX, e.clientY)
          ?.closest("[data-date]");

        if (!dateCell?.dataset.date) return;

        const date = parseLocalDateString(dateCell.dataset.date);
        // The user could have dragged the end beyond the other end. Update the state accordingly.
        const { newStart, newEnd, newMode } = calculateDateRange(
          date,
          startDate,
          endDate,
          selectingDate
        );
        if (newMode !== selectingDate) setSelectingDate(newMode);

        // Both ends are updated
        onChangeStartDate(newStart);
        onChangeEndDate(newEnd);
      }),
    [
      selectingDate,
      startDate,
      endDate,
      onChangeStartDate,
      onChangeEndDate,
      handleEdgeNavigation,
    ]
  );

  return {
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
};

export default useDateRangeSelection;
