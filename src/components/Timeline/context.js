import { createContext, useContext } from "react";

import { getToday } from "@/utils/date";
import { MIN_TRACK_HEIGHT } from "./consts";

export const TimelineTrackContext = createContext({
  containerRef: { current: null },
  x: null,
  baseDate: getToday(),
  containerWidth: 0,
  trackSize: 0,
  trackHeight: MIN_TRACK_HEIGHT,
});

export const useTimelineTrackContext = () => {
  const ctx = useContext(TimelineTrackContext);
  if (!ctx)
    throw new Error(
      "useTimelineTrackContext must be used within a TimelineTrackProvider!"
    );

  return ctx;
};
