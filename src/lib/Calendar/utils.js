export const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const parseLocalDateString = (str) => {
  const [year, month, day] = str.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const generateCalendarDays = (year, month) => {
  const weeks = [];
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);

  // Determine the Monday before or equal to the first of the month
  let current = new Date(firstOfMonth);
  const day = current.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day; // Sunday (0) => go back 6 days
  current.setDate(current.getDate() + diffToMonday);

  // Determine the Sunday after or equal to the last day of the month
  const end = new Date(lastOfMonth);
  const endDay = end.getDay();
  const diffToSunday = endDay === 0 ? 0 : 7 - endDay;
  end.setDate(end.getDate() + diffToSunday);

  while (current <= end) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
};

export const datesEqual = (date1, date2) => date1.getTime() === date2.getTime();

const differenceInDays = (date1, date2) =>
  Math.floor(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

export const calculateRangePosition = (start, end, firstOfWeek, lastOfWeek) => {
  const rangeStart =
    start < firstOfWeek ? 0 : differenceInDays(firstOfWeek, start);
  const rangeEnd = end > lastOfWeek ? 0 : differenceInDays(lastOfWeek, end);

  const rangeLeft = (rangeStart * 100) / 7;
  const rangeRight = (rangeEnd * 100) / 7;
  return [rangeLeft, rangeRight];
};
