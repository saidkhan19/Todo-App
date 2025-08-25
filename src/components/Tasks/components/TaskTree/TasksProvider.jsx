import { TasksContext } from "./context";
import { useMemo } from "react";
import { useProjectsAndTasks } from "@/hooks/queries";

const TasksProvider = ({ children }) => {
  const [items, loadingItems, errorItems] = useProjectsAndTasks();

  const value = useMemo(
    () => ({
      items: items || [],
      loadingItems,
      errorItems,
      getRootItems: () => items?.filter((item) => item.level === 0) || [],
      getChildren: (parentId) =>
        items?.filter((item) => item.parentId === parentId) || [],
      getItemById: (id) => items?.find((item) => item.id === id),
    }),
    [items, loadingItems, errorItems]
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};

export default TasksProvider;
