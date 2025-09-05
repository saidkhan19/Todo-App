import { DEFAULT_PROJECT_ID } from "@/consts/database";

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

export const getRootProject = (item, items, defaultProject) => {
  let curr = item;
  while (curr.parentId != null) {
    if (curr.parentId === DEFAULT_PROJECT_ID) return defaultProject;
    curr = items.find((i) => i.id === curr.parentId);
  }

  return curr;
};
