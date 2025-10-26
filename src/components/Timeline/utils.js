import { daysBetween } from "@/utils/date";
import { cellWidth } from "./consts";

export const getTimelineCardStartPosition = (trackBaseDate, itemStartDate) => {
  const diff = daysBetween(trackBaseDate, itemStartDate);
  const coeff = trackBaseDate > itemStartDate ? -1 : 1;

  return coeff * diff * cellWidth;
};
