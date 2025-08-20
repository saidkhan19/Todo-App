import { useMemo, useState } from "react";

import { CalendarContext } from "../context";
import useCalendarNavigation from "../hooks/useCalendarNavigation";
import { getToday } from "@/utils/date";

const CalendarProvider = ({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  children,
}) => {
  const [today] = useState(getToday());

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
