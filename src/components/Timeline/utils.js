import { daysBetween } from "@/utils/date";
import { CELL_WIDTH } from "./consts";

export const getTimelineCardStartPosition = (trackBaseDate, itemStartDate) => {
  const diff = daysBetween(trackBaseDate, itemStartDate);
  const coeff = trackBaseDate > itemStartDate ? -1 : 1;

  return coeff * diff * CELL_WIDTH;
};
