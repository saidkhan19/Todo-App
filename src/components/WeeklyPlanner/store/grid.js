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
