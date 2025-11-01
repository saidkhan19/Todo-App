import { useEffect, useState } from "react";
import { throttle } from "throttle-debounce";

import styles from "./TopPanel.module.scss";
import { formatMonthYear } from "@/utils/format";
import { useTimelineTrackContext } from "../../context";
import { CELL_WIDTH } from "../../consts";
import { getOffsetDate } from "@/utils/date";

const TopPanel = () => {
  const { x, baseDate } = useTimelineTrackContext();
  const [trackStartDate, setTrackStartDate] = useState(baseDate);

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
      <p className={styles["month"]}>{formatMonthYear(trackStartDate)}</p>
    </div>
  );
};

export default TopPanel;
