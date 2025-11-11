import { useMemo } from "react";

import { useAllProjectsAndTasks } from "@/hooks/queries";
import { AllProjectsAndTasksContext } from "./context";

const AllProjectsAndTasksProvider = ({ children }) => {
  const [items, loading, error] = useAllProjectsAndTasks();

  const value = useMemo(
    () => ({ items: items ?? [], loading, error }),
    [items, loading, error]
  );

  return (
    <AllProjectsAndTasksContext.Provider value={value}>
      {children}
    </AllProjectsAndTasksContext.Provider>
  );
};

export default AllProjectsAndTasksProvider;
