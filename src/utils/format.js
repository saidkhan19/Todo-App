const formatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
});

export const formatDates = (date1, date2) => {
  const formattedDate1 = formatter.format(date1);

  if (date2) {
    const formattedDate2 = formatter.format(date2);
    return `${formattedDate1}-${formattedDate2}`;
  }
  return formattedDate1;
};
