import i18n from "@/config/i18n";

const getLocale = () => i18n.language || "en-US";

export const formatDate = (date) => {
  const locale = getLocale();
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  });
  return formatter.format(date);
};

export const formatMonth = (date) => {
  const locale = getLocale();
  const monthFormatter = new Intl.DateTimeFormat(locale, {
    month: "short",
  });

  return monthFormatter.format(date);
};

export const formatWeekdaysShort = (dates) => {
  const locale = getLocale();
  const shortWeekday = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  });

  return dates.map((date) => shortWeekday.format(date));
};

export const formatWeekdays = (dates) => {
  const locale = getLocale();
  const shortWeekday = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  });

  const longWeekday = new Intl.DateTimeFormat(locale, {
    weekday: "long",
  });

  return dates.map((date) => ({
    short: shortWeekday.format(date),
    long: longWeekday.format(date),
  }));
};

export const formatWeeklyPlannerHeaders = (dates) => {
  const locale = getLocale();
  const shortWeekday = new Intl.DateTimeFormat(locale, {
    weekday: "short",
  });

  const longWeekday = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return dates.map((date) => ({
    short: shortWeekday.format(date),
    long: longWeekday.format(date),
  }));
};

export const formatMonthYear = (date) => {
  const locale = getLocale();
  let month = date.toLocaleDateString(locale, { month: "long" });
  month = month[0].toUpperCase() + month.slice(1);
  const year = date.getFullYear();

  return `${month} ${year}`;
};
