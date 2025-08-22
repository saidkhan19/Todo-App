import useNotificationStore from "@/store/useNotificationStore";
import { batchUpdateItems } from "@/utils/firebase";
import { grid } from "./grid";

export const plannerActions = (set) => ({
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
});

export const itemActions = (set, get) => ({
  setFocusedItem: (item) => set({ focusedItem: item }),

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
      const layout = grid.layoutGrid(currentWeek, items);
      const column = grid.getGridColumn(layout, dragEndPosition.column);

      if (column.includes(dragItem)) {
        // Remove item if it is in this column
        column.splice(dragStartPosition.row, 1);
      }
      // Insert at new position
      column.splice(dragEndPosition.row, 0, dragItem);

      const updates = grid.generateOrderUpdates(
        column,
        currentWeek,
        dragEndPosition.column
      );
      batchUpdateItems(updates, useNotificationStore.getState().notify);
    }

    set({
      isDragging: false,
      dragStartPosition: null,
      dragEndPosition: null,
      dragItem: null,
    });
  },

  moveItem: (row, column, direction /* up/down/left/right */) => {
    let state = get();

    if (state.isDragging) return;

    // Get the changed item
    let layout = grid.layoutGrid(state.currentWeek, state.items);
    const columnItems = grid.getGridColumn(layout, column);
    const item = grid.getGridItem(layout, row, column);

    let targetRow = row;
    let targetColumn = column;

    switch (direction) {
      case "up":
        if (row === 0) return;
        targetRow = row - 1;
        break;
      case "down":
        if (row === columnItems.length - 1) return;
        targetRow = row + 1;
        break;
      case "left":
        if (column === 0) {
          state.setPreviousWeek();
          targetColumn = 6;
        } else {
          targetColumn = column - 1;
        }
        break;
      case "right":
        if (column === 6) {
          state.setNextWeek();
          targetColumn = 0;
        } else {
          targetColumn = column + 1;
        }
        break;
      default:
        return;
    }

    // We might have made updates
    state = get();

    layout = grid.layoutGrid(state.currentWeek, state.items);
    const targetColumnItems = grid.getGridColumn(layout, targetColumn);

    if (targetColumnItems.includes(item)) {
      // Remove item if it is in this column
      targetColumnItems.splice(row, 1);
    } else {
      // Move to last position if it is different column
      targetRow = targetColumnItems.length;
    }
    // Insert at new position
    targetColumnItems.splice(targetRow, 0, item);

    const updates = grid.generateOrderUpdates(
      targetColumnItems,
      state.currentWeek,
      targetColumn
    );
    batchUpdateItems(updates, useNotificationStore.getState().notify);
  },
});
