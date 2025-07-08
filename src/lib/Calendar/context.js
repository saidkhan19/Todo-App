import { createContext } from "react";

export const CalendarContext = createContext({
  today: null,
  currentView: null,
  setPreviousMonth: () => {},
  setNextMonth: () => {},
  alignView: () => {},
  startDate: null,
  endDate: null,
  onChangeStartDate: () => {},
  onChangeEndDate: () => {},
});
