import { useEffect, useState } from "react";
import { throttle } from "throttle-debounce";
import { CalendarArrowDown, CalendarArrowUp } from "lucide-react";

import styles from "./TopPanel.module.scss";
import { formatDate, formatMonthYear } from "@/utils/format";
import { useTimelineTrackContext } from "../../context";
import { CELL_WIDTH } from "../../consts";
import { getOffsetDate } from "@/utils/date";
import useTimelineStore from "../../store";

const TopPanel = () => {
  const { x, baseDate } = useTimelineTrackContext();
  const [trackStartDate, setTrackStartDate] = useState(baseDate);
  const isInteracting = useTimelineStore((state) => Boolean(state.activeItem));
  const startDate = useTimelineStore((state) => state.activeStartDate);
  const endDate = useTimelineStore((state) => state.activeEndDate);

  useEffect(() => {
    const throttledHandler = throttle(30, (currentX) => {
      const offset = -Math.floor(currentX / CELL_WIDTH);

      // Calculate the date at the start of the viewport
      const trackStartDate = getOffsetDate(baseDate, offset);

      // Update only if the month is different
      setTrackStartDate((prevDate) =>
        prevDate.getFullYear() === trackStartDate.getFullYear() &&
        prevDate.getMonth() === trackStartDate.getMonth()
          ? prevDate
          : trackStartDate
      );
    });

    const unsubscribe = x.on("change", throttledHandler);

    return () => {
      unsubscribe();
      throttledHandler.cancel();
    };
  }, [x, baseDate]);

  return (
    <div className={styles["top-panel"]}>
      {isInteracting ? (
        <div className={styles["project-range"]}>
          <p className={styles["project-range__date"]}>
            <CalendarArrowUp size={14} stroke="currentColor" />
            {formatDate(startDate)}
          </p>
          -
          <p className={styles["project-range__date"]}>
            <CalendarArrowDown size={14} stroke="currentColor" />
            {formatDate(endDate)}
          </p>
        </div>
      ) : (
        <p>{formatMonthYear(trackStartDate)}</p>
      )}
    </div>
  );
};

export default TopPanel;
