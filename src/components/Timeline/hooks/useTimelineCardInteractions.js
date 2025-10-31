import { useCallback, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { animate } from "motion/react";

import useTimelineStore from "../store";
import { useTimelineTrackContext } from "../context";
import { cellWidth } from "../consts";
import { getOffsetDate } from "@/utils/date";
import { getTaskSpan } from "@/utils/dataTransforms";

const scrollAreaWidth = 70;

const useTimelineCardInteractions = (project) => {
  const { x, containerRef } = useTimelineTrackContext();
  const isInteractingRef = useRef(false);
  const animationControls = useRef(null);
  const isInteractingState = useTimelineStore(
    (state) => state.activeItem?.id === project?.id
  );
  const interactionState = useTimelineStore(
    useShallow((state) => {
      if (state.activeItem?.id !== project.id) return null;
      return {
        interactionType: state.interactionType,
        initialScrollX: state.initialScrollX,
        interactionStartPosition: state.interactionStartPosition,
      };
    })
  );
  const startInteraction = useTimelineStore((state) => state.startInteraction);
  const stopInteraction = useTimelineStore((state) => state.stopInteraction);
  const updateStartDate = useTimelineStore((state) => state.updateStartDate);
  const updateEndDate = useTimelineStore((state) => state.updateEndDate);
  const updateDates = useTimelineStore((state) => state.updateDates);

  const handlePointerDownResizeLeft = useCallback(
    (e) => {
      if (isInteractingRef.current || isInteractingState) return;

      isInteractingRef.current = true;

      document.body.style.cursor = "w-resize";
      startInteraction({
        activeItem: project,
        interactionType: "resizeLeft",
        initialScrollX: x.get(),
        interactionStartPosition: e.clientX,
      });
    },
    [x, project, isInteractingState, startInteraction]
  );

  const handlePointerDownResizeRight = useCallback(
    (e) => {
      if (isInteractingRef.current || isInteractingState) return;

      isInteractingRef.current = true;

      document.body.style.cursor = "e-resize";
      startInteraction({
        activeItem: project,
        interactionType: "resizeRight",
        initialScrollX: x.get(),
        interactionStartPosition: e.clientX,
      });
    },
    [x, project, isInteractingState, startInteraction]
  );

  const handlePointerDownDrag = useCallback(
    (e) => {
      if (isInteractingRef.current || isInteractingState) return;

      isInteractingRef.current = true;

      document.body.style.cursor = "grabbing";
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
      if (!isInteractingRef.current || !isInteractingState) return;

      animationControls.current?.stop();

      if (interactionState.interactionType === "resizeLeft") {
        const handleResizeLeft = () => {
          if (!isInteractingRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const mouseLimitLeft = rect.left + scrollAreaWidth;
          const mouseLimitRight = rect.right - scrollAreaWidth;
          const minDelta = -getTaskSpan(project) + 1;

          let mouseX = e.clientX;
          mouseX = e.clientX < mouseLimitLeft ? mouseLimitLeft : mouseX;
          mouseX = e.clientX > mouseLimitRight ? mouseLimitRight : mouseX;

          const delta =
            interactionState.interactionStartPosition -
            mouseX -
            interactionState.initialScrollX +
            x.get();
          let deltaDays = Math.round(delta / cellWidth);
          let maxRightScrollReached = false;

          if (deltaDays < minDelta) {
            maxRightScrollReached = true;
            deltaDays = minDelta;
          }

          const startDate = getOffsetDate(project.startDate, -deltaDays);

          if (e.clientX < mouseLimitLeft) {
            // Scroll left
            animationControls.current = animate(x, x.get() + cellWidth, {
              duration: 0.15,
              ease: "linear",
              onComplete: handleResizeLeft,
            });
          } else if (e.clientX > mouseLimitRight && !maxRightScrollReached) {
            // Scroll right
            animationControls.current = animate(x, x.get() - cellWidth, {
              duration: 0.15,
              ease: "linear",
              onComplete: handleResizeLeft,
            });
          }

          updateStartDate(startDate);
        };
        handleResizeLeft();
      } else if (interactionState.interactionType === "resizeRight") {
        const handleResizeRight = () => {
          if (!isInteractingRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const mouseLimitLeft = rect.left + scrollAreaWidth;
          const mouseLimitRight = rect.right - scrollAreaWidth;
          const maxDelta = getTaskSpan(project) - 1;

          let mouseX = e.clientX;
          mouseX = e.clientX < mouseLimitLeft ? mouseLimitLeft : mouseX;
          mouseX = e.clientX > mouseLimitRight ? mouseLimitRight : mouseX;

          const delta =
            interactionState.interactionStartPosition -
            mouseX -
            interactionState.initialScrollX +
            x.get();
          let deltaDays = Math.round(delta / cellWidth);
          let maxLeftScrollReached = false;

          if (deltaDays > maxDelta) {
            maxLeftScrollReached = true;
            deltaDays = maxDelta;
          }

          const endDate = getOffsetDate(project.endDate, -deltaDays);

          if (e.clientX < mouseLimitLeft && !maxLeftScrollReached) {
            // Scroll left
            animationControls.current = animate(x, x.get() + cellWidth, {
              duration: 0.15,
              ease: "linear",
              onComplete: handleResizeRight,
            });
          } else if (e.clientX > mouseLimitRight) {
            // Scroll right
            animationControls.current = animate(x, x.get() - cellWidth, {
              duration: 0.15,
              ease: "linear",
              onComplete: handleResizeRight,
            });
          }

          updateEndDate(endDate);
        };
        handleResizeRight();
      } else if (interactionState.interactionType === "drag") {
        const handleDrag = () => {
          if (!isInteractingRef.current) return;
          const rect = containerRef.current.getBoundingClientRect();
          const mouseLimitLeft = rect.left + scrollAreaWidth;
          const mouseLimitRight = rect.right - scrollAreaWidth;

          let mouseX = e.clientX;
          mouseX = e.clientX < mouseLimitLeft ? mouseLimitLeft : mouseX;
          mouseX = e.clientX > mouseLimitRight ? mouseLimitRight : mouseX;

          const delta =
            interactionState.interactionStartPosition -
            mouseX -
            interactionState.initialScrollX +
            x.get();
          let deltaDays = Math.round(delta / cellWidth);

          const startDate = getOffsetDate(project.startDate, -deltaDays);
          const endDate = getOffsetDate(project.endDate, -deltaDays);

          if (e.clientX < mouseLimitLeft) {
            // Scroll left
            animationControls.current = animate(x, x.get() + cellWidth, {
              duration: 0.15,
              ease: "linear",
              onComplete: handleDrag,
            });
          } else if (e.clientX > mouseLimitRight) {
            // Scroll right
            animationControls.current = animate(x, x.get() - cellWidth, {
              duration: 0.15,
              ease: "linear",
              onComplete: handleDrag,
            });
          }
          updateDates(startDate, endDate);
        };
        handleDrag();
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

    document.body.style.cursor = "default";
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
