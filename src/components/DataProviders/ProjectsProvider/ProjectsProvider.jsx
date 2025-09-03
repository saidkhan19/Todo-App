import { useMemo } from "react";

import { useProjects } from "@/hooks/queries";
import { ProjectsContext } from "./context";

const ProjectsProvider = ({ children }) => {
  const [items, loading, error] = useProjects();

  const value = useMemo(
    () => ({ items: items ?? [], loading, error }),
    [items, loading, error]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export default ProjectsProvider;
