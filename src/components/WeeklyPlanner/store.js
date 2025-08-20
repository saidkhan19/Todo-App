import { create } from "zustand";
import { devtools } from "zustand/middleware";
import memoizeOne from "memoize-one";

import Week from "./models/week";
import { batchUpdateItems } from "@/utils/firebase";
import useNotificationStore from "@/store/useNotificationStore";

const layoutGrid = memoizeOne((currentWeek, items) => {
  const currentTasks = items.filter(
    (item) =>
      item.type === "task" &&
      currentWeek.startOfWeek <= item.endDate &&
      currentWeek.endOfWeek >= item.endDate
  );

  const columns = new Array(7);
  for (let i = 0; i < 7; i++) columns[i] = [];

  for (const task of currentTasks) {
    let index = task.endDate.getDay();
    // Make Monday the first day
    index = (index === 0 ? 6 : -1) + index;
    columns[index].push(task);
  }

  // Sort items within the column
  for (const col of columns) {
    if (col.every((task) => "order" in task)) {
      // Sort by 'order' property if it exists
      col.sort((a, b) => a.order - b.order);
    } else {
      // Else sort by created date
      col.sort((a, b) => a.createdAt - b.createdAt);
    }
  }

  return columns;
});

const layoutTasksForCurrentWeek = memoizeOne(
  (currentWeek, items, dragStartPosition, dragEndPosition) => {
    const grid = layoutGrid(currentWeek, items);

    // Copy grid first
    const modifiedGrid = Array.from(grid, (col) => Array.from(col));

    // Remove item at dragStartPosition and add placeholder value at dragEndPosition
    if (dragStartPosition)
      modifiedGrid[dragStartPosition.column].splice(dragStartPosition.row, 1);

    if (dragEndPosition)
      modifiedGrid[dragEndPosition.column].splice(
        dragEndPosition.row,
        0,
        "PLACEHOLDER"
      );

    return modifiedGrid;
  }
);

export const getMaxRowCount = (state) => {
  const grid = layoutTasksForCurrentWeek(
    state.currentWeek,
    state.items,
    state.dragStartPosition,
    state.dragEndPosition
  );

  return grid.reduce((max, col) => (max < col.length ? col.length : max), 0);
};

export const getCell = (row, column) => (state) => {
  const grid = layoutTasksForCurrentWeek(
    state.currentWeek,
    state.items,
    state.dragStartPosition,
    state.dragEndPosition
  );

  let items = [];

  if (grid[column][row]) items.push(grid[column][row]);

  if (
    state.isDragging &&
    state.dragStartPosition.row === row &&
    state.dragStartPosition.column === column
  )
    items.push(state.dragItem);

  return items;
};

export const getRootProject = (item) => (state) => {
  let curr = item;
  while (curr.parentId != null) {
    if (curr.parentId === "TASKS") return state.defaultProject;
    curr = state.items.find((i) => i.id === curr.parentId);
  }

  return curr;
};

const usePlannerStore = create()(
  devtools((set, get) => ({
    currentWeek: new Week(),
    items: [],
    defaultProject: null,
    isDragging: false,
    dragItem: null,
    dragStartPosition: null,
    dragEndPosition: null,
    startDragging: (row, column, dragItem) =>
      set({
        isDragging: true,
        dragStartPosition: { row, column },
        dragEndPosition: { row, column },
        dragItem,
      }),
    updateDragging: (row, column) => set({ dragEndPosition: { row, column } }),
    stopDragging: () => {
      const {
        isDragging,
        currentWeek,
        items,
        dragItem,
        dragStartPosition,
        dragEndPosition,
      } = get();

      if (!isDragging) return;

      if (
        dragStartPosition.row !== dragEndPosition.row ||
        dragStartPosition.column !== dragEndPosition.column
      ) {
        const grid = layoutGrid(currentWeek, items);
        const column = Array.from(grid[dragEndPosition.column]);
        if (column.includes(dragItem)) {
          column.splice(dragStartPosition.row, 1);
        }
        column.splice(dragEndPosition.row, 0, dragItem);

        const updates = column.map((item, index) => {
          const endDate = currentWeek.getWeekDate(dragEndPosition.column);
          const data = { order: index, endDate };

          // endDates can't be earlier than startDates
          // Update startDate in that case
          if (item.startDate > endDate) {
            data.startDate = endDate;
          }

          return { docId: item.id, data };
        });

        batchUpdateItems(updates, useNotificationStore.getState().notify);
      }

      set({
        isDragging: false,
        dragStartPosition: null,
        dragEndPosition: null,
        dragItem: null,
      });
    },

    setItems: (items) => set({ items }),
    setDefaultProject: (defaultProject) => set({ defaultProject }),

    setNextWeek: () =>
      set((state) => ({
        currentWeek: state.currentWeek.getNextWeek(),
      })),

    setPreviousWeek: () =>
      set((state) => ({
        currentWeek: state.currentWeek.getPreviousWeek(),
      })),
  }))
);

export default usePlannerStore;
