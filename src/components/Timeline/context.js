import { createContext, useContext } from "react";

import { getToday } from "@/utils/date";

export const TimelineTrackContext = createContext({
  containerRef: { current: null },
  x: null,
  baseDate: getToday(),
  trackSize: 0,
  containerWidth: 0,
});

export const useTimelineTrackContext = () => {
  const ctx = useContext(TimelineTrackContext);
  if (!ctx)
    throw new Error(
      "useTimelineTrackContext must be used within a TimelineTrackProvider!"
    );

  return ctx;
};
