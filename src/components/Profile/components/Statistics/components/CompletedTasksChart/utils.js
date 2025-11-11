import { getTasks } from "@/utils/dataTransforms";
import {
  daysBetween,
  getOffsetDate,
  getToday,
  getWeekdayFromMonday,
} from "@/utils/date";
import { ITEMS_PER_PAGE } from "./consts";

export const countPages = (items, view) => {
  // Chart shows only completed tasks
  const tasks = getTasks(items).filter((task) => task.completed);
  if (tasks.length === 0) return 1;

  const oldestTask = tasks.reduce((prev, current) =>
    prev.endDate < current.endDate ? prev : current
  );
  const oldestDate = oldestTask.endDate;
  const today = getToday();

  if (oldestDate >= today) return 1;

  switch (view) {
    case "daily": {
      const delta = daysBetween(today, oldestDate);
      return Math.ceil(delta / ITEMS_PER_PAGE);
    }
    case "weekly": {
      const currentDayOffset = getWeekdayFromMonday(today);
      const oldestDayOffset = getWeekdayFromMonday(oldestDate);

      const currentWeekStart = getOffsetDate(today, -currentDayOffset);
      const oldestWeekStart = getOffsetDate(oldestDate, -oldestDayOffset);

      const delta = daysBetween(currentWeekStart, oldestWeekStart) / 7;
      return Math.ceil(delta / ITEMS_PER_PAGE);
    }
    case "monthly": {
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const oldestYear = oldestDate.getFullYear();
      const oldestMonth = oldestDate.getMonth();

      console.log(currentYear, oldestYear, currentMonth, oldestMonth);
      const delta =
        (currentYear - oldestYear) * 12 + (currentMonth - oldestMonth) + 1;
      return Math.ceil(delta / ITEMS_PER_PAGE);
    }
    default:
      return 1;
  }
};
