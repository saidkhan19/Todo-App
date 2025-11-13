import { memo } from "react";
import clsx from "clsx/lite";

import styles from "./GridHeader.module.scss";
import { usePlannerStore } from "../../store";
import { formatWeeklyPlannerHeaders } from "@/utils/format";
import { getToday, getWeekdayFromMonday, isSameDate } from "@/utils/date";
import { useTranslation } from "react-i18next";

const GridHeader = memo(() => {
  const week = usePlannerStore((state) => state.currentWeek);
  const { t } = useTranslation("common");

  // Get header labels for each day
  const weekDates = week.getWeekDates();
  const labels = formatWeeklyPlannerHeaders(weekDates);

  // Get the current day index
  const today = getToday();
  const todayWeekdayIndex = getWeekdayFromMonday(today);
  const todayIndex = isSameDate(weekDates[todayWeekdayIndex], today)
    ? todayWeekdayIndex
    : -1;

  return (
    <div role="row" className={styles["row"]} aria-rowindex={1}>
      {weekDates.map((date, index) => {
        const selected = index === todayIndex;
        let label = labels[index].long;
        label += selected ? ` (${t("labels.today")})` : "";

        return (
          <div
            role="columnheader"
            key={date}
            className={styles["column-header"]}
            aria-label={label}
            aria-colindex={index + 1}
          >
            <span className={styles["header__weekday"]}>
              {labels[index].short}
            </span>
            <span
              className={clsx(
                styles["header__date"],
                selected && styles["is-active"]
              )}
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
