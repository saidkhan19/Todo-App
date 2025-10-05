import { DEFAULT_PROJECT_ID } from "@/consts/database";
import { getToday, isSameDate } from "./date";

export const getRootItems = (items) =>
  items?.filter((item) => item.level === 0) || [];

export const getChildren = (items, parentId) =>
  items?.filter((item) => item.parentId === parentId) || [];

export const getAllChildren = (items, parentId) => {
  const children = [];
  const queue = getChildren(items, parentId);

  while (queue.length > 0) {
    const child = queue.pop();
    children.push(child);
    queue.push(...getChildren(items, child.id));
  }

  return children;
};

export const getItemById = (items, id) => items?.find((item) => item.id === id);

export const getProjects = (items) =>
  items.filter((item) => item.type === "project");

export const getTasks = (items) => items.filter((item) => item.type === "task");

export const getTasksForToday = (items) => {
  const today = getToday();
  return items.filter(
    (item) => item.type === "task" && isSameDate(item.endDate, today)
  );
};

export const orderItemsByOrder = (items) => {
  const orderedItems = Array.from(items);
  orderedItems.sort((a, b) => a.order - b.order);
  return orderedItems;
};

export const getRootProject = (item, items, defaultProject) => {
  let curr = item;
  while (curr.parentId != null) {
    if (curr.parentId === DEFAULT_PROJECT_ID) return defaultProject;
    curr = items.find((i) => i.id === curr.parentId);
  }

  return curr;
};

export const filterItemsForWeek = (items, week) =>
  items.filter(
    (item) => week.startOfWeek <= item.endDate && week.endOfWeek >= item.endDate
  );

export const getProgressInformation = (childItems) => {
  return {
    completed: childItems.reduce(
      (prev, curr) => (curr?.completed ? prev + 1 : prev),
      0
    ),
    overall: childItems.length,
  };
};
