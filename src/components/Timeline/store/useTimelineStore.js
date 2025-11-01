import { isSameDate } from "@/utils/date";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useTimelineStore = create()(
  devtools((set, get) => ({
    activeItem: null,
    interactionType: null /* null | resize-left | resize-right | drag */,
    initialScrollX: null,
    interactionStartPosition: null,
    activeStartDate: null,
    activeEndDate: null,

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
        activeStartDate: activeItem.startDate,
        activeEndDate: activeItem.endDate,
      }),

    updateStartDate: (newDate) => {
      if (!isSameDate(get().activeStartDate, newDate)) {
        set({ activeStartDate: newDate });
      }
    },

    updateEndDate: (newDate) => {
      if (!isSameDate(get().activeEndDate, newDate)) {
        set({ activeEndDate: newDate });
      }
    },

    updateDates: (activeStartDate, activeEndDate) => {
      const prevState = get();

      if (
        !isSameDate(prevState.activeStartDate, activeStartDate) ||
        !isSameDate(prevState.activeEndDate, activeEndDate)
      ) {
        set({ activeStartDate, activeEndDate });
      }
    },

    stopInteraction: () =>
      set({
        activeItem: null,
        interactionType: null,
        initialScrollX: null,
        interactionStartPosition: null,
        activeStartDate: null,
        activeEndDate: null,
      }),
  }))
);

export default useTimelineStore;
