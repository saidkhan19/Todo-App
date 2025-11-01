import { daysBetween, getOffsetDate } from "@/utils/date";
import { CELL_WIDTH } from "./consts";

export const getTimelineCardStartPosition = (trackBaseDate, itemStartDate) => {
  const diff = daysBetween(trackBaseDate, itemStartDate);
  const coeff = trackBaseDate > itemStartDate ? -1 : 1;

  return coeff * diff * CELL_WIDTH;
};

export const isProjectVisible = (project, x, trackSize, baseDate) => {
  const offset = -Math.floor((x - 1) / CELL_WIDTH); // Adjust x slightly to make it invisible when exactly at the borders

  // Calculate the dates at start & end of the viewport
  const trackStartDate = getOffsetDate(baseDate, offset - 1);
  const trackEndDate = getOffsetDate(trackStartDate, trackSize + 1);

  // The project is within the visible window
  return project.endDate >= trackStartDate && project.startDate <= trackEndDate;
};
