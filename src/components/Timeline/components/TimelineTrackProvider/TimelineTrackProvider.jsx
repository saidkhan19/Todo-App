import { useEffect, useRef, useState } from "react";
import { useMotionValue } from "motion/react";

import { getOffsetDate, getToday } from "@/utils/date";
import { CELL_WIDTH } from "../../consts";
import { TimelineTrackContext } from "../../context";

const TimelineTrackProvider = ({ children }) => {
  const containerRef = useRef();
  const [baseDate, setBaseDate] = useState(getToday);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const clientWidth = containerRef.current.clientWidth;
    // Align the timeline so that today is at 1/3 of the viewport
    const shiftFromToday = Math.trunc(Math.trunc(clientWidth / CELL_WIDTH) / 3);
    const startDate = getOffsetDate(getToday(), -shiftFromToday);

    setContainerWidth(clientWidth);
    setBaseDate(startDate);
  }, []);

  const value = {
    containerRef,
    x,
    baseDate,
    containerWidth,
    trackSize: Math.trunc(containerWidth / CELL_WIDTH), // Number of days within the container
  };

  return (
    <TimelineTrackContext.Provider value={value}>
      {children}
    </TimelineTrackContext.Provider>
  );
};

export default TimelineTrackProvider;
