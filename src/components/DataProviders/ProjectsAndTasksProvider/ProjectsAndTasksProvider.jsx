import { useMemo } from "react";

import { useProjectsAndTasks } from "@/hooks/queries";
import { ProjectsAndTasksContext } from "./context";
import { mockItems } from "@/mocks/items";

const ProjectsAndTasksProvider = ({ children }) => {
  // const [items, loading, error] = useProjectsAndTasks();

  const items = mockItems;
  const loading = false;
  const error = null;

  const value = useMemo(
    () => ({ items: items ?? [], loading, error }),
    [items, loading, error]
  );

  return (
    <ProjectsAndTasksContext.Provider value={value}>
      {children}
    </ProjectsAndTasksContext.Provider>
  );
};

export default ProjectsAndTasksProvider;
