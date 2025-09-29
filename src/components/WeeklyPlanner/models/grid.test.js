import { describe, expect, it } from "vitest";

import { grid } from "./grid";
import Week from "./week";
import { getWeekdayFromMonday } from "@/utils/date";

describe("WeeklyPlanner Grid", () => {
  // start of week is '09-22-2025' Monday, end of week is '09-28-2025' Sunday
  const mockWeek = new Week(new Date("09-28-2025"));

  describe("layoutGrid", () => {
    it("returns an array of 7 empty columns when there are no tasks on this week", () => {
      const mockItems = [
        { type: "task", endDate: new Date("09-21-2025"), order: 1 },
        { type: "task", endDate: new Date("09-29-2025"), order: 2 },
        { type: "project", endDate: new Date("09-28-2025"), order: 3 },
      ];
      const result = grid.layoutGrid(mockWeek, mockItems);

      expect(result).toHaveLength(7);
      result.forEach((array) => expect(array).toHaveLength(0));
    });

    it("inserts each task into appropriate column", () => {
      const mockItems = [
        { type: "task", endDate: new Date("09-22-2025"), order: 1 },
        { type: "task", endDate: new Date("09-23-2025"), order: 1 },
        { type: "task", endDate: new Date("09-24-2025"), order: 1 },
        { type: "task", endDate: new Date("09-25-2025"), order: 1 },
        { type: "task", endDate: new Date("09-26-2025"), order: 1 },
        { type: "task", endDate: new Date("09-27-2025"), order: 1 },
        { type: "task", endDate: new Date("09-28-2025"), order: 1 },
      ];

      const result = grid.layoutGrid(mockWeek, mockItems);

      result.forEach((day, index) => {
        day.forEach((task) => {
          expect(getWeekdayFromMonday(task.endDate)).toBe(index);
        });
      });
    });

    it("sorts tasks by order within the column when all tasks have 'order' property", () => {
      const mockItems = [
        { type: "task", endDate: new Date("09-22-2025"), order: 3 },
        { type: "task", endDate: new Date("09-22-2025"), order: 1 },
        { type: "task", endDate: new Date("09-22-2025"), order: 0 },
        { type: "task", endDate: new Date("09-22-2025"), order: 2 },
      ];

      const result = grid.layoutGrid(mockWeek, mockItems);

      result[0].forEach((task, index) => {
        expect(task.order).toBe(index);
      });
    });

    it("sorts tasks by created time within the column when some items do not have 'order' property", () => {
      const mockItems = [
        // Does not have 'order'
        {
          type: "task",
          endDate: new Date("09-22-2025"),
          createdAt: new Date("09-04-2025"),
        },
        {
          type: "task",
          endDate: new Date("09-22-2025"),
          order: 3,
          createdAt: new Date("09-03-2025"),
        },
        {
          type: "task",
          endDate: new Date("09-22-2025"),
          order: 0,
          createdAt: new Date("09-02-2025"),
        },
        {
          type: "task",
          endDate: new Date("09-22-2025"),
          order: 2,
          createdAt: new Date("09-01-2025"),
        },
      ];

      const result = grid.layoutGrid(mockWeek, mockItems);

      result[0].forEach((task, index) => {
        expect(task.createdAt.getDate()).toBe(index + 1);
      });
    });
  });

  describe("applyDragToGrid", () => {
    it("does not make any changes when dragStartPosition and dragEndPosition are null", () => {
      const mockItems = [
        { type: "task", endDate: new Date("09-22-2025"), order: 1 },
        { type: "task", endDate: new Date("09-23-2025"), order: 1 },
        { type: "task", endDate: new Date("09-24-2025"), order: 1 },
      ];

      const result = grid.applyDragToGrid(mockWeek, mockItems, null, null);

      result.forEach((day, index) => {
        day.forEach((task) => {
          expect(getWeekdayFromMonday(task.endDate)).toBe(index);
        });
      });
    });

    it("removes the task at dragStartPosition", () => {
      const mockItems = [
        { type: "task", endDate: new Date("09-22-2025"), order: 1 },
        { type: "task", endDate: new Date("09-22-2025"), order: 2 },
        { type: "task", endDate: new Date("09-23-2025"), order: 1 },
      ];

      const result = grid.applyDragToGrid(
        mockWeek,
        mockItems,
        { row: 0, column: 0 },
        { row: 0, column: 6 }
      );

      expect(result[0]).toHaveLength(1);
      expect(result[0][0].order).toBe(2);
    });

    it("correctly adds a string value 'PLACEHOLDER' at dragEndPosition", () => {
      const mockItems = [
        { type: "task", endDate: new Date("09-22-2025"), order: 1 },
        { type: "task", endDate: new Date("09-22-2025"), order: 2 },
        { type: "task", endDate: new Date("09-23-2025"), order: 1 },
        { type: "task", endDate: new Date("09-23-2025"), order: 2 },
      ];

      const result = grid.applyDragToGrid(
        mockWeek,
        mockItems,
        { row: 0, column: 0 },
        { row: 1, column: 1 }
      );

      expect(result[1]).toHaveLength(3);

      expect(result[1][0].order).toBe(1);
      expect(result[1][1]).toBe("PLACEHOLDER");
      expect(result[1][2].order).toBe(2);
    });
  });

  describe("getDragEndUpdates", () => {
    const dragItem = {
      id: "dragged-item",
      type: "task",
      startDate: new Date("09-20-2025"),
      endDate: new Date("09-22-2025"),
      order: 0,
    };

    it("returns updates for the updated column", () => {
      const mockItems = [
        dragItem,
        {
          id: "item-1",
          type: "task",
          endDate: new Date("09-22-2025"),
          order: 1,
        },
        {
          id: "item-2",
          type: "task",
          endDate: new Date("09-23-2025"),
          order: 1,
        },
        {
          id: "item-3",
          type: "task",
          endDate: new Date("09-23-2025"),
          order: 2,
        },
      ];

      const result = grid.getDragEndUpdates(
        mockItems,
        mockWeek,
        { row: 0, column: 0 },
        { row: 1, column: 1 },
        dragItem
      );

      // Updates correct items
      expect(result[0].docId).toBe("item-2");
      expect(result[1].docId).toBe("dragged-item");
      expect(result[2].docId).toBe("item-3");

      result.forEach((update, index) => {
        // Updates 'order' property
        expect(update.data.order).toBe(index);

        // Updates the 'endDate'
        expect(update.data.endDate.getTime()).toBe(
          new Date("09-23-2025").getTime()
        );
      });
    });

    it("handles updates within the same column", () => {
      const mockItems = [
        dragItem,
        {
          id: "item-1",
          type: "task",
          endDate: new Date("09-22-2025"),
          order: 1,
        },
        {
          id: "item-2",
          type: "task",
          endDate: new Date("09-22-2025"),
          order: 2,
        },
      ];

      const result = grid.getDragEndUpdates(
        mockItems,
        mockWeek,
        { row: 0, column: 0 },
        { row: 2, column: 0 },
        dragItem
      );

      // Updates correct items
      expect(result[0].docId).toBe("item-1");
      expect(result[1].docId).toBe("item-2");
      expect(result[2].docId).toBe("dragged-item");

      result.forEach((update, index) => {
        // Updates 'order' property
        expect(update.data.order).toBe(index);

        // Updates the 'endDate'
        expect(update.data.endDate.getTime()).toBe(
          new Date("09-22-2025").getTime()
        );
      });
    });
  });

  describe("getMoveItemUpdates", () => {
    const mockItems = [
      {
        id: "item-1",
        type: "task",
        endDate: new Date("09-22-2025"),
        order: 1,
      },
      {
        id: "item-2",
        type: "task",
        endDate: new Date("09-22-2025"),
        order: 2,
      },
      {
        id: "item-3",
        type: "task",
        endDate: new Date("09-22-2025"),
        order: 3,
      },
      {
        id: "item-4",
        type: "task",
        endDate: new Date("09-23-2025"),
        order: 2,
      },
      {
        id: "item-5",
        type: "task",
        endDate: new Date("09-24-2025"),
        order: 1,
      },
      {
        id: "item-6",
        type: "task",
        endDate: new Date("09-25-2025"),
        order: 1,
      },
      {
        id: "item-7",
        type: "task",
        endDate: new Date("09-25-2025"),
        order: 2,
      },
      {
        id: "item-8",
        type: "task",
        endDate: new Date("09-26-2025"),
        order: 2,
      },
      {
        id: "item-9",
        type: "task",
        endDate: new Date("09-28-2025"),
        order: 2,
      },
      {
        id: "item-10",
        type: "task",
        endDate: new Date("09-28-2025"),
        order: 2,
      },
    ];

    it("correctly moves item up", () => {
      // Move 'item-2' to first row
      const result = grid.getMoveItemUpdates(mockItems, 1, 0, "up", mockWeek);

      // Week does not change
      expect(result.targetWeek.equals(mockWeek)).toBe(true);

      // 'item-2' is at '0' index
      expect(result.updates).toHaveLength(3);
      expect(result.updates[0].docId).toBe("item-2");
      expect(result.updates[1].docId).toBe("item-1");
      expect(result.updates[2].docId).toBe("item-3");

      // Their orders got updated
      result.updates.forEach((update, index) => {
        expect(update.data.order).toBe(index);
      });
    });

    it("returns 'undefined' when item can't be moved up", () => {
      // Move 'item-1' to first row, when it is already in the first row
      const result = grid.getMoveItemUpdates(mockItems, 0, 0, "up", mockWeek);

      // result is undefined
      expect(result).toBeUndefined();
    });

    it("correctly moves item down", () => {
      // Move 'item-2' to last row
      const result = grid.getMoveItemUpdates(mockItems, 1, 0, "down", mockWeek);

      // Week does not change
      expect(result.targetWeek.equals(mockWeek)).toBe(true);

      // 'item-2' is at index '2'
      expect(result.updates[0].docId).toBe("item-1");
      expect(result.updates[1].docId).toBe("item-3");
      expect(result.updates[2].docId).toBe("item-2");

      // Their orders got updated
      result.updates.forEach((update, index) => {
        expect(update.data.order).toBe(index);
      });
    });

    it("returns 'undefined' when item can't be moved down", () => {
      // Move 'item-3' to last row, when it is already in the last row
      const result = grid.getMoveItemUpdates(mockItems, 2, 0, "down", mockWeek);

      // result is undefined
      expect(result).toBeUndefined();
    });

    it("correctly moves item left", () => {
      // Move 'item-6' to left column at index '2'
      const result = grid.getMoveItemUpdates(mockItems, 0, 3, "left", mockWeek);

      // Week does not change
      expect(result.targetWeek.equals(mockWeek)).toBe(true);

      // 'item-6' is inserted as the last item
      expect(result.updates).toHaveLength(2);
      expect(result.updates[0].docId).toBe("item-5");
      expect(result.updates[1].docId).toBe("item-6");

      // Their orders got updated
      result.updates.forEach((update, index) => {
        expect(update.data.order).toBe(index);
      });
    });

    it("correctly moves item right", () => {
      // Move 'item-6' to right column at index '4'
      const result = grid.getMoveItemUpdates(
        mockItems,
        0,
        3,
        "right",
        mockWeek
      );

      // Week does not change
      expect(result.targetWeek.equals(mockWeek)).toBe(true);

      // 'item-6' is inserted as the last item
      expect(result.updates).toHaveLength(2);
      expect(result.updates[0].docId).toBe("item-8");
      expect(result.updates[1].docId).toBe("item-6");

      // Their orders got updated
      result.updates.forEach((update, index) => {
        expect(update.data.order).toBe(index);
      });
    });

    it("correctly moves item left to the previous week", () => {
      // Move 'item-1' to left
      const result = grid.getMoveItemUpdates(mockItems, 0, 0, "left", mockWeek);

      // Week changes to the previous week
      expect(result.targetWeek.equals(mockWeek.getPreviousWeek())).toBe(true);

      // 'item-1' is inserted alone in that column
      expect(result.updates).toHaveLength(1);
      expect(result.updates[0].docId).toBe("item-1");

      // Their orders got updated
      result.updates.forEach((update, index) => {
        expect(update.data.order).toBe(index);
      });
    });

    it("correctly moves item right to the next week", () => {
      // Move 'item-10' to right
      const result = grid.getMoveItemUpdates(
        mockItems,
        1,
        6,
        "right",
        mockWeek
      );

      // Week changes to the next week
      expect(result.targetWeek.equals(mockWeek.getNextWeek())).toBe(true);

      // 'item-10' is inserted alone in that column
      expect(result.updates).toHaveLength(1);
      expect(result.updates[0].docId).toBe("item-10");

      // Their orders got updated
      result.updates.forEach((update, index) => {
        expect(update.data.order).toBe(index);
      });
    });
  });
});
