import AllProjectsAndTasksProvider from "@/components/DataProviders/AllProjectsAndTasksProvider";
import ChartGroup from "./components/ChartGroup/ChartGroup";

const Statistics = () => {
  return (
    <AllProjectsAndTasksProvider>
      <ChartGroup />
    </AllProjectsAndTasksProvider>
  );
};

export default Statistics;
