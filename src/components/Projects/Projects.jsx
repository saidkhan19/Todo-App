import styles from "./Projects.module.scss";
import ProjectsAndTasksProvider from "../DataProviders/ProjectsAndTasksProvider";
import ProjectList from "./components/ProjectList/ProjectList";
import Timeline from "./components/Timeline/Timeline";

const Projects = () => {
  return (
    <ProjectsAndTasksProvider>
      <div className={`${styles["content-surface"]} ${styles["container"]}`}>
        <section>
          <h1 className={styles["section-header"]}>Проекты</h1>
          <div className={styles["projects"]}>
            <ProjectList />
          </div>
        </section>
        <section>
          <h2 className={styles["section-header"]}>График</h2>
          <div className={styles["timeline"]}>
            <Timeline />
          </div>
        </section>
      </div>
    </ProjectsAndTasksProvider>
  );
};

export default Projects;
