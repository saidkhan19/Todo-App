import { useCallback, useState } from "react";
import { useMotionValue } from "motion/react";

import { getToday } from "@/utils/date";
import { buffer, cellWidth } from "../../consts";
import { TimelineTrackContext } from "../../context";

const TimelineTrackProvider = ({ children }) => {
  const [baseDate, setBaseDate] = useState(getToday);
  const [trackSize, setTrackSize] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);

  const setContainerSize = useCallback((clientWidth) => {
    const windowWithBuffers = Math.trunc(clientWidth / cellWidth) + buffer * 2;

    // Center current date when x is 0
    const shiftFromToday = Math.trunc(windowWithBuffers / 2) - buffer;

    // Calculate the start date of this window
    const startDate = getToday();
    startDate.setDate(startDate.getDate() - shiftFromToday);

    setContainerWidth(clientWidth);
    setTrackSize(windowWithBuffers);
    setBaseDate(startDate);
  }, []);

  const value = {
    baseDate,
    trackSize,
    x,
    containerWidth,
    setContainerSize,
  };

  return (
    <TimelineTrackContext.Provider value={value}>
      {children}
    </TimelineTrackContext.Provider>
  );
};

export default TimelineTrackProvider;
