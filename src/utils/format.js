const formatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
});

export const formatDate = (date) => formatter.format(date);
