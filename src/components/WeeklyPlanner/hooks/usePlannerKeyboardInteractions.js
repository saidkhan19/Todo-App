import { useCallback } from "react";

import useMoveSelection from "./useMoveSelection";

const usePlannerKeyboardInteractions = (items) => {
  const handleMove = useMoveSelection(items);

  const handleKeyboardInteractions = useCallback(
    (e) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;

      const cell = e.target.closest('[role="gridcell"]');
      if (!cell) return;

      e.preventDefault();

      const row = +cell.dataset.row;
      const column = +cell.dataset.column;

      switch (e.key) {
        case "ArrowUp":
          handleMove(row, column, "up");
          break;
        case "ArrowDown":
          handleMove(row, column, "down");
          break;
        case "ArrowLeft":
          handleMove(row, column, "left");
          break;
        case "ArrowRight":
          handleMove(row, column, "right");
          break;
      }
    },
    [handleMove]
  );

  return handleKeyboardInteractions;
};

export default usePlannerKeyboardInteractions;
