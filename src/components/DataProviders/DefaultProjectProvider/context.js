import { createContext, useContext } from "react";

export const DefaultProjectContext = createContext({
  defaultProject: [],
  loading: false,
  error: null,
});

export const useDefaultProjectContext = () => {
  const ctx = useContext(DefaultProjectContext);
  if (!ctx)
    throw new Error(
      "useDefaultProjectContext must be used within a DefaultProjectProvider!"
    );

  return ctx;
};
