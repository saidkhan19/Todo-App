import { Outlet } from "react-router";

import DefaultProjectProvider from "../DefaultProjectProvider";
import ProjectsAndTasksProvider from "../ProjectsAndTasksProvider";

const DataProviderRoute = () => {
  return (
    <ProjectsAndTasksProvider>
      <DefaultProjectProvider>
        <Outlet />
      </DefaultProjectProvider>
    </ProjectsAndTasksProvider>
  );
};

export default DataProviderRoute;
