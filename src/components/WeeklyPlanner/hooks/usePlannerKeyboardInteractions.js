import { useCallback } from "react";

const usePlannerKeyboardInteractions = ({ moveItem }) => {
  const handleKeyboardInteractions = useCallback(
    (e) => {
      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;

      e.preventDefault();

      const cell = e.target.closest('[role="gridcell"]');
      if (!cell) return;

      const row = +cell.dataset.row;
      const column = +cell.dataset.column;

      switch (e.key) {
        case "ArrowUp":
          moveItem(row, column, "up");
          break;
        case "ArrowDown":
          moveItem(row, column, "down");
          break;
        case "ArrowLeft":
          moveItem(row, column, "left");
          break;
        case "ArrowRight":
          moveItem(row, column, "right");
          break;
      }
    },
    [moveItem]
  );

  return handleKeyboardInteractions;
};

export default usePlannerKeyboardInteractions;
