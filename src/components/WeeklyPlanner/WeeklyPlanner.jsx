import styles from "./WeeklyPlanner.module.scss";
import TopPanel from "./components/TopPanel/TopPanel";
import GridHeader from "./components/GridHeader/GridHeader";
import GridContent from "./components/GridContent/GridContent";

const WeeklyPlanner = () => {
  return (
    <div className={styles["planner"]}>
      <TopPanel />
      <div role="grid" className={styles["grid"]}>
        <GridHeader />
        <GridContent />
      </div>
    </div>
  );
};

export default WeeklyPlanner;
