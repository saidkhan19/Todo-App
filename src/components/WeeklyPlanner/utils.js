import { formatMonthYear } from "@/utils/format";

export const getWeekHeader = (week) => {
  // Use the Thursday of the week to determine which month/year to display
  const thursday = week.getWeekDate(3);
  return formatMonthYear(thursday);
};
