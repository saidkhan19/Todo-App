import { useShallow } from "zustand/shallow";

import usePlannerStore from "./usePlannerStore";
import { grid } from "../models/grid";

export const useGetMaxRowCountSelector = (items) => {
  return usePlannerStore((state) => {
    const layout = grid.applyDragToGrid(
      state.currentWeek,
      items,
      state.dragStartWeek,
      state.dragStartPosition,
      state.dragEndPosition
    );

    return layout.reduce(
      (max, col) => (max < col.length ? col.length : max),
      0
    );
  });
};

export const useGridCellSelector = (row, column, items) => {
  return usePlannerStore(
    useShallow((state) => {
      const layout = grid.applyDragToGrid(
        state.currentWeek,
        items,
        state.dragStartWeek,
        state.dragStartPosition,
        state.dragEndPosition
      );

      let cellItems = [];

      if (layout[column][row]) cellItems.push(layout[column][row]);

      if (
        state.isDragging &&
        state.dragStartPosition.row === row &&
        state.dragStartPosition.column === column
      )
        cellItems.push(state.dragItem);

      return cellItems;
    })
  );
};
