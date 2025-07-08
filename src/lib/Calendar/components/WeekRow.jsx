import { useContext } from "react";

import styles from "../Calendar.module.scss";
import { CalendarContext } from "../context";
import { calculateRangePosition, datesEqual, formatLocalDate } from "../utils";

const getDateClass = (month, date, selected, today) => {
  let className = styles["date-cell"];

  if (date.getMonth() !== month) {
    className += " " + styles["date--ghost"];
  }

  if (selected) {
    className += " " + styles["date--selected"];
  }

  if (today) {
    className +=
      " " +
      (selected ? styles["date--today-soft"] : styles["date--today-dark"]);
  }

  return className;
};

const WeekRow = ({ days }) => {
  const { currentView, today, startDate, endDate } =
    useContext(CalendarContext);
  const month = currentView.getMonth();

  const [rangeLeft, rangeRight] = calculateRangePosition(
    startDate,
    endDate,
    days[0],
    days[6]
  );

  return (
    <div role="row" className={styles["calendar-row"]}>
      <div
        data-testid="range-indicator"
        className={styles["range-indicator"]}
        style={{ left: `${rangeLeft}%`, right: `${rangeRight}%` }}
      />
      {days.map((day) => (
        <div
          key={day.getTime()}
          role="gridcell"
          tabIndex="0"
          data-date={formatLocalDate(day)}
          className={getDateClass(
            month,
            day,
            datesEqual(day, startDate) || datesEqual(day, endDate),
            datesEqual(day, today)
          )}
        >
          <span>{day.getDate()}</span>
        </div>
      ))}
    </div>
  );
};

export default WeekRow;
