import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "motion/react";
import { throttle } from "throttle-debounce";
import clsx from "clsx/lite";

import styles from "./TimelineTrack.module.scss";
import {
  daysBetween,
  generateDates,
  getOffsetDate,
  getToday,
  isSameDate,
} from "@/utils/date";
import { BUFFER, BUFFER_SIZE, CELL_WIDTH } from "../../consts";
import { useTimelineTrackContext } from "../../context";
import useTimelineStore from "../../store";
import { getRelativeOffsetPosition } from "../../utils";

const TimelineTrack = () => {
  const { x, trackSize, baseDate } = useTimelineTrackContext();
  // Track offset at the current timeline scroll position
  const [offset, setOffset] = useState(-BUFFER);
  const today = getToday();

  const isInteracting = useTimelineStore((state) => Boolean(state.activeItem));
  const startDate = useTimelineStore((state) => state.activeStartDate);
  const endDate = useTimelineStore((state) => state.activeEndDate);

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

  const dates = useMemo(() => {
    // Calculate the dates at the current offset
    const startDate = getOffsetDate(baseDate, offset);
    return generateDates(startDate, trackSize + BUFFER * 2);
  }, [baseDate, offset, trackSize]);

  let startPosition, width;
  if (isInteracting) {
    startPosition = getRelativeOffsetPosition(dates[0], startDate);
    width = (daysBetween(startDate, endDate) + 1) * CELL_WIDTH;
  }

  return (
    <Motion.div
      style={{
        x: offset * CELL_WIDTH,
        width: `calc(100% + ${BUFFER_SIZE * 2}px)`,
        height: "170px",
      }}
      className={styles["track-container"]}
    >
      {isInteracting && (
        <Motion.div
          style={{ x: startPosition, y: 10, width }}
          className={styles["project-range-indicator"]}
        />
      )}
      <div className={styles["track"]}>
        {dates.map((date) => (
          <div
            key={date.toISOString()}
            className={clsx(
              styles["date"],
              isSameDate(today, date) && styles["today"]
            )}
          >
            <div className={clsx("flex-center", styles["date__header"])}>
              <span>{date.getDate()}</span>
            </div>
            <div className={clsx(styles["date__cell"])} />
          </div>
        ))}
      </div>
    </Motion.div>
  );
};

export default TimelineTrack;
