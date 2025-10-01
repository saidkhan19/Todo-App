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
