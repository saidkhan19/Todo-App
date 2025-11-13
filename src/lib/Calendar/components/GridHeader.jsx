import { memo } from "react";

import styles from "../Calendar.module.scss";
import { formatWeekdays } from "@/utils/format";
import Week from "@/models/week";

const GridHeader = memo(function GridHeader() {
  const labels = formatWeekdays(new Week().getWeekDates());

  return (
    <div
      role="row"
      className={`${styles["calendar-row"]} ${styles["header-row"]}`}
    >
      {labels.map((label) => (
        <div
          key={label.short}
          role="columnheader"
          aria-label={label.long}
          className={`flex-center ${styles["column-header"]}`}
        >
          <span>{label.short}</span>
        </div>
      ))}
    </div>
  );
});

export default GridHeader;
