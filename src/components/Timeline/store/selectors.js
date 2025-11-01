import { useShallow } from "zustand/shallow";

import useTimelineStore from "./useTimelineStore";

export const useIsInteractingSelector = (project) => {
  return useTimelineStore((state) => state.activeItem?.id === project.id);
};

export const useInteractionStateSelector = (project) => {
  return useTimelineStore(
    useShallow((state) => {
      if (state.activeItem?.id !== project.id) return null;
      return {
        interactionType: state.interactionType,
        initialScrollX: state.initialScrollX,
        interactionStartPosition: state.interactionStartPosition,
      };
    })
  );
};

export const useActiveDatesSelector = (project) => {
  return useTimelineStore(
    useShallow((state) => {
      if (state.activeItem?.id !== project.id) return null;
      return {
        startDate: state.activeStartDate,
        endDate: state.activeEndDate,
      };
    })
  );
};
