import { memo } from "react";

import styles from "./GridHeader.module.scss";
import { usePlannerStore } from "../../store";
import { shortFormatWeekday, longFormatWeekday } from "@/utils/format";
import { isToday } from "@/utils/date";

const GridHeader = memo(() => {
  const week = usePlannerStore((state) => state.currentWeek);

  return (
    <div role="row" className={styles["row"]} aria-rowindex={1}>
      {week.getWeekDates().map((date, index) => {
        const selected = isToday(date);
        let label = longFormatWeekday(date);
        label += selected ? " (Сегодня)" : "";

        return (
          <div
            role="columnheader"
            key={date}
            className={styles["column-header"]}
            aria-label={label}
            aria-colindex={index + 1}
          >
            <span className={styles["header__weekday"]}>
              {shortFormatWeekday(date)}
            </span>
            <span
              className={`${styles["header__date"]} ${
                selected ? styles["is-active"] : ""
              }`}
            >
              <span>{date.getDate()}</span>
            </span>
          </div>
        );
      })}
    </div>
  );
});

export default GridHeader;
