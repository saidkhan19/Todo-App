import { createContext } from "react";

export const CalendarContext = createContext({
  currentView: null,
  setPreviousMonth: () => {},
  setNextMonth: () => {},
  startDate: null,
  endDate: null,
  onChangeStartDate: () => {},
  onChangeEndDate: () => {},
});
