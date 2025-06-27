import { useMemo } from "react";

import styles from "./Calendar.module.scss";
import Header from "./components/Header";
import GridHeader from "./components/GridHeader";
import Grid from "./components/Grid";
import CalendarProvider from "./components/CalendarProvider";
import { resetToMidnight } from "./utils";

const Calendar = ({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
}) => {
  // Set the dates to midnight
  const cleanedStardDate = useMemo(
    () => resetToMidnight(startDate),
    [startDate]
  );
  const cleanedEndDate = useMemo(() => resetToMidnight(endDate), [endDate]);

  return (
    <CalendarProvider
      startDate={cleanedStardDate}
      endDate={cleanedEndDate}
      onChangeStartDate={onChangeStartDate}
      onChangeEndDate={onChangeEndDate}
    >
      <div className={styles["calendar"]}>
        <Header />
        <div role="grid">
          <GridHeader />
          <Grid />
        </div>
      </div>
    </CalendarProvider>
  );
};

export default Calendar;

/**
  <input
      type="date"
      id="start-date"
      value={startDate}
      hidden
      aria-hidden="true"
      name="start-date"
      readOnly
    />
    <input
      type="date"
      id="end-date"
      value={endDate}
      hidden
      aria-hidden="true"
      name="end-date"
      readOnly
    />
 */
