import analytics from "@/models/analytics";
import { getTasks } from "@/utils/dataTransforms";
import { getWeekdayFromMonday } from "@/utils/date";

const labels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

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

  const dataset = {
    label: "Продуктивность",
    data: productivity,
    backgroundColor: "#6b7280",
    borderRadius: 8,
  };

  return { labels, datasets: [dataset] };
};

export default useGetChartData;
