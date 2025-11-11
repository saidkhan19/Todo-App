import { createContext, useContext } from "react";

export const AllProjectsAndTasksContext = createContext({
  items: [],
  loading: false,
  error: null,
});

export const useAllProjectsAndTasksContext = () => {
  const ctx = useContext(AllProjectsAndTasksContext);
  if (!ctx)
    throw new Error(
      "useAllProjectsAndTasksContext must be used within a AllProjectsAndTasksProvider!"
    );

  return ctx;
};
