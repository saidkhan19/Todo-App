import { DEFAULT_PROJECT_ID } from "@/consts/database";
import { grid } from "./grid";

export const getMaxRowCount = (state) => {
  const layout = grid.layoutTasksForCurrentWeek(
    state.currentWeek,
    state.items,
    state.dragStartPosition,
    state.dragEndPosition
  );

  return layout.reduce((max, col) => (max < col.length ? col.length : max), 0);
};

export const createCellSelector = (row, column) => (state) => {
  const layout = grid.layoutTasksForCurrentWeek(
    state.currentWeek,
    state.items,
    state.dragStartPosition,
    state.dragEndPosition
  );

  let items = [];

  if (layout[column][row]) items.push(layout[column][row]);

  if (
    state.isDragging &&
    state.dragStartPosition.row === row &&
    state.dragStartPosition.column === column
  )
    items.push(state.dragItem);

  return items;
};

export const createRootProjectSelector = (item) => (state) => {
  let curr = item;
  while (curr.parentId != null) {
    if (curr.parentId === DEFAULT_PROJECT_ID) return state.defaultProject;
    curr = state.items.find((i) => i.id === curr.parentId);
  }

  return curr;
};
