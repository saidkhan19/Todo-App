import { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";

import { TaskExpansionContext, TasksContext } from "./context";

const TaskExpansionProvider = ({ children }) => {
  const { hash } = useLocation();
  const { loadingItems, getItemById } = useContext(TasksContext);
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const selectedTaskRef = useRef();

  const selectedTask = hash.slice(1);

  useEffect(() => {
    // Run only when the hash changes and items are done loading
    if (loadingItems || selectedTaskRef.current === selectedTask) return;

    let curr = selectedTask;
    const expanded = [];

    while (curr) {
      expanded.push(curr);
      curr = getItemById(curr)?.parentId;
    }

    setExpandedTasks((prev) => new Set([...prev, ...expanded]));
    selectedTaskRef.current = selectedTask;
  }, [selectedTask, loadingItems, getItemById]);

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
