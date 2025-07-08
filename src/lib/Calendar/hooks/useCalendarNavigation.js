import { useCallback, useState } from "react";

const useCalendarNavigation = (initialDate) => {
  const [currentView, setCurrentView] = useState(initialDate);

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

  const year = currentView.getFullYear();
  const month = currentView.getMonth();

  // Handle changing the view of the calendar, for selected month
  const alignView = useCallback(
    (date) => {
      if (date.getMonth() !== month || date.getFullYear() !== year)
        setCurrentView(new Date(date.getFullYear(), date.getMonth(), 1));
    },
    [year, month]
  );

  return { currentView, setPreviousMonth, setNextMonth, alignView };
};

export default useCalendarNavigation;
