import { getItemById, getRootProject, getTasks } from "@/utils/dataTransforms";
import {
  getOffsetDate,
  getToday,
  getWeekdayFromMonday,
  isSameDate,
} from "@/utils/date";
import { formatDate, formatMonth } from "@/utils/format";
import { getColorPalette } from "@/utils/projects";
import { ITEMS_PER_PAGE } from "./consts";

// Labels

const getDailyLabels = (dates) => dates.map((date) => formatDate(date));

const getWeeklyLabels = (weeks) => weeks.map(([start]) => formatDate(start));

const getMonthlyLabels = (months) =>
  months.map((monthStart) => formatMonth(monthStart));

// Date range generators

const getDailyRange = (endDate, page) => {
  const offsetEnd = getOffsetDate(endDate, page * ITEMS_PER_PAGE);
  const dates = [];
  for (let i = -ITEMS_PER_PAGE + 1; i <= 0; i++) {
    dates.push(getOffsetDate(offsetEnd, i));
  }
  return dates;
};

const getWeeklyRange = (endDate, page) => {
  const weekDayOffset = getWeekdayFromMonday(endDate);
  let weekStart = getOffsetDate(endDate, -weekDayOffset);
  let weekEnd = endDate;

  if (page !== 0) {
    weekStart = getOffsetDate(weekStart, page * ITEMS_PER_PAGE * 7);
    weekEnd = getOffsetDate(weekStart, 6);
  }

  const weeks = [];
  for (let i = 0; i < ITEMS_PER_PAGE; i++) {
    weeks.push([weekStart, weekEnd]);
    weekStart = getOffsetDate(weekStart, -7);
    weekEnd = getOffsetDate(weekStart, 6);
  }
  weeks.reverse();
  return weeks;
};

const getMonthlyRange = (endDate, page) => {
  const months = [];
  const date = new Date(endDate);
  date.setMonth(date.getMonth() + page * ITEMS_PER_PAGE);

  for (let i = ITEMS_PER_PAGE - 1; i >= 0; i--) {
    const copy = new Date(date);
    copy.setMonth(date.getMonth() - i);
    months.push(copy);
  }
  return months;
};

// Grouping helpers

const groupTasksByDay = (tasks, dates) => {
  const grouped = [];
  for (const date of dates) {
    const dateTasks = tasks.filter((task) => isSameDate(task.endDate, date));
    grouped.push(dateTasks);
  }
  return grouped;
};

const groupTasksByWeek = (tasks, weeks) => {
  const grouped = [];
  for (const [start, end] of weeks) {
    const weekTasks = tasks.filter(
      (task) => task.endDate >= start && task.endDate <= end
    );
    grouped.push(weekTasks);
  }
  return grouped;
};

const groupTasksByMonth = (tasks, months) => {
  const grouped = [];
  for (const month of months) {
    const monthYear = month.getFullYear();
    const monthIndex = month.getMonth();
    const monthTasks = tasks.filter(
      (task) =>
        task.endDate.getFullYear() === monthYear &&
        task.endDate.getMonth() === monthIndex
    );
    grouped.push(monthTasks);
  }

  return grouped;
};

// Build datasets

const buildDatasets = (buckets, items, defaultProject) => {
  const projectMap = {};

  // Sort tasks into projects
  for (const [index, bucket] of buckets.entries()) {
    for (const task of bucket) {
      const project = getRootProject(task, items, defaultProject);
      if (!projectMap[project.id])
        projectMap[project.id] = new Array(buckets.length).fill(0);
      if (task.completed) projectMap[project.id][index]++;
    }
  }

  // Create an array of datapoints for each project
  return Object.entries(projectMap).map(([id, data]) => {
    const project =
      id === defaultProject.id ? defaultProject : getItemById(items, id);
    const palette = getColorPalette(project.palette);

    return {
      label: project.name,
      data,
      borderColor: palette.primary,
      backgroundColor: palette.soft,
      borderRadius: 8,
      borderWidth: 2,
    };
  });
};

const useGetChartData = (view, page, items, defaultProject) => {
  // Current day is the last data column
  const today = getToday();

  // Show only completed tasks
  const tasks = getTasks(items).filter((task) => task.completed);

  switch (view) {
    case "daily": {
      const dates = getDailyRange(today, page);
      const periodStart = dates[0];
      const periodEnd = dates[dates.length - 1];
      const currentTasks = tasks.filter(
        (t) => t.endDate >= periodStart && t.endDate <= periodEnd
      );

      const grouped = groupTasksByDay(currentTasks, dates);
      return {
        labels: getDailyLabels(dates),
        datasets: buildDatasets(grouped, items, defaultProject),
      };
    }
    case "weekly": {
      const weeks = getWeeklyRange(today, page);
      const periodStart = weeks[0][0];
      const periodEnd = weeks[weeks.length - 1][1];
      const currentTasks = tasks.filter(
        (t) => t.endDate >= periodStart && t.endDate <= periodEnd
      );

      const grouped = groupTasksByWeek(currentTasks, weeks);
      return {
        labels: getWeeklyLabels(weeks),
        datasets: buildDatasets(grouped, items, defaultProject),
      };
    }
    case "monthly": {
      const months = getMonthlyRange(today, page);
      const start = new Date(months[0].getFullYear(), months[0].getMonth(), 1);
      const end = new Date(
        months[months.length - 1].getFullYear(),
        months[months.length - 1].getMonth() + 1,
        0
      );
      const currentTasks = tasks.filter(
        (t) => t.endDate >= start && t.endDate <= end
      );

      const grouped = groupTasksByMonth(currentTasks, months);
      return {
        labels: getMonthlyLabels(months),
        datasets: buildDatasets(grouped, items, defaultProject),
      };
    }
  }
};

export default useGetChartData;
