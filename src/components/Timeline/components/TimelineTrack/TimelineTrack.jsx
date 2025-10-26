import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "motion/react";
import { throttle } from "throttle-debounce";
import clsx from "clsx/lite";

import styles from "./TimelineTrack.module.scss";
import { generateDates, getToday, isSameDate } from "@/utils/date";
import { buffer, bufferSize, cellWidth } from "../../consts";
import { useTimelineTrackContext } from "../../context";

const TimelineTrack = () => {
  const { x, trackSize, baseDate } = useTimelineTrackContext();

  const [offset, setOffset] = useState(-buffer);
  const today = getToday();

  useEffect(() => {
    const throttledHandler = throttle(30, (currentX) => {
      setOffset(-Math.trunc(currentX / cellWidth) - buffer);
    });

    const unsubscribe = x.on("change", throttledHandler);

    return () => {
      unsubscribe();
      throttledHandler.cancel();
    };
  }, [x, baseDate, trackSize]);

  const dates = useMemo(() => {
    // Calculate the dates at current offset
    const startDate = new Date(baseDate);
    startDate.setDate(startDate.getDate() + offset);

    return generateDates(startDate, trackSize);
  }, [baseDate, offset, trackSize]);

  return (
    <Motion.div
      style={{
        x: offset * cellWidth,
        width: `calc(100% + ${bufferSize * 2}px)`,
        height: "170px",
      }}
      className={styles["track-container"]}
    >
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
