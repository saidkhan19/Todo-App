import analytics from "@/models/analytics";
import Week from "@/models/week";
import { getTasks } from "@/utils/dataTransforms";
import { getWeekdayFromMonday } from "@/utils/date";
import { formatWeekdaysShort } from "@/utils/format";
import { useTranslation } from "react-i18next";

const useGetChartData = (items) => {
  const { t } = useTranslation("profile");
  const tasks = getTasks(items);
  const labels = formatWeekdaysShort(new Week().getWeekDates());

  // If not a single task completed return empty dataset
  if (tasks.every((item) => !item.completed)) return { labels, datasets: [] };

  // Sort tasks by weekday
  const tasksByWeekday = Array.from({ length: 7 }, () => []);
  for (const task of tasks) {
    tasksByWeekday[getWeekdayFromMonday(task.endDate)].push(task);
  }

  // Calculate avarage for every weekday
  const productivity = new Array(7);
  for (const [index, weekday] of tasksByWeekday.entries()) {
    const count = analytics.countCompletedItems(weekday);
    if (count.overall === 0) productivity[index] = 0;
    else productivity[index] = (count.completed / count.overall) * 100;
  }

  const dataset = {
    label: t("productivity"),
    data: productivity,
    backgroundColor: "#6b7280",
    borderRadius: 8,
  };

  return { labels, datasets: [dataset] };
};

export default useGetChartData;
