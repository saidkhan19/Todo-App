import { create } from "zustand";

const useTimelineStore = create((set) => ({
  activeItem: null,
  interactionType: null /* null | resizeLeft | resizeRight | drag */,

  initializeInteraction: (item, interactionType) =>
    set({ activeItem: item, interactionType }),

  stopInteraction: () => set({ activeItem: null, interactionType: null }),
}));

export default useTimelineStore;
