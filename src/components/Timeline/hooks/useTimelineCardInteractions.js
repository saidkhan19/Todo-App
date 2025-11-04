import { useCallback, useRef } from "react";
import { animate } from "motion/react";

import useTimelineStore, {
  useActiveDatesSelector,
  useInteractionStateSelector,
  useIsInteractingSelector,
} from "../store";
import { useTimelineTrackContext } from "../context";
import { CELL_WIDTH, SCROLL_AREA_WIDTH } from "../consts";
import { daysBetween, getOffsetDate, isSameDate } from "@/utils/date";
import { clamp } from "@/utils/math";
import useInteractionMouseState from "./useInteractionMouseState";
import { useUpdateItem } from "@/hooks/queries";

const useTimelineCardInteractions = (project) => {
  const { x, containerRef } = useTimelineTrackContext();
  const isInteractingRef = useRef(false);
  const animationControls = useRef(null);

  const isInteractingState = useIsInteractingSelector(project);
  const interactionState = useInteractionStateSelector(project);
  const activeItem = useTimelineStore((state) => state.activeItem);
  const activeDates = useActiveDatesSelector(project);
  const startInteraction = useTimelineStore((state) => state.startInteraction);
  const stopInteraction = useTimelineStore((state) => state.stopInteraction);
  const updateStartDate = useTimelineStore((state) => state.updateStartDate);
  const updateEndDate = useTimelineStore((state) => state.updateEndDate);
  const updateDates = useTimelineStore((state) => state.updateDates);

  const updateItem = useUpdateItem();

  useInteractionMouseState(interactionState?.interactionType);

  const _startInteraction = useCallback(
    (e, interactionType) => {
      if (isInteractingRef.current || isInteractingState) return;
      e.stopPropagation();
      e.preventDefault();

      isInteractingRef.current = true;
      startInteraction({
        activeItem: project,
        interactionType,
        initialScrollX: x.get(),
        interactionStartPosition: e.clientX,
      });
    },
    [x, project, isInteractingState, startInteraction]
  );

  const handlePointerDownResizeLeft = useCallback(
    (e) => _startInteraction(e, "resize-left"),
    [_startInteraction]
  );

  const handlePointerDownResizeRight = useCallback(
    (e) => _startInteraction(e, "resize-right"),
    [_startInteraction]
  );

  const handlePointerDownDrag = useCallback(
    (e) => _startInteraction(e, "drag"),
    [_startInteraction]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (
        !isInteractingRef.current ||
        !isInteractingState ||
        !containerRef.current
      )
        return;

      // Stop any ongoing scroll animation
      animationControls.current?.stop();

      const container = containerRef.current.getBoundingClientRect();
      const mouseLimitLeft = container.left + SCROLL_AREA_WIDTH;
      const mouseLimitRight = container.right - SCROLL_AREA_WIDTH;

      const mouseX = clamp(mouseLimitLeft, e.clientX, mouseLimitRight);

      // Get total distance moved from the interaction start position
      const delta =
        mouseX -
        interactionState.interactionStartPosition +
        interactionState.initialScrollX -
        x.get();
      let deltaDays = Math.round(delta / CELL_WIDTH);
      let maxLeftScrollReached = false;
      let maxRightScrollReached = false;

      switch (interactionState.interactionType) {
        case "resize-left": {
          // Do not resize past the end date when resizing from left
          const maxResize = daysBetween(project.startDate, project.endDate);
          if (deltaDays > maxResize) {
            maxRightScrollReached = true;
            deltaDays = maxResize;
          }
          const startDate = getOffsetDate(project.startDate, deltaDays);
          updateStartDate(startDate);
          break;
        }
        case "resize-right": {
          // Do not resize past the start date when resizing from right
          const minResize = -daysBetween(project.startDate, project.endDate);
          if (deltaDays < minResize) {
            maxLeftScrollReached = true;
            deltaDays = minResize;
          }
          const endDate = getOffsetDate(project.endDate, deltaDays);
          updateEndDate(endDate);
          break;
        }
        case "drag": {
          const startDate = getOffsetDate(project.startDate, deltaDays);
          const endDate = getOffsetDate(project.endDate, deltaDays);
          updateDates(startDate, endDate);
          break;
        }
      }

      if (e.clientX < mouseLimitLeft && !maxLeftScrollReached) {
        // Scroll left when mouse is in the left scroll area
        animationControls.current = animate(x, x.get() + CELL_WIDTH, {
          duration: 0.13,
          ease: "linear",
          onComplete: () => handlePointerMove(e), // Continue updating if mouse does not move
        });
      } else if (e.clientX > mouseLimitRight && !maxRightScrollReached) {
        // Scroll right when mouse is in the right scroll area
        animationControls.current = animate(x, x.get() - CELL_WIDTH, {
          duration: 0.13,
          ease: "linear",
          onComplete: () => handlePointerMove(e), // Continue updating if mouse does not move
        });
      }
    },
    [
      project,
      x,
      containerRef,
      isInteractingState,
      interactionState,
      updateStartDate,
      updateEndDate,
      updateDates,
    ]
  );

  const handlePointerUp = useCallback(async () => {
    isInteractingRef.current = false;
    animationControls.current?.stop();

    if (
      !isSameDate(activeItem.startDate, activeDates.startDate) ||
      !isSameDate(activeItem.endDate, activeDates.endDate)
    ) {
      // Send updates only if there are changes
      const update = {
        startDate: activeDates.startDate,
        endDate: activeDates.endDate,
      };
      await updateItem(activeItem.id, update);
    }
    stopInteraction();
  }, [stopInteraction, activeItem, activeDates, updateItem]);

  return {
    handlePointerDownResizeLeft,
    handlePointerDownResizeRight,
    handlePointerDownDrag,
    handlePointerMove,
    handlePointerUp,
  };
};

export default useTimelineCardInteractions;
