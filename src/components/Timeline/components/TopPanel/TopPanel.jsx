import { useEffect, useState } from "react";
import { throttle } from "throttle-debounce";

import styles from "./TopPanel.module.scss";
import { formatMonthYear } from "@/utils/format";
import { useTimelineTrackContext } from "../../context";
import { cellWidth } from "../../consts";

const TopPanel = () => {
  const { x, baseDate } = useTimelineTrackContext();
  const [trackStartDate, setTrackStartDate] = useState(baseDate);

  useEffect(() => {
    const throttledHandler = throttle(30, (currentX) => {
      const offset = -Math.floor(currentX / cellWidth);

      // Calculate the date at the start of the viewport
      const trackStartDate = new Date(baseDate);
      trackStartDate.setDate(trackStartDate.getDate() + offset);

      setTrackStartDate(trackStartDate);
    });

    const unsubscribe = x.on("change", throttledHandler);

    return () => {
      unsubscribe();
      throttledHandler.cancel();
    };
  });

  return (
    <div className={styles["top-panel"]}>
      <p className={styles["month"]}>{formatMonthYear(trackStartDate)}</p>
    </div>
  );
};

export default TopPanel;
