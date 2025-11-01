import { useCallback, useRef } from "react";
import { animate } from "motion/react";

import useTimelineStore, {
  useInteractionStateSelector,
  useIsInteractingSelector,
} from "../store";
import { useTimelineTrackContext } from "../context";
import { CELL_WIDTH, SCROLL_AREA_WIDTH } from "../consts";
import { daysBetween, getOffsetDate } from "@/utils/date";
import { clamp } from "@/utils/math";
import useInteractionMouseState from "./useInteractionMouseState";

const useTimelineCardInteractions = (project) => {
  const { x, containerRef } = useTimelineTrackContext();
  const isInteractingRef = useRef(false);
  const animationControls = useRef(null);

  const isInteractingState = useIsInteractingSelector(project);
  const interactionState = useInteractionStateSelector(project);
  const startInteraction = useTimelineStore((state) => state.startInteraction);
  const stopInteraction = useTimelineStore((state) => state.stopInteraction);
  const updateStartDate = useTimelineStore((state) => state.updateStartDate);
  const updateEndDate = useTimelineStore((state) => state.updateEndDate);
  const updateDates = useTimelineStore((state) => state.updateDates);

  useInteractionMouseState(interactionState?.interactionType);

  const handlePointerDownResizeLeft = useCallback(
    (e) => {
      if (isInteractingRef.current || isInteractingState) return;
      e.stopPropagation();
      e.preventDefault();

      isInteractingRef.current = true;
      startInteraction({
        activeItem: project,
        interactionType: "resize-left",
        initialScrollX: x.get(),
        interactionStartPosition: e.clientX,
      });
    },
    [x, project, isInteractingState, startInteraction]
  );

  const handlePointerDownResizeRight = useCallback(
    (e) => {
      if (isInteractingRef.current || isInteractingState) return;
      e.stopPropagation();
      e.preventDefault();

      isInteractingRef.current = true;
      startInteraction({
        activeItem: project,
        interactionType: "resize-right",
        initialScrollX: x.get(),
        interactionStartPosition: e.clientX,
      });
    },
    [x, project, isInteractingState, startInteraction]
  );

  const handlePointerDownDrag = useCallback(
    (e) => {
      if (isInteractingRef.current || isInteractingState) return;
      e.stopPropagation();
      e.preventDefault();

      isInteractingRef.current = true;
      startInteraction({
        activeItem: project,
        interactionType: "drag",
        initialScrollX: x.get(),
        interactionStartPosition: e.clientX,
      });
    },
    [x, project, isInteractingState, startInteraction]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (
        !isInteractingRef.current ||
        !isInteractingState ||
        !containerRef.current
      )
        return;

      animationControls.current?.stop();

      const container = containerRef.current.getBoundingClientRect();
      const mouseLimitLeft = container.left + SCROLL_AREA_WIDTH;
      const mouseLimitRight = container.right - SCROLL_AREA_WIDTH;

      const mouseX = clamp(mouseLimitLeft, e.clientX, mouseLimitRight);

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
        // Scroll left
        animationControls.current = animate(x, x.get() + CELL_WIDTH, {
          duration: 0.13,
          ease: "linear",
          onComplete: () => handlePointerMove(e),
        });
      } else if (e.clientX > mouseLimitRight && !maxRightScrollReached) {
        // Scroll right
        animationControls.current = animate(x, x.get() - CELL_WIDTH, {
          duration: 0.13,
          ease: "linear",
          onComplete: () => handlePointerMove(e),
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

  const handlePointerUp = useCallback(() => {
    isInteractingRef.current = false;
    stopInteraction();
  }, [stopInteraction]);

  return {
    handlePointerDownResizeLeft,
    handlePointerDownResizeRight,
    handlePointerDownDrag,
    handlePointerMove,
    handlePointerUp,
  };
};

export default useTimelineCardInteractions;
