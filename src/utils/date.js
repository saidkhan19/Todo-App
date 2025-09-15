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

export const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const getWeekdayFromMonday = (date) => {
  const day = date.getDay(); // 0=Sunday ... 6=Saturday
  return (day + 6) % 7;
};
