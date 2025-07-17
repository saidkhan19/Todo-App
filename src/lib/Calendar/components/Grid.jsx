import { memo, useContext, useEffect, useMemo, useRef } from "react";

import styles from "../Calendar.module.scss";
import { generateCalendarDays } from "../utils";
import WeekRow from "./WeekRow";
import { CalendarContext } from "../context";
import useDateRangeSelection from "../hooks/useDateRangeSelection";
import useCalendarInteraction from "../hooks/useCalendarInteraction";

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
    alignView,
  } = useContext(CalendarContext);

  const year = currentView.getFullYear();
  const month = currentView.getMonth();

  const calendarDays = useMemo(
    () => generateCalendarDays(year, month),
    [year, month]
  );

  const { handleDateClick, handleKeyDown } = useCalendarInteraction({
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    alignView,
  });

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

  useEffect(() => {
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [handlePointerDown, handlePointerMove, handlePointerUp]);

  return (
    <div
      ref={containerRef}
      className={styles["calendar__grid"]}
      onClick={handleDateClick}
      onKeyDown={handleKeyDown}
    >
      {calendarDays.map((week, idx) => (
        <WeekRow key={idx} days={week} />
      ))}
    </div>
  );
});

export default Grid;
