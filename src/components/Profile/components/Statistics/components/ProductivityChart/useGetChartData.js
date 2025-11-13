import analytics from "@/models/analytics";
import Week from "@/models/week";
import { getTasks } from "@/utils/dataTransforms";
import { getWeekdayFromMonday } from "@/utils/date";
import { formatWeekdaysShort } from "@/utils/format";

const useGetChartData = (items) => {
  const tasks = getTasks(items);
  const tasksByWeekday = Array.from({ length: 7 }, () => []);

  for (const task of tasks) {
    tasksByWeekday[getWeekdayFromMonday(task.endDate)].push(task);
  }

  const productivity = new Array(7);
  for (const [index, weekday] of tasksByWeekday.entries()) {
    const count = analytics.countCompletedItems(weekday);
    productivity[index] = (count.completed / count.overall) * 100;
  }

  const labels = formatWeekdaysShort(new Week().getWeekDates());

  const dataset = {
    label: "Продуктивность",
    data: productivity,
    backgroundColor: "#6b7280",
    borderRadius: 8,
  };

  return { labels, datasets: [dataset] };
};

export default useGetChartData;
