import { useCallback, useMemo, useState } from "react";

import { CalendarContext } from "../context";

const CalendarProvider = ({
  startDate,
  endDate,
  onChangeStartDate,
  onChangeEndDate,
  children,
}) => {
  const [currentView, setCurrentView] = useState(new Date());
  const [today] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const setPreviousMonth = useCallback(() => {
    setCurrentView(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
    );
  }, []);

  const setNextMonth = useCallback(() => {
    setCurrentView(
      (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
    );
  }, []);

  const value = useMemo(
    () => ({
      currentView,
      today,
      setPreviousMonth,
      setNextMonth,
      startDate,
      endDate,
      onChangeStartDate,
      onChangeEndDate,
    }),
    [
      currentView,
      today,
      setPreviousMonth,
      setNextMonth,
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
