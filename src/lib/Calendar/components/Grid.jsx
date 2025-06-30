import { memo, useCallback, useContext, useMemo, useRef } from "react";

import styles from "../Calendar.module.scss";
import { generateCalendarDays, parseLocalDateString } from "../utils";
import WeekRow from "./WeekRow";
import { CalendarContext } from "../context";
import useDateRangeSelection from "../hooks/useDateRangeSelection";

const Grid = memo(function Grid() {
  const containerRef = useRef();
  const {
    currentView,
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    setPreviousMonth,
    setNextMonth,
  } = useContext(CalendarContext);

  const year = currentView.getFullYear();
  const month = currentView.getMonth();

  const calendarDays = useMemo(
    () => generateCalendarDays(year, month),
    [year, month]
  );

  // Handle changing the view of the calendar, for selected month
  const alignView = useCallback(
    (date) => {
      const firstOfMonth = new Date(year, month, 1);
      const lastOfMonth = new Date(year, month + 1, 0);
      if (date < firstOfMonth) setPreviousMonth();
      else if (date > lastOfMonth) setNextMonth();
    },
    [year, month, setPreviousMonth, setNextMonth]
  );

  const handleDateClick = (e) => {
    const dateCell = e.target.closest("[data-date]");
    if (!dateCell) return;
    const dateString = dateCell.dataset.date;
    const date = parseLocalDateString(dateString);

    // Change the view of the calendar, if we selected outside the current month
    alignView(date);

    // Expand the range if date is outside the range
    if (date < startDate) {
      onChangeStartDate(date);
    } else if (date > endDate) {
      onChangeEndDate(date);
    }

    // Narrow the range to the single date, if selected within the current range
    if (date > startDate && date < endDate) {
      onChangeStartDate(date);
      onChangeEndDate(date);
    }
  };

  // Handle keyboard selection
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleDateClick(e);
    }
  };

  const { handlePointerDown, handlePointerMove, handlePointerUp } =
    useDateRangeSelection({
      startDate,
      endDate,
      onChangeStartDate,
      onChangeEndDate,
      alignView,
      setPreviousMonth,
      setNextMonth,
      containerRef,
    });

  return (
    <div
      ref={containerRef}
      className={styles["calendar__grid"]}
      onClick={handleDateClick}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {calendarDays.map((week, idx) => (
        <WeekRow key={idx} days={week} />
      ))}
    </div>
  );
});

export default Grid;
