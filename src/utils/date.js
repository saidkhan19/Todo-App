export const resetToMidnight = (date) => {
  const cleanedDate = new Date(date);
  cleanedDate.setHours(0, 0, 0, 0);
  return cleanedDate;
};

export const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

export const isSameDate = (date1, date2) => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const isToday = (date) => {
  const today = new Date();
  return isSameDate(date, today);
};

export const getWeekdayFromMonday = (date) => {
  const day = date.getDay(); // 0=Sunday ... 6=Saturday
  return (day + 6) % 7;
};

export const daysBetween = (a, b) => {
  const A = new Date(a.getFullYear(), a.getMonth(), a.getDate());
  const B = new Date(b.getFullYear(), b.getMonth(), b.getDate());
  const diffInMs = Math.abs(A - B);
  return diffInMs / (1000 * 60 * 60 * 24);
};

export const generateDates = (startDate, n) => {
  const dates = [];
  const start = new Date(startDate); // ensure it's a Date object

  for (let i = 0; i < n; i++) {
    const newDate = new Date(start);
    newDate.setDate(start.getDate() + i);
    dates.push(newDate);
  }

  return dates;
};
