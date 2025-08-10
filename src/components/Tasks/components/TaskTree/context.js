import { createContext } from "react";

export const TasksContext = createContext({
  items: null,
  loadingItems: false,
  errorItems: null,
  getRootItems: () => {},
  getChildren: () => {},
  getItemById: () => {},
});

export const TaskExpansionContext = createContext({
  toggleExpandedTask: () => {},
  isExpanded: () => {},
  isHighlighted: () => {},
});
