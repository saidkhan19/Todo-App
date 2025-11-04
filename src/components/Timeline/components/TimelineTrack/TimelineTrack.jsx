import { motion as Motion } from "motion/react";
import clsx from "clsx/lite";

import styles from "./TimelineTrack.module.scss";
import { daysBetween, getToday, isSameDate } from "@/utils/date";
import { BUFFER_SIZE, CELL_WIDTH } from "../../consts";
import { useTimelineTrackContext } from "../../context";
import { getRelativeOffsetPosition } from "../../utils";
import useTimelineStore from "../../store";
import useTimelineTrackDates from "../../hooks/useTimelineTrackDates";

const TimelineTrack = () => {
  const { trackHeight } = useTimelineTrackContext();
  const isInteracting = useTimelineStore((state) => Boolean(state.activeItem));
  const startDate = useTimelineStore((state) => state.activeStartDate);
  const endDate = useTimelineStore((state) => state.activeEndDate);

  const { offset, dates } = useTimelineTrackDates();
  const today = getToday();

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
        height: trackHeight,
      }}
      className={styles["track-container"]}
    >
      {isInteracting && (
        <Motion.div
          style={{ x: startPosition, y: 10, width }}
          className={styles["project-range-indicator"]}
          data-testid="range-indicator"
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
