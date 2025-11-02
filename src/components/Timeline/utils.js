import { daysBetween, getOffsetDate } from "@/utils/date";
import {
  CELL_WIDTH,
  TIMELINE_ITEM_GAP,
  TIMELINE_ITEM_HEIGHT,
  TRACK_OFFSET_BOTTOM,
  TRACK_OFFSET_TOP,
} from "./consts";

export const getTimelineTrackHeight = (projectsLength) => {
  return (
    TRACK_OFFSET_TOP +
    TRACK_OFFSET_BOTTOM +
    projectsLength * TIMELINE_ITEM_HEIGHT +
    (projectsLength - 1) * TIMELINE_ITEM_GAP
  );
};

export const getRelativeOffsetPosition = (baseDate, targetDate) => {
  const diff = daysBetween(baseDate, targetDate);
  const coeff = baseDate > targetDate ? -1 : 1;

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
