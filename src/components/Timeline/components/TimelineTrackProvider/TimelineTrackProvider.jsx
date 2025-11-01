import { useCallback, useEffect, useRef, useState } from "react";
import { useMotionValue } from "motion/react";

import { getToday } from "@/utils/date";
import { BUFFER, CELL_WIDTH } from "../../consts";
import { TimelineTrackContext } from "../../context";

const TimelineTrackProvider = ({ children }) => {
  const containerRef = useRef();
  const [baseDate, setBaseDate] = useState(getToday);
  const [trackSize, setTrackSize] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const x = useMotionValue(0);

  const setContainerSize = useCallback((clientWidth) => {
    const windowWithBUFFERs = Math.trunc(clientWidth / CELL_WIDTH) + BUFFER * 2;

    // Center current date when x is 0
    const shiftFromToday = Math.trunc(windowWithBUFFERs / 2) - BUFFER;

    // Calculate the start date of this window
    const startDate = getToday();
    startDate.setDate(startDate.getDate() - shiftFromToday);

    setContainerWidth(clientWidth);
    setTrackSize(windowWithBUFFERs);
    setBaseDate(startDate);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const clientWidth = containerRef.current.clientWidth;
    const windowWithBUFFERs = Math.trunc(clientWidth / CELL_WIDTH) + BUFFER * 2;

    // Center current date when x is 0
    const shiftFromToday = Math.trunc(windowWithBUFFERs / 2) - BUFFER;

    // Calculate the start date of this window
    const startDate = getToday();
    startDate.setDate(startDate.getDate() - shiftFromToday);

    setContainerWidth(clientWidth);
    setTrackSize(windowWithBUFFERs);
    setBaseDate(startDate);
  }, []);

  const value = {
    containerRef,
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
