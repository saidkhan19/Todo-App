import { create } from "zustand";
import { devtools } from "zustand/middleware";

import Week from "@/models/week";

const usePlannerStore = create()(
  devtools((set, get) => ({
    currentWeek: new Week(),

    isDragging: false,
    dragItem: null,
    dragStartWeek: null,
    dragStartPosition: null,
    dragEndPosition: null,
    focusedItem: null,

    setWeek: (week) => {
      if (!get().currentWeek.equals(week)) {
        set({ currentWeek: week });
      }
    },

    setNextWeek: () =>
      set((state) => ({
        currentWeek: state.currentWeek.getNextWeek(),
      })),

    setPreviousWeek: () =>
      set((state) => ({
        currentWeek: state.currentWeek.getPreviousWeek(),
      })),

    setFocusedItem: (item) => set({ focusedItem: item }),

    startDragging: (row, column, dragItem) =>
      set({
        isDragging: true,
        dragStartPosition: { row, column },
        dragEndPosition: { row, column },
        dragItem,
        dragStartWeek: get().currentWeek,
      }),

    updateDragging: (row, column) => {
      const prev = get().dragEndPosition;

      if (prev.row !== row || prev.column !== column) {
        set({ dragEndPosition: { row, column } });
      }
    },

    stopDragging: () =>
      set({
        isDragging: false,
        dragStartPosition: null,
        dragEndPosition: null,
        dragItem: null,
        dragStartWeek: null,
      }),
  }))
);

export default usePlannerStore;
