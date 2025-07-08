import { useMemo, useState } from "react";

import { CalendarContext } from "../context";
import useCalendarNavigation from "../hooks/useCalendarNavigation";

const CalendarProvider = ({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  children,
}) => {
  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const { currentView, setPreviousMonth, setNextMonth, alignView } =
    useCalendarNavigation(new Date());

  const value = useMemo(
    () => ({
      today,
      currentView,
      setPreviousMonth,
      setNextMonth,
      alignView,
      startDate,
      endDate,
      onChangeStartDate,
      onChangeEndDate,
    }),
    [
      today,
      currentView,
      setPreviousMonth,
      setNextMonth,
      alignView,
      startDate,
      endDate,
      onChangeStartDate,
      onChangeEndDate,
    ]
  );

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export default CalendarProvider;
