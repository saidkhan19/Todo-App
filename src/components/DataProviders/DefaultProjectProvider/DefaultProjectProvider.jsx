import { useMemo } from "react";

import { useDefaultProject } from "@/hooks/queries";
import { DefaultProjectContext } from "./context";

const DefaultProjectProvider = ({ children }) => {
  const [defaultProject, loading, error] = useDefaultProject();

  const value = useMemo(
    () => ({ defaultProject, loading, error }),
    [defaultProject, loading, error]
  );

  return (
    <DefaultProjectContext.Provider value={value}>
      {children}
    </DefaultProjectContext.Provider>
  );
};

export default DefaultProjectProvider;
