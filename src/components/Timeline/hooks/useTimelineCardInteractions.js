import { useCallback, useRef } from "react";
import { useShallow } from "zustand/shallow";
import { animate } from "motion/react";

import useTimelineStore from "../store";
import { useTimelineTrackContext } from "../context";
import { buffer, cellWidth } from "../consts";
import { isSameDate } from "@/utils/date";

const useTimelineCardInteractions = (project) => {
  const { x, baseDate, trackSize } = useTimelineTrackContext();
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

  const handlePointerDownDrag = useCallback(() => {}, []);

  const handlePointerMove = useCallback(
    (e) => {
      if (!isInteractingRef.current || !isInteractingState) return;

      animationControls.current?.stop();

      if (interactionState.interactionType === "resizeLeft") {
        const handleResizeLeft = () => {
          if (!isInteractingRef.current) return;
          const delta =
            interactionState.interactionStartPosition -
            e.clientX -
            interactionState.initialScrollX +
            x.get();
          const deltaDays = Math.round(delta / cellWidth);

          const offset = -Math.floor(x.get() / cellWidth);

          // Calculate the dates at start & end of the viewport
          const trackStartDate = new Date(baseDate);
          trackStartDate.setDate(trackStartDate.getDate() + offset);

          const trackEndDate = new Date(trackStartDate);
          trackEndDate.setDate(
            trackEndDate.getDate() + trackSize - buffer * 2 - 2
          );

          let startDate = new Date(project.startDate);
          startDate.setDate(startDate.getDate() - deltaDays);

          startDate = startDate < trackStartDate ? trackStartDate : startDate;
          startDate = startDate > trackEndDate ? trackEndDate : startDate;
          startDate = startDate > project.endDate ? project.endDate : startDate;

          if (isSameDate(startDate, trackStartDate)) {
            animationControls.current = animate(x, x.get() + cellWidth, {
              duration: 0.15,
              ease: "linear",
              onComplete: handleResizeLeft,
            });
          } else if (isSameDate(startDate, trackEndDate)) {
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
          const delta =
            interactionState.interactionStartPosition -
            e.clientX -
            interactionState.initialScrollX +
            x.get();
          const deltaDays = Math.round(delta / cellWidth);

          const offset = -Math.floor(x.get() / cellWidth);

          // Calculate the dates at start & end of the viewport
          const trackStartDate = new Date(baseDate);
          trackStartDate.setDate(trackStartDate.getDate() + offset);

          const trackEndDate = new Date(trackStartDate);
          trackEndDate.setDate(
            trackEndDate.getDate() + trackSize - buffer * 2 - 2
          );

          let endDate = new Date(project.endDate);
          endDate.setDate(endDate.getDate() - deltaDays);

          endDate = endDate < trackStartDate ? trackStartDate : endDate;
          endDate = endDate > trackEndDate ? trackEndDate : endDate;
          endDate = endDate < project.startDate ? project.startDate : endDate;

          if (isSameDate(endDate, trackStartDate)) {
            animationControls.current = animate(x, x.get() + cellWidth, {
              duration: 0.15,
              ease: "linear",
              onComplete: handleResizeRight,
            });
          } else if (isSameDate(endDate, trackEndDate)) {
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
        const handleDrag = () => {};
        handleDrag();
      }
    },
    [
      project,
      x,
      baseDate,
      trackSize,
      isInteractingState,
      interactionState,
      updateStartDate,
      updateEndDate,
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
