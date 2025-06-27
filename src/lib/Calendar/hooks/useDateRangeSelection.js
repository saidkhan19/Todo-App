import { useCallback, useMemo, useRef, useState } from "react";
import { throttle } from "throttle-debounce";

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

  const handleEdgeNavigation = useCallback(
    (e) => {
      if (!selectingDate || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const threshold = 0;
      const { clientX } = e;

      const isNearLeftEdge = clientX < containerRect.left + threshold;
      const isNearRightEdge = clientX > containerRect.right - threshold;

      if (navigationTimeoutRef.current && !isNearLeftEdge && !isNearRightEdge) {
        resetNavigationTimer();
      }

      if (
        !navigationTimeoutRef.current &&
        (isNearLeftEdge || isNearRightEdge)
      ) {
        console.log("moving");
        // While the mouse is outside the grid continue changing the view
        const continueNavigating = (ms) => {
          navigationTimeoutRef.current = setTimeout(() => {
            if (isNearLeftEdge) setPreviousMonth();
            else setNextMonth();

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

      const coord = getCoordinates(e);
      const dateCell = document
        .elementFromPoint(coord.x, coord.y)
        ?.closest("[data-date]");
      if (!dateCell) return;

      const date = parseLocalDateString(dateCell.dataset.date);

      if (datesEqual(date, startDate)) setSelectingDate("start");
      else if (datesEqual(date, endDate)) setSelectingDate("end");
    },
    [selectingDate, startDate, endDate]
  );

  const handlePointerUp = useCallback(() => {
    if (!selectingDate) return;
    resetNavigationTimer();
    alignView(selectingDate === "start" ? startDate : endDate);
    setSelectingDate(null);
  }, [selectingDate, startDate, endDate, alignView]);

  const handlePointerMove = useMemo(
    () =>
      throttle(50, (e) => {
        if (!selectingDate) return;

        handleEdgeNavigation(e);
        console.log("move");

        const dateCell = document
          .elementFromPoint(e.clientX, e.clientY)
          ?.closest("[data-date]");

        if (!dateCell?.dataset.date) return;

        const date = parseLocalDateString(dateCell.dataset.date);
        const { newStart, newEnd, newMode } = calculateDateRange(
          date,
          startDate,
          endDate,
          selectingDate
        );

        if (newMode !== selectingDate) setSelectingDate(newMode);
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
