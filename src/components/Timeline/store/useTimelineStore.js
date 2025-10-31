import { isSameDate } from "@/utils/date";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useTimelineStore = create()(
  devtools((set, get) => ({
    activeItem: null,
    interactionType: null /* null | resizeLeft | resizeRight | drag */,
    initialScrollX: null,
    interactionStartPosition: null,
    newStartDate: null,
    newEndDate: null,

    startInteraction: ({
      activeItem,
      interactionType,
      initialScrollX,
      interactionStartPosition,
    }) =>
      set({
        activeItem,
        interactionType,
        initialScrollX,
        interactionStartPosition,
        newStartDate: activeItem.startDate,
        newEndDate: activeItem.endDate,
      }),

    updateStartDate: (newDate) => {
      if (!isSameDate(get().newStartDate, newDate)) {
        set({ newStartDate: newDate });
      }
    },

    updateEndDate: (newDate) => {
      if (!isSameDate(get().newEndDate, newDate)) {
        set({ newEndDate: newDate });
      }
    },

    updateDates: (newStartDate, newEndDate) => {
      const prevState = get();

      if (
        !isSameDate(prevState.newStartDate, newStartDate) ||
        !isSameDate(prevState.newEndDate, newEndDate)
      ) {
        set({ newStartDate, newEndDate });
      }
    },

    stopInteraction: () =>
      set({
        activeItem: null,
        interactionType: null,
        initialScrollX: null,
        interactionStartPosition: null,
        newStartDate: null,
        newEndDate: null,
      }),
  }))
);

export default useTimelineStore;
