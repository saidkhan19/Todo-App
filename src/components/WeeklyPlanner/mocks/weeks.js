// 1. STANDARD WEEK MOCK - Regular week in middle of month
export const standardWeekMock = {
  getWeekDates: () => [
    new Date("2024-03-11"), // Monday
    new Date("2024-03-12"), // Tuesday
    new Date("2024-03-13"), // Wednesday
    new Date("2024-03-14"), // Thursday
    new Date("2024-03-15"), // Friday
    new Date("2024-03-16"), // Saturday
    new Date("2024-03-17"), // Sunday
  ],
};

// Expected hardcoded values for standard week:
export const standardWeekExpected = {
  shortWeekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  longWeekdays: [
    "Monday, March 11",
    "Tuesday, March 12",
    "Wednesday, March 13",
    "Thursday, March 14",
    "Friday, March 15",
    "Saturday, March 16",
    "Sunday, March 17",
  ],
  dates: [11, 12, 13, 14, 15, 16, 17],
};

// 2. EDGE CASE 1: Month boundary crossing (February to March)
export const monthBoundaryWeekMock = {
  getWeekDates: () => [
    new Date("2024-02-26"), // Monday (February)
    new Date("2024-02-27"), // Tuesday (February)
    new Date("2024-02-28"), // Wednesday (February)
    new Date("2024-02-29"), // Thursday (February - leap year!)
    new Date("2024-03-01"), // Friday (March)
    new Date("2024-03-02"), // Saturday (March)
    new Date("2024-03-03"), // Sunday (March)
  ],
};

// Expected hardcoded values for month boundary week:
export const monthBoundaryExpected = {
  shortWeekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  longWeekdays: [
    "Monday, February 26",
    "Tuesday, February 27",
    "Wednesday, February 28",
    "Thursday, February 29",
    "Friday, March 1",
    "Saturday, March 2",
    "Sunday, March 3",
  ],
  dates: [26, 27, 28, 29, 1, 2, 3],
};

// 3. EDGE CASE 2: Year boundary crossing (December to January)
export const yearBoundaryWeekMock = {
  getWeekDates: () => [
    new Date("2024-12-30"), // Monday (December 2024)
    new Date("2024-12-31"), // Tuesday (December 2024)
    new Date("2025-01-01"), // Wednesday (January 2025)
    new Date("2025-01-02"), // Thursday (January 2025)
    new Date("2025-01-03"), // Friday (January 2025)
    new Date("2025-01-04"), // Saturday (January 2025)
    new Date("2025-01-05"), // Sunday (January 2025)
  ],
};

// Expected hardcoded values for year boundary week:
export const yearBoundaryExpected = {
  shortWeekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  longWeekdays: [
    "Monday, December 30",
    "Tuesday, December 31",
    "Wednesday, January 1",
    "Thursday, January 2",
    "Friday, January 3",
    "Saturday, January 4",
    "Sunday, January 5",
  ],
  dates: [30, 31, 1, 2, 3, 4, 5],
};
