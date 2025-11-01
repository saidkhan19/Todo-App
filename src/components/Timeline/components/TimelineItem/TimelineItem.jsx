import { useEffect, useState } from "react";
import { throttle } from "throttle-debounce";

import { useTimelineTrackContext } from "../../context";
import TimelineCard from "../TimelineCard/TimelineCard";
import TimelineAlignButton from "../TimelineAlignButton/TimelineAlignButton";
import { BUFFER, CELL_WIDTH } from "../../consts";
import useTimelineStore from "../../store";

const isProjectVisible = (project, x, trackSize, baseDate) => {
  const offset = -Math.floor((x - 1) / CELL_WIDTH); // Adjust x slightly to make it invisible when exactly at the borders

  // Calculate the dates at start & end of the viewport
  const trackStartDate = new Date(baseDate);
  trackStartDate.setDate(trackStartDate.getDate() + offset - 1);

  const trackEndDate = new Date(trackStartDate);
  trackEndDate.setDate(trackEndDate.getDate() + trackSize - BUFFER * 2);

  return project.endDate >= trackStartDate && project.startDate <= trackEndDate;
};

const TimelineItem = ({ project }) => {
  const { x, trackSize, baseDate } = useTimelineTrackContext();

  const [isVisible, setIsVisible] = useState(() =>
    isProjectVisible(project, x.get(), trackSize, baseDate)
  );
  const isInteracting = useTimelineStore(
    (state) => state.activeItem?.id === project.id
  );

  // Update visibility when one of the variables changes
  useEffect(() => {
    setIsVisible(isProjectVisible(project, x.get(), trackSize, baseDate));
  }, [x, trackSize, baseDate, project]);

  // Update visibility on x change
  useEffect(() => {
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
