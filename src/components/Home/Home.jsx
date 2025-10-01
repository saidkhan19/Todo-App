import styles from "./Home.module.scss";
import DefaultProjectProvider from "../DataProviders/DefaultProjectProvider";
import ProjectsAndTasksProvider from "../DataProviders/ProjectsAndTasksProvider";
import WeeklyPlanner from "../WeeklyPlanner";
import TasksForToday from "./components/TasksForToday/TasksForToday";

const Home = () => {
  return (
    <ProjectsAndTasksProvider>
      <DefaultProjectProvider>
        <div className={`${styles["content-surface"]} ${styles["container"]}`}>
          <section className={styles["weekly-view"]}>
            <h2 className="sr-only">Задачи на эту неделю</h2>
            <WeeklyPlanner />
          </section>
          <hr className={`hr ${styles["home__hr"]}`} />
          <section className={styles["tasks-view"]}>
            <h1 className={styles["section-header"]}>Задачи на сегодня</h1>
            <TasksForToday />
          </section>
        </div>
      </DefaultProjectProvider>
    </ProjectsAndTasksProvider>
  );
};

export default Home;
