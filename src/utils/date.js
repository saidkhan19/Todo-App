export const resetToMidnight = (date) => {
  const cleanedDate = new Date(date);
  cleanedDate.setHours(0, 0, 0, 0);
  return cleanedDate;
};
