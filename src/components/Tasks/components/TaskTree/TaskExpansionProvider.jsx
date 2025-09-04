import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import { TaskExpansionContext } from "./context";
import { useProjectsAndTasksContext } from "@/components/DataProviders/ProjectsAndTasksProvider";
import { getItemById } from "@/utils/dataTransforms";

const TaskExpansionProvider = ({ children }) => {
  const { hash } = useLocation();
  const { items, loading } = useProjectsAndTasksContext();
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const selectedTaskRef = useRef();

  const selectedTask = hash.slice(1);

  useEffect(() => {
    // Run only when the hash changes and items are done loading
    if (loading || selectedTaskRef.current === selectedTask) return;

    let curr = selectedTask;
    const expanded = [];

    while (curr) {
      expanded.push(curr);
      curr = getItemById(items, curr)?.parentId;
    }

    setExpandedTasks((prev) => new Set([...prev, ...expanded]));
    selectedTaskRef.current = selectedTask;
  }, [selectedTask, loading, items]);

  const value = {
    toggleExpandedTask: (id) => {
      setExpandedTasks((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    },
    isExpanded: (id) => expandedTasks.has(id),
    isHighlighted: (id) => selectedTask === id,
  };

  return (
    <TaskExpansionContext.Provider value={value}>
      {children}
    </TaskExpansionContext.Provider>
  );
};

export default TaskExpansionProvider;
