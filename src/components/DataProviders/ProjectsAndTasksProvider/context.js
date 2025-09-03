import { createContext, useContext } from "react";

export const ProjectsAndTasksContext = createContext({
  items: [],
  loading: false,
  error: null,
});

export const useProjectsAndTasksContext = () => {
  const ctx = useContext(ProjectsAndTasksContext);
  if (!ctx)
    throw new Error(
      "useProjectsAndTasksContext must be used within a ProjectsAndTasksProvider!"
    );

  return ctx;
};
