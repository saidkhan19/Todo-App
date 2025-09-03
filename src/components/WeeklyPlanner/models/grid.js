import memoizeOne from "memoize-one";

export const grid = {
  layoutGrid: memoizeOne((currentWeek, items) => {
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
        col.sort((a, b) => a.order - b.order);
      } else {
        col.sort((a, b) => a.createdAt - b.createdAt);
      }
    }

    return columns;
  }),

  layoutTasksForCurrentWeek: memoizeOne(
    (currentWeek, items, dragStartPosition, dragEndPosition) => {
      const layout = grid.layoutGrid(currentWeek, items);
      return grid.applyDragModifications(
        layout,
        dragStartPosition,
        dragEndPosition
      );
    }
  ),

  applyDragModifications: (layout, dragStartPosition, dragEndPosition) => {
    // Copy layout first
    const modifiedLayout = Array.from(layout, (col) => Array.from(col));

    // Remove item at dragStartPosition and add placeholder value at dragEndPosition
    if (dragStartPosition)
      modifiedLayout[dragStartPosition.column].splice(dragStartPosition.row, 1);

    if (dragEndPosition)
      modifiedLayout[dragEndPosition.column].splice(
        dragEndPosition.row,
        0,
        "PLACEHOLDER"
      );

    return modifiedLayout;
  },

  getGridColumn: (grid, columnIndex) => {
    return Array.from(grid[columnIndex]);
  },

  getGridItem: (grid, row, column) => {
    return grid[column][row];
  },

  getMaxRowCount: (currentWeek, items, dragStartPosition, dragEndPosition) => {
    const layout = grid.layoutTasksForCurrentWeek(
      currentWeek,
      items,
      dragStartPosition,
      dragEndPosition
    );

    return layout.reduce(
      (max, col) => (max < col.length ? col.length : max),
      0
    );
  },

  getDragEndUpdates: (
    items,
    currentWeek,
    dragStartPosition,
    dragEndPosition,
    dragItem
  ) => {
    const layout = grid.layoutGrid(currentWeek, items);
    const column = grid.getGridColumn(layout, dragEndPosition.column);

    if (column.includes(dragItem)) {
      column.splice(dragStartPosition.row, 1);
    }
    column.splice(dragEndPosition.row, 0, dragItem);

    return grid.generateOrderUpdates(
      column,
      currentWeek,
      dragEndPosition.column
    );
  },

  getMoveItemUpdates: (
    items,
    row,
    column,
    direction /* up/down/left/right */,
    currentWeek
  ) => {
    // Get the changed item
    let layout = grid.layoutGrid(currentWeek, items);
    const columnItems = grid.getGridColumn(layout, column);
    const item = grid.getGridItem(layout, row, column);

    let targetRow = row;
    let targetColumn = column;
    let targetWeek = currentWeek;

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
          targetWeek = currentWeek.getPreviousWeek();
          targetColumn = 6;
        } else {
          targetColumn = column - 1;
        }
        break;
      case "right":
        if (column === 6) {
          targetWeek = currentWeek.getNextWeek();
          targetColumn = 0;
        } else {
          targetColumn = column + 1;
        }
        break;
      default:
        return;
    }

    layout = grid.layoutGrid(targetWeek, items);
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

    return {
      updates: grid.generateOrderUpdates(
        targetColumnItems,
        targetWeek,
        targetColumn
      ),
      targetWeek,
    };
  },

  generateOrderUpdates: (column, currentWeek, columnIndex) => {
    return column.map((item, index) => {
      const endDate = currentWeek.getWeekDate(columnIndex);
      const data = { order: index, endDate };

      // Update startDate if it comes after the new endDate
      if (item.startDate > endDate) {
        data.startDate = endDate;
      }

      return { docId: item.id, data };
    });
  },
};
