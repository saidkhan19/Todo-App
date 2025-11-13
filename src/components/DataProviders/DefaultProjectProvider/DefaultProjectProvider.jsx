import { useMemo } from "react";

import { useDefaultProject } from "@/hooks/queries";
import { DefaultProjectContext } from "./context";
import { useTranslation } from "react-i18next";

const DefaultProjectProvider = ({ children }) => {
  const [defaultProject, loading, error] = useDefaultProject();
  const { t } = useTranslation("common");

  const defaultProjectName = t("defaultProjectName");

  const value = useMemo(
    () => ({
      defaultProject: defaultProject && {
        ...defaultProject,
        name: defaultProjectName,
      },
      loading,
      error,
    }),
    [defaultProject, defaultProjectName, loading, error]
  );

  return (
    <DefaultProjectContext.Provider value={value}>
      {children}
    </DefaultProjectContext.Provider>
  );
};

export default DefaultProjectProvider;
