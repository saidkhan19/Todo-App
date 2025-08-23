import { useCallback, useEffect, useRef } from "react";

import { getCoordinates } from "@/utils/events";

const usePlannerDragEvents = ({
  gridContentRef,
  isDragging,
  rowCount,
  updateDragging,
  setNextWeek,
  setPreviousWeek,
}) => {
  const navigationTimeoutRef = useRef();

  const resetNavigationTimer = () => {
    clearTimeout(navigationTimeoutRef.current);
    navigationTimeoutRef.current = null;
  };

  // Cleanup the timer when drag ends
  useEffect(() => () => resetNavigationTimer(), [isDragging]);

  const handlePointerMove = useCallback(
    (e) => {
      if (!gridContentRef.current) return;

      e.preventDefault();
      const { x, y } = getCoordinates(e);

      const el = document.elementFromPoint(x, y);
      const cell = el?.closest('[role="gridcell"]');

      const rect = gridContentRef.current.getBoundingClientRect();
      const isNearLeftEdge = x < rect.left;
      const isNearRightEdge = x > rect.right;

      // Clear the timeout when mouse is back in the grid
      if (navigationTimeoutRef.current && !isNearLeftEdge && !isNearRightEdge) {
        resetNavigationTimer();
      }

      if (el && cell) {
        // Mouse is on top of existing cell
        const row = +cell.dataset.row;
        const column = +cell.dataset.column;
        updateDragging(row, column);
      } else if (el?.closest('[role="grid"]')) {
        // Mouse is within the droppable area

        const row = y < rect.top ? 0 : rowCount;
        const column = Math.floor((x - rect.left) / (rect.width / 7));

        updateDragging(row, column);
      } else if (
        !navigationTimeoutRef.current &&
        (isNearLeftEdge || isNearRightEdge)
      ) {
        // Mouse is on the sides
        // While the mouse is outside the grid continue changing the view
        const continueNavigating = (ms) => {
          navigationTimeoutRef.current = setTimeout(() => {
            if (isNearLeftEdge) setPreviousWeek();
            else setNextWeek();

            // Subsequent navigations happen with longer pause
            continueNavigating(1200);
          }, ms);
        };
        continueNavigating(500);
      }
    },
    [rowCount, updateDragging, setNextWeek, setPreviousWeek, gridContentRef]
  );

  return handlePointerMove;
};

export default usePlannerDragEvents;
