import { useEffect, useState } from "react";
import { throttle } from "throttle-debounce";

import { BUFFER, CELL_WIDTH } from "../consts";
import { useTimelineTrackContext } from "../context";
import { generateDates, getOffsetDate } from "@/utils/date";

const useTimelineTrackDates = () => {
  const { x, trackSize, baseDate } = useTimelineTrackContext();
  // Track offset at the current timeline scroll position
  const [offset, setOffset] = useState(-BUFFER);

  useEffect(() => {
    // Update offset on timeline scroll
    const throttledHandler = throttle(30, (currentX) => {
      setOffset(-Math.floor(currentX / CELL_WIDTH) - BUFFER);
    });
    const unsubscribe = x.on("change", throttledHandler);

    return () => {
      unsubscribe();
      throttledHandler.cancel();
    };
  }, [x, baseDate, trackSize]);

  const trackStart = getOffsetDate(baseDate, offset);
  const dates = generateDates(trackStart, trackSize + BUFFER * 2);

  return { offset, dates };
};

export default useTimelineTrackDates;
