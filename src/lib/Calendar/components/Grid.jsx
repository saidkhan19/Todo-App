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

    alignView(date);

    // Only one date is selected
    if (date < startDate) {
      onChangeStartDate(date);
    } else if (date > endDate) {
      onChangeEndDate(date);
    }

    if (date > startDate && date < endDate) {
      onChangeStartDate(date);
      onChangeEndDate(date);
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
