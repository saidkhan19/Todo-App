import { createContext, useContext } from "react";

export const ProjectsContext = createContext({
  items: [],
  loading: false,
  error: null,
});

export const useProjectsContext = () => {
  const ctx = useContext(ProjectsContext);
  if (!ctx)
    throw new Error(
      "useProjectsContext must be used within a ProjectsProvider!"
    );

  return ctx;
};
