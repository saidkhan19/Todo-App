import { useEffect, useState } from "react";
import { throttle } from "throttle-debounce";

import { useTimelineTrackContext } from "../../context";
import TimelineCard from "../TimelineCard/TimelineCard";
import TimelineAlignButton from "../TimelineAlignButton/TimelineAlignButton";
import { useIsInteractingSelector } from "../../store";
import { isProjectVisible } from "../../utils";

const TimelineItem = ({ project }) => {
  const { x, trackSize, baseDate } = useTimelineTrackContext();

  const [isVisible, setIsVisible] = useState(() =>
    isProjectVisible(project, x.get(), trackSize, baseDate)
  );
  const isInteracting = useIsInteractingSelector(project);

  useEffect(() => {
    // Update visibility when one of the variables changes
    setIsVisible(isProjectVisible(project, x.get(), trackSize, baseDate));
  }, [x, trackSize, baseDate, project]);

  useEffect(() => {
    // Update visibility on timeline scroll
    const throttledHandler = throttle(30, (currentX) => {
      const curr = isProjectVisible(project, currentX, trackSize, baseDate);
      if (curr !== isVisible) setIsVisible(curr);
    });
    const unsubscribe = x.on("change", throttledHandler);

    return () => {
      unsubscribe();
      throttledHandler.cancel();
    };
  }, [x, trackSize, baseDate, project, isVisible]);

  return (
    <>
      {isVisible || isInteracting ? (
        <TimelineCard project={project} />
      ) : (
        <TimelineAlignButton project={project} />
      )}
    </>
  );
};

export default TimelineItem;
