const formatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "short",
});

const shortWeekdayFormatter = new Intl.DateTimeFormat("ru-RU", {
  weekday: "short",
});

const longWeekdayFormatter = new Intl.DateTimeFormat("ru-RU", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export const formatDate = (date) => formatter.format(date);

export const shortFormatWeekday = (date) => shortWeekdayFormatter.format(date);

export const longFormatWeekday = (date) => longWeekdayFormatter.format(date);

export const formatMonthYear = (date) => {
  let month = date.toLocaleDateString("ru-RU", { month: "long" });
  month = month[0].toUpperCase() + month.slice(1);
  const year = date.getFullYear();

  return `${month} ${year}`;
};
