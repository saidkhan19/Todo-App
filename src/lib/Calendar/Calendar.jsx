import { useMemo } from "react";

import styles from "./Calendar.module.scss";
import Header from "./components/Header";
import GridHeader from "./components/GridHeader";
import Grid from "./components/Grid";
import CalendarProvider from "./components/CalendarProvider";
import { resetToMidnight } from "@/utils/date";
import DateDisplay from "@/components/shared/DateDisplay";

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
      <div className={styles["calendar"]} aria-label="Календарь">
        <DateDisplay
          startDate={startDate}
          endDate={endDate}
          aria-label="Текущий выбор"
          className="sr-only"
          role="status"
          aria-live="polite"
        />

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
